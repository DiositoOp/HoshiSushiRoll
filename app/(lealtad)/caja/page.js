import { ANY_STAFF, requireRole } from '@/lib/auth';
import { q } from '@/lib/db';
import { clock, daysAgo, minutesAgo, onlyDigits, prettyPhone } from '@/lib/format';
import { getRestaurant } from '@/lib/rules';
import AutoRefresh from '@/components/AutoRefresh';
import StaffHeader from '@/components/StaffHeader';
import StaffTabs from '@/components/StaffTabs';
import { Stamps } from '@/components/ui';
import { confirmAction, deliverAction, linkCodeAction, manualStampAction, rejectAction } from './actions';
import { STAFF_APP } from '@/lib/appMeta';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Caja · Hoshito', ...STAFF_APP };

export default async function Caja({ searchParams }) {
  const staff = await requireRole(ANY_STAFF);
  const r = await getRestaurant();
  const sp = await searchParams;
  const tel = onlyDigits(sp.tel);

  const pending = await q(
    `select v.id, v.code, v.created_at, c.name, c.stamps, p.label
       from visits v join customers c on c.id = v.customer_id left join points p on p.id = v.point_id
      where c.restaurant_id = $1 and v.status = 'pending' and v.created_at > now() - interval '3 hours'
      order by v.created_at`,
    [r.id],
  );
  const rewards = await q(
    `select w.id, w.label, c.name from rewards w join customers c on c.id = w.customer_id
      where c.restaurant_id = $1 and w.delivered_at is null order by w.created_at`,
    [r.id],
  );
  const recent = await q(
    `select type, detail, at from events
      where restaurant_id = $1 and type in ('sello', 'sello_manual', 'canje', 'registro', 'rechazo')
        and (at at time zone $2)::date = (now() at time zone $2)::date
      order by at desc limit 4`,
    [r.id, r.tz],
  );

  let found = null;
  let linkCode = null;
  if (tel.length === 10) {
    [found] = await q('select * from customers where restaurant_id = $1 and phone = $2', [r.id, tel]);
    if (found) {
      [linkCode] = await q('select code from link_codes where customer_id = $1 and expires_at > now()', [found.id]);
    }
  }

  const content = (
    <main className="screen">
      <AutoRefresh seconds={5} />

      <StaffHeader title="Caja" staff={staff} />

      <div className="row" style={{ justifyContent: 'flex-start', gap: 8 }}>
        <span className="eyebrow">Visitas por confirmar</span>
        <span className="pill ink">{pending.length}</span>
      </div>
      <p className="notice">Un sello por ticket. Confirma solo a quien paga la cuenta y rechaza las demás solicitudes de la mesa.</p>

      {pending.length === 0 && <p className="muted small">No hay visitas por confirmar.</p>}

      {pending.map((v) => {
        const completes = v.stamps + 1 >= r.stamps_goal;
        return (
          <div className="card" key={v.id}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="stack" style={{ gap: 4 }}>
                <span className="display h2">{v.name}</span>
                <span className="small muted">
                  {v.label ? `${v.label} · ` : ''}{minutesAgo(v.created_at)} · pasa de {v.stamps} a {v.stamps + 1} sellos
                </span>
                {completes && <span className="pill salmon" style={{ alignSelf: 'flex-start' }}>Completa tarjeta: gana {r.reward_label.toLowerCase()}</span>}
              </div>
              <div className="code-chip"><span className="cap">CÓDIGO</span><span className="num">{v.code}</span></div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <form action={confirmAction} style={{ flexGrow: 1 }}>
                <input type="hidden" name="visitId" value={v.id} />
                <button className="btn wide" type="submit">Confirmar sello</button>
              </form>
              <form action={rejectAction}>
                <input type="hidden" name="visitId" value={v.id} />
                <button className="btn quiet" type="submit">Rechazar</button>
              </form>
            </div>
          </div>
        );
      })}

      {rewards.length > 0 && (
        <div className="card">
          <span className="eyebrow">Premios por entregar</span>
          {rewards.map((w) => (
            <div className="row" key={w.id}>
              <span><strong>{w.name}</strong> · {w.label.toLowerCase()}</span>
              <form action={deliverAction}>
                <input type="hidden" name="rewardId" value={w.id} />
                <button className="btn ghost sm" type="submit">Marcar entregado</button>
              </form>
            </div>
          ))}
        </div>
      )}

      <div className="stack gap">
        <span className="eyebrow">Cliente sin su teléfono o con teléfono nuevo</span>
        <form action="/caja" method="get" className="row" style={{ gap: 8 }}>
          <input className="input" name="tel" type="tel" inputMode="numeric" defaultValue={tel ? prettyPhone(tel) : ''}
            placeholder="Buscar por número" aria-label="Buscar por número de celular" />
          <button className="btn ghost" type="submit">Buscar</button>
        </form>

        {tel && tel.length !== 10 && <p className="error">El número debe tener 10 dígitos.</p>}
        {tel.length === 10 && !found && (
          <p className="muted small">No hay tarjeta con ese número. El cliente se registra acercando su teléfono a la etiqueta o al QR.</p>
        )}
        {sp.aviso === 'sello' && <p className="notice green">Sello sumado a mano.</p>}
        {sp.aviso === 'limite' && <p className="notice">Este cliente ya tiene su sello de hoy.</p>}

        {found && (
          <div className="card">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="stack" style={{ gap: 2 }}>
                <span className="display h2">{found.name}</span>
                <span className="small muted">Última visita: {daysAgo(found.last_visit_at)}</span>
              </div>
              <span className="pill green">{found.stamps} de {r.stamps_goal} sellos</span>
            </div>
            <Stamps count={found.stamps} goal={r.stamps_goal} small />
            <form action={manualStampAction}>
              <input type="hidden" name="customerId" value={found.id} />
              <input type="hidden" name="tel" value={tel} />
              <button className="btn wide" type="submit">Sumar sello a mano</button>
            </form>
            {linkCode ? (
              <p className="notice green">
                Código para vincular su teléfono: <strong style={{ fontSize: 20 }}>{linkCode.code}</strong> (vale 10 minutos).
                El cliente lo escribe en <strong>/vincular</strong>.
              </p>
            ) : (
              <form action={linkCodeAction}>
                <input type="hidden" name="customerId" value={found.id} />
                <input type="hidden" name="tel" value={tel} />
                <button className="btn quiet wide" type="submit">Vincular teléfono nuevo</button>
              </form>
            )}
            <p className="small muted">Los sellos dados a mano quedan marcados con tu usuario para que el dueño los revise.</p>
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <div className="stack push">
          <span className="eyebrow">Últimos movimientos de hoy</span>
          <div className="card flat">
            {recent.map((e, i) => (
              <div className="list-row" key={i} style={{ fontSize: 14 }}>
                <span>{LABEL[e.type]} · {e.detail}</span>
                <span className="muted" style={{ whiteSpace: 'nowrap' }}>{clock(e.at, r.tz)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );

  // Caja solo tiene esta pantalla; dueño y desarrollador ven también las pestañas del panel.
  if (staff.role === 'cashier') return content;
  return (
    <div className="with-tabs">
      {content}
      <StaffTabs role={staff.role} pending={pending.length} />
    </div>
  );
}

const LABEL = { sello: 'Sello', sello_manual: 'Sello a mano', canje: 'Premio entregado', registro: 'Cliente nuevo', rechazo: 'Rechazada' };
