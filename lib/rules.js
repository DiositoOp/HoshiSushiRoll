import crypto from 'node:crypto';
import { q, tx } from './db';

// Reglas del programa de sellos. Todo cambio de sellos pasa por aquí.

export async function getRestaurant() {
  const [r] = await q('select * from restaurants order by id limit 1');
  return r;
}

export async function logEvent(run, { restaurantId, type, detail = '', customerId = null, staffId = null }) {
  await run(
    'insert into events (restaurant_id, type, detail, customer_id, staff_id) values ($1, $2, $3, $4, $5)',
    [restaurantId, type, detail, customerId, staffId],
  );
}

async function confirmedToday(run, customerId, tz) {
  const [row] = await run(
    `select count(*)::int as n from visits
      where customer_id = $1 and status = 'confirmed'
        and (decided_at at time zone $2)::date = (now() at time zone $2)::date`,
    [customerId, tz],
  );
  return row.n;
}

/**
 * El cliente acercó su teléfono: deja una visita "por confirmar" para que caja la apruebe.
 * Devuelve { status: 'pending', code } o { status: 'limit' } si ya tiene su sello de hoy.
 */
export async function ensurePendingVisit(customer, pointId, r) {
  return tx(async (run) => {
    if ((await confirmedToday(run, customer.id, r.tz)) >= r.max_stamps_per_day) return { status: 'limit' };
    const [open] = await run(
      `select code from visits where customer_id = $1 and status = 'pending'
          and created_at > now() - interval '3 hours' limit 1`,
      [customer.id],
    );
    if (open) return { status: 'pending', code: open.code };
    const used = (await run(
      `select code from visits where status = 'pending' and created_at > now() - interval '3 hours'`,
    )).map((v) => v.code);
    let code;
    let tries = 0;
    do {
      code = 10 + crypto.randomInt(90);
      tries += 1;
    } while (used.includes(code) && tries < 300);
    await run('insert into visits (customer_id, point_id, code) values ($1, $2, $3)', [customer.id, pointId, code]);
    return { status: 'pending', code };
  });
}

// Suma un sello; si completa la tarjeta, la reinicia y crea el premio por entregar.
async function applyStamp(run, customerId, r) {
  const [c] = await run('select * from customers where id = $1 for update', [customerId]);
  let stamps = c.stamps + 1;
  let reward = false;
  if (stamps >= r.stamps_goal) {
    stamps = 0;
    reward = true;
    await run('insert into rewards (customer_id, label) values ($1, $2)', [customerId, r.reward_label]);
  }
  await run(
    'update customers set stamps = $2, total_visits = total_visits + 1, last_visit_at = now() where id = $1',
    [customerId, stamps],
  );
  const shown = reward ? `${r.stamps_goal} de ${r.stamps_goal} · gana ${r.reward_label.toLowerCase()}` : `${stamps} de ${r.stamps_goal}`;
  return { name: c.name, shown };
}

/** Caja confirma una visita pendiente. */
export async function confirmVisit(visitId, staff, r) {
  return tx(async (run) => {
    const [v] = await run("select * from visits where id = $1 and status = 'pending' for update", [visitId]);
    if (!v) return { ok: false };
    if ((await confirmedToday(run, v.customer_id, r.tz)) >= r.max_stamps_per_day) {
      await run("update visits set status = 'rejected', decided_at = now(), decided_by = $2 where id = $1", [visitId, staff.id]);
      await logEvent(run, { restaurantId: r.id, type: 'bloqueado', detail: 'Segundo sello el mismo día', customerId: v.customer_id, staffId: staff.id });
      return { ok: false };
    }
    const { name, shown } = await applyStamp(run, v.customer_id, r);
    await run("update visits set status = 'confirmed', decided_at = now(), decided_by = $2 where id = $1", [visitId, staff.id]);
    await logEvent(run, { restaurantId: r.id, type: 'sello', detail: `${name} · ${shown}`, customerId: v.customer_id, staffId: staff.id });
    return { ok: true };
  });
}

/** Caja rechaza una visita pendiente (por ejemplo, otra persona de la misma cuenta). */
export async function rejectVisit(visitId, staff, r) {
  return tx(async (run) => {
    const rows = await run(
      `update visits v set status = 'rejected', decided_at = now(), decided_by = $2
         from customers c where v.id = $1 and v.status = 'pending' and c.id = v.customer_id
       returning c.id as customer_id, c.name`,
      [visitId, staff.id],
    );
    if (!rows.length) return { ok: false };
    await logEvent(run, { restaurantId: r.id, type: 'rechazo', detail: rows[0].name, customerId: rows[0].customer_id, staffId: staff.id });
    return { ok: true };
  });
}

/** Sello dado a mano por caja (cliente sin su teléfono). Queda marcado para revisión del dueño. */
export async function manualStamp(customerId, staff, r) {
  return tx(async (run) => {
    if ((await confirmedToday(run, customerId, r.tz)) >= r.max_stamps_per_day) {
      await logEvent(run, { restaurantId: r.id, type: 'bloqueado', detail: 'Segundo sello el mismo día (a mano)', customerId, staffId: staff.id });
      return { ok: false, reason: 'limit' };
    }
    const { name, shown } = await applyStamp(run, customerId, r);
    await run(
      "update visits set status = 'rejected', decided_at = now(), decided_by = $2 where customer_id = $1 and status = 'pending'",
      [customerId, staff.id],
    );
    await run(
      "insert into visits (customer_id, status, manual, decided_at, decided_by) values ($1, 'confirmed', true, now(), $2)",
      [customerId, staff.id],
    );
    await logEvent(run, { restaurantId: r.id, type: 'sello_manual', detail: `${name} · ${shown}`, customerId, staffId: staff.id });
    return { ok: true };
  });
}

/** Caja entrega el premio. */
export async function deliverReward(rewardId, staff, r) {
  return tx(async (run) => {
    const rows = await run(
      `update rewards w set delivered_at = now(), delivered_by = $2
         from customers c where w.id = $1 and w.delivered_at is null and c.id = w.customer_id
       returning c.id as customer_id, c.name, w.label`,
      [rewardId, staff.id],
    );
    if (!rows.length) return { ok: false };
    await logEvent(run, { restaurantId: r.id, type: 'canje', detail: `${rows[0].name} · ${rows[0].label}`, customerId: rows[0].customer_id, staffId: staff.id });
    return { ok: true };
  });
}

/** Código de 4 dígitos, válido 10 minutos, para vincular un teléfono nuevo a una tarjeta existente. */
export async function createLinkCode(customerId, staff) {
  return tx(async (run) => {
    await run('delete from link_codes where customer_id = $1 or expires_at < now()', [customerId]);
    for (let i = 0; i < 50; i += 1) {
      const code = String(1000 + crypto.randomInt(9000));
      const [taken] = await run('select 1 as x from link_codes where code = $1', [code]);
      if (taken) continue;
      await run(
        "insert into link_codes (code, customer_id, created_by, expires_at) values ($1, $2, $3, now() + interval '10 minutes')",
        [code, customerId, staff.id],
      );
      return code;
    }
    throw new Error('No se pudo generar el código.');
  });
}

/**
 * Corrección del dueño: suma (+1) o quita (-1) un sello sin contar como visita.
 * Si al sumar se completa la tarjeta, se reinicia y se crea el premio como en una visita normal.
 */
export async function adjustStamps(customerId, delta, reason, staff, r) {
  return tx(async (run) => {
    const [c] = await run('select * from customers where id = $1 and restaurant_id = $2 for update', [customerId, r.id]);
    if (!c) return { ok: false, reason: 'missing' };
    let stamps = c.stamps + delta;
    if (stamps < 0) return { ok: false, reason: 'zero' };
    let reward = false;
    if (stamps >= r.stamps_goal) {
      stamps = 0;
      reward = true;
      await run('insert into rewards (customer_id, label) values ($1, $2)', [customerId, r.reward_label]);
    }
    await run('update customers set stamps = $2 where id = $1', [customerId, stamps]);
    const what = delta > 0 ? '+1 sello' : '-1 sello';
    const result = reward ? `completa tarjeta, gana ${r.reward_label.toLowerCase()}` : `queda en ${stamps} de ${r.stamps_goal}`;
    await logEvent(run, { restaurantId: r.id, type: 'ajuste', detail: `${c.name} · ${what} · ${result} · Motivo: ${reason}`, customerId, staffId: staff.id });
    return { ok: true, reward };
  });
}
