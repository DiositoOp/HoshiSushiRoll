import { q } from './db';

/** Visitas por confirmar en las últimas 3 horas (para el globo de la pestaña Caja). */
export async function pendingCount(restaurantId) {
  const [row] = await q(
    `select count(*)::int as n from visits v join customers c on c.id = v.customer_id
      where c.restaurant_id = $1 and v.status = 'pending' and v.created_at > now() - interval '3 hours'`,
    [restaurantId],
  );
  return row.n;
}
