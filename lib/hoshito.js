import crypto from 'node:crypto';
import { q, tx } from './db';
import { currentCustomer } from './device';
import { CAMINO, RANK_GAMES, RANK_LOWER, RANK_MAX, RANK_PRIZES, RARITY, pickRuleta } from './hoshitoRewards';
import { getRestaurant } from './rules';
import { onlyDigits } from './format';

// Lógica del servidor de Hoshito. Lo que no se puede falsear (giros, camino de visitas,
// objetos exclusivos) se decide aquí; monedas, nivel y cuidados viven en el estado del juego.

const MAX_STATE_BYTES = 200_000;

/** Cliente de este teléfono si tiene acceso a Hoshito; si no, { customer, access: false } o null. */
export async function hoshitoMember() {
  const c = await currentCustomer();
  if (!c) return null;
  return { customer: c, access: !!c.hoshito_access };
}

export async function payloadFor(c) {
  const [pet] = await q('select state from hoshito_pets where customer_id = $1', [c.id]);
  const [{ n: spins }] = await q('select count(*)::int as n from hoshito_spins where customer_id = $1 and opened_at is null', [c.id]);
  const unlocks = await q('select item_id, source from hoshito_unlocks where customer_id = $1', [c.id]);
  return {
    name: c.name.split(' ')[0],
    visits: c.total_visits,
    spins,
    state: pet?.state || null,
    owned: unlocks.filter((u) => u.source !== 'camino').map((u) => u.item_id),
    camino: unlocks.filter((u) => u.source === 'camino').map((u) => Number(u.item_id.split(':')[1])),
  };
}

export async function saveState(c, state) {
  const json = JSON.stringify(state);
  if (!state || typeof state !== 'object' || json.length > MAX_STATE_BYTES) return false;
  await q(
    `insert into hoshito_pets (customer_id, state, updated_at) values ($1, $2::jsonb, now())
     on conflict (customer_id) do update set state = excluded.state, updated_at = now()`,
    [c.id, json],
  );
  return true;
}

function rnd() {
  return crypto.randomInt(1_000_000) / 1_000_000;
}

/** Abre el siguiente giro pendiente y decide el premio. */
export async function openSpin(c) {
  return tx(async (run) => {
    const [spin] = await run(
      'select id from hoshito_spins where customer_id = $1 and opened_at is null order by id limit 1 for update',
      [c.id],
    );
    if (!spin) return { ok: false, reason: 'none' };
    const prize = pickRuleta(rnd);
    const result = { ok: true, id: prize.id, rarity: prize.rarity, type: prize.type, amount: prize.amount || 0, food: prize.food || null, duplicate: false };
    if (prize.type === 'item' || prize.type === 'theme') {
      const [has] = await run('select 1 as x from hoshito_unlocks where customer_id = $1 and item_id = $2', [c.id, prize.id]);
      if (has) {
        result.duplicate = true;
        result.amount = RARITY[prize.rarity].dupCoins;
      } else {
        await run("insert into hoshito_unlocks (customer_id, item_id, source) values ($1, $2, 'ruleta')", [c.id, prize.id]);
      }
    }
    await run('update hoshito_spins set opened_at = now(), prize = $2, rarity = $3 where id = $1', [spin.id, prize.id, prize.rarity]);
    const [{ n }] = await run('select count(*)::int as n from hoshito_spins where customer_id = $1 and opened_at is null', [c.id]);
    result.left = n;
    return result;
  });
}

/** Cobra el premio del camino de visitas si ya llegó a esas visitas. */
export async function claimCamino(c, visits) {
  const step = CAMINO.find((s) => s.visits === visits);
  if (!step) return { ok: false, reason: 'missing' };
  if (c.total_visits < visits) return { ok: false, reason: 'locked' };
  return tx(async (run) => {
    const rows = await run(
      "insert into hoshito_unlocks (customer_id, item_id, source) values ($1, $2, 'camino') on conflict do nothing returning item_id",
      [c.id, `camino:${visits}`],
    );
    if (!rows.length) return { ok: false, reason: 'claimed' };
    if (step.type === 'item' || step.type === 'theme') {
      await run("insert into hoshito_unlocks (customer_id, item_id, source) values ($1, $2, 'visita') on conflict do nothing", [c.id, step.id]);
    }
    return { ok: true, ...step };
  });
}

/** El dueño da o quita el acceso. Al darlo por primera vez se regala un giro de bienvenida. */
export async function setAccess(run, customerId, on) {
  await run('update customers set hoshito_access = $2 where id = $1', [customerId, on]);
  if (!on) return;
  const [any] = await run('select 1 as x from hoshito_spins where customer_id = $1 limit 1', [customerId]);
  if (!any) await run("insert into hoshito_spins (customer_id, reason) values ($1, 'bienvenida')", [customerId]);
}

// ===================== RANKING SEMANAL =====================
// La semana va de lunes a domingo, en el horario del restaurante.
async function weeks() {
  const r = await getRestaurant();
  const [w] = await q(
    `select to_char(now() at time zone $1, 'IYYY-"W"IW') as now,
            to_char((now() at time zone $1) - interval '7 days', 'IYYY-"W"IW') as last`,
    [r.tz],
  );
  return w;
}

function shortName(name) {
  const p = String(name).trim().split(/\s+/);
  return p.length > 1 ? `${p[0]} ${p[1][0]}.` : p[0];
}

/** Guarda la marca si es la mejor de la semana para ese juego. */
export async function submitScore(c, game, score) {
  if (!RANK_GAMES.includes(game)) return { ok: false };
  score = Math.floor(Number(score));
  const lower = !!RANK_LOWER[game];
  if (!Number.isFinite(score) || score > RANK_MAX[game] || (lower ? score < 8 : score < 1)) return { ok: false };
  const { now } = await weeks();
  await q(
    `insert into hoshito_scores (customer_id, game, week, score) values ($1, $2, $3, $4)
     on conflict (customer_id, game, week) do update set score = ${lower ? 'least' : 'greatest'}(hoshito_scores.score, excluded.score),
       updated_at = case when excluded.score ${lower ? '<' : '>'} hoshito_scores.score then now() else hoshito_scores.updated_at end`,
    [c.id, game, now, score],
  );
  return { ok: true };
}

async function podium(week, game) {
  const lower = !!RANK_LOWER[game];
  return q(
    `select s.customer_id, s.score, c.name from hoshito_scores s join customers c on c.id = s.customer_id
      where s.week = $1 and s.game = $2 and c.hoshito_access
      order by s.score ${lower ? 'asc' : 'desc'}, s.updated_at asc limit 10`,
    [week, game],
  );
}

/** Ranking de esta semana y premios del podio de la semana pasada que faltan por cobrar. */
export async function ranking(c) {
  const w = await weeks();
  const games = {};
  for (const g of RANK_GAMES) {
    const rows = await podium(w.now, g);
    const top = rows.slice(0, 5).map((x, i) => ({ place: i + 1, name: shortName(x.name), score: x.score, me: x.customer_id === c.id }));
    const [mine] = await q('select score from hoshito_scores where customer_id = $1 and game = $2 and week = $3', [c.id, g, w.now]);
    const myPlace = rows.findIndex((x) => x.customer_id === c.id);
    games[g] = { top, mine: mine ? mine.score : null, place: myPlace >= 0 ? myPlace + 1 : null };
  }
  const pending = await pendingTrophies(c, w.last);
  return { week: w.now, games, pending };
}

async function pendingTrophies(c, lastWeek) {
  const out = [];
  for (const g of RANK_GAMES) {
    const rows = (await podium(lastWeek, g)).slice(0, RANK_PRIZES.length);
    const i = rows.findIndex((x) => x.customer_id === c.id);
    if (i < 0) continue;
    const [got] = await q('select 1 as x from hoshito_trophies where customer_id = $1 and week = $2 and game = $3', [c.id, lastWeek, g]);
    if (!got) out.push({ game: g, place: i + 1, coins: RANK_PRIZES[i] });
  }
  return out;
}

/** Cobra los premios del podio de la semana pasada. El primer lugar también da la medalla. */
export async function claimTrophies(c) {
  const { last } = await weeks();
  const list = await pendingTrophies(c, last);
  if (!list.length) return { ok: false };
  let coins = 0;
  let medal = false;
  await tx(async (run) => {
    for (const t of list) {
      const rows = await run(
        'insert into hoshito_trophies (customer_id, week, game, place) values ($1, $2, $3, $4) on conflict do nothing returning game',
        [c.id, last, t.game, t.place],
      );
      if (!rows.length) continue;
      coins += t.coins;
      if (t.place === 1) {
        const m = await run("insert into hoshito_unlocks (customer_id, item_id, source) values ($1, 'medalla-oro', 'ranking') on conflict do nothing returning item_id", [c.id]);
        if (m.length) medal = true;
      }
    }
  });
  return { ok: true, list, coins, medal };
}

// ===================== AMIGOS =====================
// La comunidad es chica (solo quien tiene acceso), así que todos pueden ver la lista y visitarse.
// Nunca se muestra el teléfono de nadie: solo nombre corto y su Hoshito.
export const GIFTS_PER_DAY = 5;
export const SALUDO_COINS = 5;
export const SALUDOS_PAGADOS = 3;

async function today() {
  const r = await getRestaurant();
  const [d] = await q("select to_char(now() at time zone $1, 'YYYY-MM-DD') as d", [r.tz]);
  return d.d;
}

const isId = (v) => typeof v === 'string' && /^[0-9a-f-]{36}$/i.test(v);

/** Solo lo necesario para dibujar al Hoshito de otra persona. */
function publicPet(state) {
  const s = state || {};
  const str = (v) => (typeof v === 'string' && v.length < 40 ? v : null);
  const num = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);
  const wear = {};
  for (const k of ['head', 'face', 'neck', 'aura', 'skin']) wear[k] = str(s.wear?.[k]);
  const themes = {};
  for (const k of Object.keys(s.themes || {}).slice(0, 10)) if (str(s.themes[k])) themes[k] = s.themes[k];
  const best = {};
  for (const k of Object.keys(s.best || {}).slice(0, 10)) best[k] = num(s.best[k]);
  return {
    level: Math.max(1, num(s.level)),
    wear,
    themes,
    best,
    hunger: num(s.hunger),
    happy: num(s.happy),
    clean: num(s.clean),
    energy: num(s.energy),
    sleeping: !!s.sleeping,
  };
}

async function member(id) {
  if (!isId(id)) return null;
  const [m] = await q(
    `select c.id, c.name, c.restaurant_id, p.state, p.updated_at from customers c join hoshito_pets p on p.customer_id = c.id
      where c.id = $1 and c.hoshito_access`,
    [id],
  );
  return m || null;
}

/** Amigos, el resto de la comunidad y cuántos regalos le quedan hoy. */
export async function friendsList(c) {
  const day = await today();
  const rows = await q(
    `select c.id, c.name, p.state->>'level' as level, p.updated_at,
            (f.friend_id is not null) as friend,
            exists (select 1 from hoshito_gifts g where g.from_id = $1 and g.to_id = c.id and g.day = $3 and g.kind = 'saludo') as saludado
       from customers c
       join hoshito_pets p on p.customer_id = c.id
       left join hoshito_friends f on f.customer_id = $1 and f.friend_id = c.id
      where c.hoshito_access and c.id <> $1 and c.restaurant_id = $2
      order by friend desc, p.updated_at desc
      limit 80`,
    [c.id, c.restaurant_id, day],
  );
  const [{ n }] = await q("select count(*)::int as n from hoshito_gifts where from_id = $1 and day = $2 and kind = 'comida'", [c.id, day]);
  const list = rows.map((r) => ({
    id: r.id,
    name: shortName(r.name),
    level: Math.max(1, Number(r.level) || 1),
    friend: !!r.friend,
    saludado: !!r.saludado,
    seen: r.updated_at,
  }));
  return { friends: list.filter((x) => x.friend), community: list.filter((x) => !x.friend), giftsLeft: Math.max(0, GIFTS_PER_DAY - n) };
}

/** Lo que se ve al visitar el Hoshito de alguien. */
export async function visitPet(c, id) {
  const m = await member(id);
  if (!m || m.id === c.id || m.restaurant_id !== c.restaurant_id) return { ok: false, reason: 'missing' };
  const day = await today();
  const [f] = await q('select 1 as x from hoshito_friends where customer_id = $1 and friend_id = $2', [c.id, id]);
  const [s] = await q("select 1 as x from hoshito_gifts where from_id = $1 and to_id = $2 and day = $3 and kind = 'saludo'", [c.id, id, day]);
  return { ok: true, id: m.id, name: shortName(m.name), friend: !!f, saludado: !!s, seen: m.updated_at, pet: publicPet(m.state) };
}

/** Agregar por número de teléfono (los 10 dígitos). */
export async function addFriendByPhone(c, phone) {
  const d = onlyDigits(phone).slice(-10);
  if (d.length !== 10) return { ok: false, reason: 'phone' };
  const [m] = await q(
    `select c.id, c.name from customers c join hoshito_pets p on p.customer_id = c.id
      where c.restaurant_id = $1 and right(regexp_replace(c.phone, '[^0-9]', '', 'g'), 10) = $2 and c.hoshito_access`,
    [c.restaurant_id, d],
  );
  if (!m) return { ok: false, reason: 'notfound' };
  if (m.id === c.id) return { ok: false, reason: 'self' };
  await q('insert into hoshito_friends (customer_id, friend_id) values ($1, $2) on conflict do nothing', [c.id, m.id]);
  return { ok: true, id: m.id, name: shortName(m.name) };
}

export async function setFriend(c, id, on) {
  const m = await member(id);
  if (!m || m.id === c.id || m.restaurant_id !== c.restaurant_id) return { ok: false };
  if (on) await q('insert into hoshito_friends (customer_id, friend_id) values ($1, $2) on conflict do nothing', [c.id, id]);
  else await q('delete from hoshito_friends where customer_id = $1 and friend_id = $2', [c.id, id]);
  return { ok: true, friend: on };
}

/** Saludo: uno al día por persona. Los primeros saludos del día dan unas monedas a quien saluda. */
export async function sendSaludo(c, id) {
  const m = await member(id);
  if (!m || m.id === c.id || m.restaurant_id !== c.restaurant_id) return { ok: false, reason: 'missing' };
  const day = await today();
  const rows = await q(
    "insert into hoshito_gifts (from_id, to_id, kind, day) values ($1, $2, 'saludo', $3) on conflict do nothing returning id",
    [c.id, id, day],
  );
  if (!rows.length) return { ok: false, reason: 'done' };
  const [{ n }] = await q("select count(*)::int as n from hoshito_gifts where from_id = $1 and day = $2 and kind = 'saludo'", [c.id, day]);
  return { ok: true, coins: n <= SALUDOS_PAGADOS ? SALUDO_COINS : 0 };
}

/** Regalo de comida (sale de la nevera de quien regala; el juego la descuenta). */
export async function sendFood(c, id, food) {
  if (typeof food !== 'string' || !/^[a-z0-9-]{1,24}$/.test(food)) return { ok: false, reason: 'food' };
  const m = await member(id);
  if (!m || m.id === c.id || m.restaurant_id !== c.restaurant_id) return { ok: false, reason: 'missing' };
  const day = await today();
  return tx(async (run) => {
    await run('select id from customers where id = $1 for update', [c.id]);
    const [{ n }] = await run("select count(*)::int as n from hoshito_gifts where from_id = $1 and day = $2 and kind = 'comida'", [c.id, day]);
    if (n >= GIFTS_PER_DAY) return { ok: false, reason: 'limit' };
    await run("insert into hoshito_gifts (from_id, to_id, kind, food, day) values ($1, $2, 'comida', $3, $4)", [c.id, id, food, day]);
    return { ok: true, left: GIFTS_PER_DAY - n - 1 };
  });
}

/** Abre el buzón: entrega los saludos y regalos pendientes y los marca como recibidos. */
export async function claimInbox(c) {
  const rows = await q(
    `update hoshito_gifts g set claimed_at = now() from customers f
      where g.to_id = $1 and g.claimed_at is null and f.id = g.from_id
      returning g.kind, g.food, f.name`,
    [c.id],
  );
  return { ok: true, list: rows.slice(0, 40).map((r) => ({ kind: r.kind, food: r.food, from: shortName(r.name) })) };
}
