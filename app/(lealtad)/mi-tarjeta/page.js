import Link from 'next/link';
import { q } from '@/lib/db';
import { currentCustomer } from '@/lib/device';
import { clock } from '@/lib/format';
import { getRestaurant } from '@/lib/rules';
import AutoRefresh from '@/components/AutoRefresh';
import { Logo, Stamps } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function MiTarjeta({ searchParams }) {
  const { nuevo } = await searchParams;
  const r = await getRestaurant();
  const c = await currentCustomer();

  if (!c) {
    return (
      <main className="screen white">
        <Logo size={88} />
        <h1 className="display h1">Este teléfono aún no tiene tarjeta</h1>
        <p className="muted">
          Para registrarte, acerca tu teléfono a la etiqueta de tu mesa o escanea el código QR en {r.name}.
        </p>
        <p className="muted">¿Ya tenías tarjeta en otro teléfono? Pide un código en caja.</p>
        <Link className="btn ghost wide" href="/vincular">Tengo un código de caja</Link>
      </main>
    );
  }

  const [pending] = await q(
    `select v.code, v.created_at, p.label from visits v left join points p on p.id = v.point_id
      where v.customer_id = $1 and v.status = 'pending' and v.created_at > now() - interval '3 hours'
      order by v.id desc limit 1`,
    [c.id],
  );
  const [last] = await q(
    `select status from visits
      where customer_id = $1 and (created_at at time zone $2)::date = (now() at time zone $2)::date
      order by coalesce(decided_at, created_at) desc limit 1`,
    [c.id, r.tz],
  );
  const [{ n: rewards }] = await q(
    'select count(*)::int as n from rewards where customer_id = $1 and delivered_at is null',
    [c.id],
  );

  const firstName = c.name.split(' ')[0];
  const left = r.stamps_goal - c.stamps;
  const showReview = r.google_review_url && c.total_visits >= r.review_from_visit;

  return (
    <main className="screen">
      {pending && <AutoRefresh seconds={4} />}

      <div className="row">
        <div className="stack" style={{ gap: 2 }}>
          <span className="small muted">{nuevo ? 'Ya eres parte de la familia Hoshito' : pending ? 'Te reconocimos,' : 'Hola de nuevo,'}</span>
          <h1 className="display h1">{nuevo ? `¡Gracias, ${firstName}!` : pending ? `¡hola, ${firstName}!` : firstName}</h1>
        </div>
        <Logo size={56} />
      </div>

      {nuevo && (
        <div className="card salmon">
          <span className="eyebrow" style={{ color: 'var(--ink)' }}>Tu lealtad tiene premio</span>
          <span className="display h2">Ven {r.stamps_goal} veces y te regalamos {r.reward_label.toLowerCase()}</span>
        </div>
      )}

      {rewards > 0 && (
        <div className="card salmon">
          <span className="display h2">¡Completaste tu tarjeta!</span>
          <span>Tienes {r.reward_label.toLowerCase()} esperándote. Pídelo en caja.</span>
        </div>
      )}

      {pending && (
        <div className="card dark center" style={{ alignItems: 'center' }}>
          <span className="display" style={{ fontSize: 24 }}>Tu visita está por confirmar</span>
          <span className="muted">Al pagar, muestra esta pantalla en caja. Es un sello por ticket: lo recibe quien paga la cuenta.</span>
          <div className="code-box">
            <span className="eyebrow">Tu código de hoy</span>
            <div className="num">{pending.code}</div>
          </div>
          <span className="small muted">{pending.label ? `${pending.label} · ` : ''}registrada a las {clock(pending.created_at, r.tz)}</span>
        </div>
      )}

      {!pending && last?.status === 'confirmed' && (
        <p className="notice green"><strong>Sello de hoy confirmado por caja.</strong> ¡Gracias por tu visita!</p>
      )}
      {!pending && last?.status === 'rejected' && (
        <p className="notice">Caja no confirmó esta visita. Recuerda: es un sello por ticket.</p>
      )}

      <div className="card dark">
        <div className="row">
          <span className="display h2">Tarjeta {r.name}</span>
          <span className="display" style={{ fontSize: 28 }}>
            {c.stamps} <span className="muted" style={{ fontSize: 16 }}>de {r.stamps_goal}</span>
          </span>
        </div>
        <Stamps count={c.stamps} goal={r.stamps_goal} dark />
        <span className="muted">
          {left === 1 ? 'Te falta 1 visita' : `Te faltan ${left} visitas`} para {r.reward_label.toLowerCase()}.
        </span>
      </div>

      {showReview && !pending && (
        <div className="card">
          <div className="stack" style={{ gap: 4 }}>
            <span className="display" style={{ fontSize: 18 }}>¿Cómo te atendimos?</span>
            <span className="small muted">Tu opinión en Google ayuda a que más gente nos conozca.</span>
          </div>
          <a className="btn ghost wide" href={r.google_review_url} target="_blank" rel="noopener noreferrer">
            Calificar en Google Maps
          </a>
        </div>
      )}

      <p className="small muted center push">
        Tu tarjeta vive en este teléfono. En cada visita acércalo a la etiqueta de la mesa o escanea el QR.
        ¿Cambiaste de teléfono? Pide un código en caja.
      </p>
    </main>
  );
}
