'use server';

import { redirect } from 'next/navigation';
import { q, tx } from '@/lib/db';
import { linkThisDevice } from '@/lib/device';
import { onlyDigits } from '@/lib/format';
import { ensurePendingVisit, getRestaurant, logEvent } from '@/lib/rules';

export async function register(_prev, formData) {
  const name = String(formData.get('name') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  const phone = onlyDigits(formData.get('phone'));
  const address = String(formData.get('address') || '').trim().slice(0, 200) || null;
  let day = parseInt(formData.get('birth_day'), 10);
  let month = parseInt(formData.get('birth_month'), 10);
  // La fecha solo cuenta si vienen día y mes válidos.
  if (!(day >= 1 && day <= 31 && month >= 1 && month <= 12)) {
    day = null;
    month = null;
  }

  // Lo opcional que ya escribió el cliente se devuelve para que el formulario no se vacíe si hay error.
  const values = { day: day || '', month: month || '', address: address || '' };

  if (name.length < 2 || phone.length !== 10) {
    return { values, error: 'Revisa tu nombre y que tu número tenga 10 dígitos.' };
  }

  const [point] = await q('select * from points where slug = $1 and active', [String(formData.get('punto') || '')]);
  if (!point) return { values, error: 'Este punto de registro ya no está activo. Pide ayuda en caja.' };
  const r = await getRestaurant();

  const result = await tx(async (run) => {
    const [dup] = await run('select id from customers where restaurant_id = $1 and phone = $2', [r.id, phone]);
    if (dup) return { exists: true };
    const [c] = await run(
      `insert into customers (restaurant_id, name, phone, birth_day, birth_month, address, point_id)
       values ($1, $2, $3, $4, $5, $6, $7) returning id`,
      [r.id, name, phone, day, month, address, point.id],
    );
    await linkThisDevice(run, c.id);
    await logEvent(run, { restaurantId: r.id, type: 'registro', detail: `${name} · ${point.label}`, customerId: c.id });
    return { id: c.id };
  });

  if (result.exists) {
    return { values, exists: true, error: 'Este número ya tiene tarjeta. Si es tuyo, pide en caja un código para usarla en este teléfono.' };
  }

  // El registro ocurre durante una visita: queda por confirmar en caja como cualquier otra.
  await ensurePendingVisit({ id: result.id }, point.id, r);
  redirect('/mi-tarjeta?nuevo=1');
}
