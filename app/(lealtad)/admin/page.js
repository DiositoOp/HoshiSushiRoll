import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { q } from '@/lib/db';
import { getRestaurant } from '@/lib/rules';
import StaffHeader from '@/components/StaffHeader';

export default async function AdminResumen() {
  const staff = await requireRole(['owner', 'dev']);
  const r = await getRestaurant();
  const [s] = await q(
    `select
      (select count(*)::int from customers where restaurant_id = $1) as customers,
      (select count(*)::int from customers where restaurant_id = $1 and created_at > now() - interval '7 days') as new_customers,
      (select count(*)::int from visits v join customers c on c.id = v.customer_id
         where c.restaurant_id = $1 and v.status = 'confirmed' and v.decided_at > now() - interval '7 days') as visits,
      (select count(*)::int from rewards w join customers c on c.id = w.customer_id
         where c.restaurant_id = $1 and w.created_at > now() - interval '7 days') as rewards,
      (select count(*)::int from customers where restaurant_id = $1 and stamps >= $2 - 2 and stamps > 0) as near,
      (select count(*)::int from customers where restaurant_id = $1
         and birth_month = extract(month from now() at time zone $3)::int) as birthdays,
      (select count(*)::int from customers where restaurant_id = $1 and last_visit_at < now() - interval '30 days') as inactive,
      (select count(*)::int from rewards w join customers c on c.id = w.customer_id
         where c.restaurant_id = $1 and w.delivered_at is null) as to_deliver,
      (select count(*)::int from visits v join customers c on c.id = v.customer_id
         where c.restaurant_id = $1 and v.manual and v.decided_at > now() - interval '7 days') as manual,
      (select count(*)::int from visits v join customers c on c.id = v.customer_id
         where c.restaurant_id = $1 and v.status = 'rejected' and v.decided_at > now() - interval '7 days') as rejected,
      (select count(*)::int from events where restaurant_id = $1 and type = 'ajuste' and at > now() - interval '7 days') as adjustments`,
    [r.id, r.stamps_goal, r.tz],
  );

  return (
    <main className="screen">
      <StaffHeader title="Resumen" staff={staff} />
      <h2 className="eyebrow">Últimos 7 días</h2>

      <div className="kpis">
        <div className="kpi"><span className="small muted">Clientes registrados</span><span className="num">{s.customers}</span><span className="small" style={{ color: 'var(--green)', fontWeight: 600 }}>{s.new_customers} nuevos</span></div>
        <div className="kpi"><span className="small muted">Visitas con sello</span><span className="num">{s.visits}</span><span className="small muted">confirmadas en caja</span></div>
        <div className="kpi"><span className="small muted">Premios ganados</span><span className="num">{s.rewards}</span><span className="small muted">tarjetas completas</span></div>
        <div className="kpi salmon"><span className="small">Por completar tarjeta</span><span className="num">{s.near}</span><span className="small">les faltan 1 o 2 sellos</span></div>
      </div>

      <div className="card flat">
        <Link className="list-row" href="/admin/clientes?f=cumple"><span>Cumpleaños este mes</span><span className="row-end"><strong>{s.birthdays}</strong><Chevron /></span></Link>
        <Link className="list-row" href="/admin/clientes?f=inactivos"><span>Sin venir en más de 30 días</span><span className="row-end"><strong>{s.inactive}</strong><Chevron /></span></Link>
        <Link className="list-row" href="/caja"><span>Premios por entregar</span><span className="row-end"><strong>{s.to_deliver}</strong><Chevron /></span></Link>
      </div>

      <div className="card">
        <span className="eyebrow">Revisar</span>
        <div className="row small"><span>Sellos dados a mano por caja</span><strong>{s.manual}</strong></div>
        <div className="row small"><span>Visitas rechazadas</span><strong>{s.rejected}</strong></div>
        <div className="row small"><span>Sellos corregidos por el dueño</span><strong>{s.adjustments}</strong></div>
      </div>

      <div className="card dark">
        <div className="row">
          <div className="stack" style={{ gap: 2 }}>
            <span className="eyebrow" style={{ color: '#d6d6dc' }}>Promoción actual</span>
            <span className="display" style={{ fontSize: 17 }}>{r.stamps_goal} visitas = {r.reward_label.toLowerCase()}</span>
          </div>
          <Link className="btn light sm" href="/admin/promocion">Editar</Link>
        </div>
      </div>
    </main>
  );
}

function Chevron() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
