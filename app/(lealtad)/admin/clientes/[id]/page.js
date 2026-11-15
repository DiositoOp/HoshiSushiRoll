import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { q } from '@/lib/db';
import { dayAndClock, daysAgo, prettyPhone } from '@/lib/format';
import { getRestaurant } from '@/lib/rules';
import StaffHeader from '@/components/StaffHeader';
import { Stamps } from '@/components/ui';
import { adjustAction } from './actions';
import ProfileForm from './ProfileForm';

const AVISOS = {
  perfil: ['green', 'Datos guardados.'],
  mas: ['green', 'Sello sumado.'],
  menos: ['green', 'Sello quitado.'],
  premio: ['green', 'Sello sumado: completó su tarjeta y su premio quedó listo para entregar en caja.'],
  cero: ['', 'No tiene sellos que quitar.'],
  motivo: ['', 'Escribe el motivo del ajuste (por ejemplo: "sello de más por error").'],
  error: ['', 'No se pudo hacer el ajuste. Intenta de nuevo.'],
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const HISTORY_LABEL = {
  sello: 'Sello en caja',
  sello_manual: 'Sello a mano',
  rechazo: 'Visita rechazada',
  canje: 'Premio entregado',
  registro: 'Registro',
  vinculo: 'Teléfono nuevo',
  ajuste: 'Corrección',
  edicion: 'Datos editados',
  bloqueado: 'Sello bloqueado',
};

export default async function ClienteDetalle({ params, searchParams }) {
  const staff = await requireRole(['owner', 'dev']);
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const r = await getRestaurant();
  const [c] = await q('select * from customers where id = $1 and restaurant_id = $2', [id, r.id]);
  if (!c) notFound();
  const { aviso } = await searchParams;
  const notice = AVISOS[aviso];

  const [{ n: rewards }] = await q('select count(*)::int as n from rewards where customer_id = $1 and delivered_at is null', [c.id]);
  const history = await q(
    `select e.at, e.type, e.detail, s.name as staff_name from events e left join staff s on s.id = e.staff_id
      where e.customer_id = $1 order by e.at desc limit 15`,
    [c.id],
  );

  return (
    <main className="screen">
      <StaffHeader title="Cliente" staff={staff} />
      <Link className="back" href="/admin/clientes">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        Volver a clientes
      </Link>

      {notice && <p className={`notice ${notice[0]}`} role="status">{notice[1]}</p>}

      <div className="card dark">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="stack" style={{ gap: 2 }}>
            <span className="display h2">{c.name}</span>
            <span className="small muted">{prettyPhone(c.phone)} · {c.total_visits === 1 ? '1 visita' : `${c.total_visits} visitas`} · {c.last_visit_at ? `última ${daysAgo(c.last_visit_at)}` : 'aún sin visitas confirmadas'}</span>
          </div>
          <span className="display" style={{ fontSize: 26, whiteSpace: 'nowrap' }}>
            {c.stamps} <span className="muted" style={{ fontSize: 15 }}>de {r.stamps_goal}</span>
          </span>
        </div>
        <Stamps count={c.stamps} goal={r.stamps_goal} dark small />
        {rewards > 0 && <span className="pill salmon" style={{ alignSelf: 'flex-start' }}>Tiene {rewards === 1 ? 'un premio' : `${rewards} premios`} por entregar</span>}
      </div>

      <form action={adjustAction} className="card">
        <h2 className="display h2">Corregir sellos</h2>
        <p className="small muted">Úsalo si caja se equivocó. No cuenta como visita y queda registrado con tu nombre.</p>
        <input type="hidden" name="id" value={c.id} />
        <div className="stack">
          <label className="label" htmlFor="reason">Motivo</label>
          <input className="input" id="reason" name="reason" required minLength={3} maxLength={120} placeholder='Ej. "se le confirmó a otra persona"' />
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn quiet" type="submit" name="delta" value="-1" disabled={c.stamps === 0} style={{ flex: 1 }}>− Quitar sello</button>
          <button className="btn" type="submit" name="delta" value="1" style={{ flex: 1 }}>+ Sumar sello</button>
        </div>
      </form>

      <ProfileForm customer={c} />

      <div className="card">
        <h2 className="display h2">Historial</h2>
        {history.length === 0 && <p className="small muted">Sin movimientos.</p>}
        <div className="history">
          {history.map((e, i) => (
            <div key={i}>
              <span>
                <strong>{HISTORY_LABEL[e.type] || e.type}</strong>
                {e.type === 'ajuste' || e.type === 'edicion' ? <span className="muted"> · {e.detail.split(' · ').slice(1).join(' · ')}</span> : null}
                {e.staff_name ? <span className="muted"> · {e.staff_name}</span> : null}
              </span>
              <span className="muted" style={{ whiteSpace: 'nowrap' }}>{dayAndClock(e.at, r.tz)}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
