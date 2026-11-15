import { currentStaff } from '@/lib/auth';
import { q } from '@/lib/db';
import { getRestaurant } from '@/lib/rules';

export const dynamic = 'force-dynamic';

// Evita que Excel interprete como fórmula un texto que empiece con = + - @
function cell(value) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const staff = await currentStaff();
  if (!staff || !['owner', 'dev'].includes(staff.role)) return new Response('No autorizado', { status: 401 });
  const r = await getRestaurant();
  const rows = await q(
    `select name, phone, birth_day, birth_month, address, stamps, total_visits, last_visit_at, created_at
       from customers where restaurant_id = $1 order by created_at`,
    [r.id],
  );
  const date = (d) => (d ? new Date(d).toLocaleDateString('es-MX', { timeZone: r.tz }) : '');
  const lines = [
    ['Nombre', 'Celular', 'Cumpleaños', 'Dirección', 'Sellos', 'Visitas totales', 'Última visita', 'Registro'].map(cell).join(','),
    ...rows.map((c) => [
      c.name, c.phone, c.birth_day ? `${c.birth_day}/${c.birth_month}` : '', c.address,
      c.stamps, c.total_visits, date(c.last_visit_at), date(c.created_at),
    ].map(cell).join(',')),
  ];
  // BOM para que Excel abra los acentos correctamente.
  return new Response(`﻿${lines.join('\r\n')}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="clientes-hoshito.csv"',
    },
  });
}
