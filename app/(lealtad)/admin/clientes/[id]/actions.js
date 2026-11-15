'use server';

import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { q } from '@/lib/db';
import { onlyDigits } from '@/lib/format';
import { adjustStamps, getRestaurant, logEvent } from '@/lib/rules';

function back(id, aviso) {
  redirect(`/admin/clientes/${id}?aviso=${aviso}`);
}

export async function saveProfile(_prev, formData) {
  const staff = await requireRole(['owner', 'dev']);
  const r = await getRestaurant();
  const id = String(formData.get('id'));
  const name = String(formData.get('name') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  const phone = onlyDigits(formData.get('phone'));
  const address = String(formData.get('address') || '').trim().slice(0, 200) || null;
  let day = parseInt(formData.get('birth_day'), 10);
  let month = parseInt(formData.get('birth_month'), 10);
  if (!(day >= 1 && day <= 31 && month >= 1 && month <= 12)) {
    day = null;
    month = null;
  }

  if (name.length < 2) return { error: 'El nombre debe tener al menos 2 letras.' };
  if (phone.length !== 10) return { error: 'El número debe tener 10 dígitos.' };

  const [before] = await q('select * from customers where id = $1 and restaurant_id = $2', [id, r.id]);
  if (!before) return { error: 'Este cliente ya no existe.' };
  const [dup] = await q('select name from customers where restaurant_id = $1 and phone = $2 and id <> $3', [r.id, phone, id]);
  if (dup) return { error: `Ese número ya es de otro cliente (${dup.name}).` };

  await q(
    'update customers set name = $2, phone = $3, birth_day = $4, birth_month = $5, address = $6 where id = $1',
    [id, name, phone, day, month, address],
  );

  // Registro de qué cambió, para el historial de la consola.
  const changes = [];
  if (before.name !== name) changes.push(`nombre: ${before.name} → ${name}`);
  if (before.phone !== phone) changes.push(`número: ${before.phone} → ${phone}`);
  if (before.birth_day !== day || before.birth_month !== month) changes.push('cumpleaños');
  if ((before.address || null) !== address) changes.push('dirección');
  if (changes.length) {
    await logEvent(q, { restaurantId: r.id, type: 'edicion', detail: `${name} · ${changes.join(', ')}`, customerId: id, staffId: staff.id });
  }
  back(id, 'perfil');
}

export async function adjustAction(formData) {
  const staff = await requireRole(['owner', 'dev']);
  const r = await getRestaurant();
  const id = String(formData.get('id'));
  const delta = formData.get('delta') === '1' ? 1 : -1;
  const reason = String(formData.get('reason') || '').trim().slice(0, 120);
  if (reason.length < 3) back(id, 'motivo');
  const result = await adjustStamps(id, delta, reason, staff, r);
  if (!result.ok) back(id, result.reason === 'zero' ? 'cero' : 'error');
  back(id, result.reward ? 'premio' : delta > 0 ? 'mas' : 'menos');
}
