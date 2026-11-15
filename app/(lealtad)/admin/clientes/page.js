import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { q } from '@/lib/db';
import { birthday, daysAgo, prettyPhone } from '@/lib/format';
import { getRestaurant } from '@/lib/rules';
import StaffHeader from '@/components/StaffHeader';

const FILTERS = [
  ['todos', 'Todos'],
  ['completar', 'Por completar'],
  ['inactivos', 'Inactivos'],
  ['cumple', 'Cumpleaños'],
];

export default async function AdminClientes({ searchParams }) {
  const staff = await requireRole(['owner', 'dev']);
  const r = await getRestaurant();
  const sp = await searchParams;
  const f = FILTERS.some(([k]) => k === sp.f) ? sp.f : 'todos';
  const search = String(sp.q || '').trim().slice(0, 60);

  const where = ['c.restaurant_id = $1'];
  const params = [r.id];
  if (search) {
    params.push(`%${search}%`, `%${search.replace(/\D/g, '') || '~'}%`);
    where.push(`(c.name ilike $${params.length - 1} or c.phone like $${params.length})`);
  }
  if (f === 'completar') {
    params.push(r.stamps_goal - 2);
    where.push(`c.stamps >= $${params.length} and c.stamps > 0`);
  }
  if (f === 'inactivos') where.push("c.last_visit_at < now() - interval '30 days'");
  if (f === 'cumple') {
    params.push(r.tz);
    where.push(`c.birth_month = extract(month from now() at time zone $${params.length})::int`);
  }

  const rows = await q(
    `select c.*, (select count(*)::int from rewards w where w.customer_id = c.id and w.delivered_at is null) as rewards
       from customers c where ${where.join(' and ')}
      order by c.last_visit_at desc nulls last, c.created_at desc limit 200`,
    params,
  );

  return (
    <main className="screen">
      <StaffHeader title="Clientes" staff={staff} />

      <form action="/admin/clientes" method="get" className="row" style={{ gap: 8 }}>
        <input type="hidden" name="f" value={f} />
        <input className="input" name="q" type="search" defaultValue={search} placeholder="Nombre o número"
          aria-label="Buscar por nombre o número" />
        <button className="btn ghost" type="submit">Buscar</button>
      </form>

      <div className="chips">
        {FILTERS.map(([key, label]) => (
          <Link key={key} className={`chip${f === key ? ' on' : ''}`} href={`/admin/clientes?f=${key}`}>{label}</Link>
        ))}
      </div>

      {rows.length === 0 && <p className="muted small">No hay clientes con ese filtro.</p>}

      <div className="stack" style={{ gap: 8 }}>
        {rows.map((c) => {
          const inactive = c.last_visit_at && Date.now() - new Date(c.last_visit_at).getTime() > 30 * 86_400_000;
          const bday = birthday(c.birth_day, c.birth_month);
          return (
            <Link className="card client-link" key={c.id} href={`/admin/clientes/${c.id}`} style={{ padding: '12px 14px', borderRadius: 14, gap: 4, textDecoration: 'none' }}>
              <div className="row">
                <strong>{c.name}</strong>
                {c.rewards > 0
                  ? <span className="pill green">Premio listo</span>
                  : <span className={`pill${c.stamps >= r.stamps_goal - 2 && c.stamps > 0 ? ' salmon' : ''}`}>{c.stamps} de {r.stamps_goal}</span>}
              </div>
              <span className="small" style={inactive ? { color: 'var(--red)', fontWeight: 600 } : { color: 'var(--muted)' }}>
                {prettyPhone(c.phone)} · {daysAgo(c.last_visit_at)}{bday ? ` · cumple ${bday}` : ''}
              </span>
              {c.address && <span className="small muted">{c.address}</span>}
            </Link>
          );
        })}
      </div>

      <a className="btn ghost wide push" href="/admin/clientes/export">Descargar lista (Excel)</a>
    </main>
  );
}
