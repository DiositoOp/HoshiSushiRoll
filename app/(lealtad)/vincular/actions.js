'use server';

import { redirect } from 'next/navigation';
import { tx } from '@/lib/db';
import { linkThisDevice } from '@/lib/device';
import { onlyDigits } from '@/lib/format';
import { getRestaurant, logEvent } from '@/lib/rules';

export async function redeemLinkCode(_prev, formData) {
  const code = onlyDigits(formData.get('code'));
  if (code.length !== 4) return { error: 'El código tiene 4 dígitos.' };
  const r = await getRestaurant();

  const linked = await tx(async (run) => {
    // El código es de un solo uso: se borra al canjearlo.
    const [row] = await run(
      'delete from link_codes where code = $1 and expires_at > now() returning customer_id, created_by',
      [code],
    );
    if (!row) return false;
    await linkThisDevice(run, row.customer_id, { exclusive: true });
    await logEvent(run, { restaurantId: r.id, type: 'vinculo', detail: 'Teléfono nuevo vinculado', customerId: row.customer_id, staffId: row.created_by });
    return true;
  });

  if (!linked) return { error: 'Código incorrecto o vencido. Pide uno nuevo en caja.' };
  redirect('/mi-tarjeta');
}
