import { requireRole } from '@/lib/auth';
import { getRestaurant } from '@/lib/rules';
import StaffHeader from '@/components/StaffHeader';
import { savePromo } from './actions';

export default async function AdminPromocion({ searchParams }) {
  const staff = await requireRole(['owner', 'dev']);
  const r = await getRestaurant();
  const { ok } = await searchParams;

  return (
    <main className="screen">
      <StaffHeader title="Promoción" staff={staff} />
      <p className="muted">Lo que cambies aquí se ve de inmediato en la tarjeta de todos los clientes.</p>
      {ok && <p className="notice green">Cambios guardados.</p>}

      <form action={savePromo} className="card">
        <div className="stack">
          <label className="label" htmlFor="goal">Visitas necesarias</label>
          <input className="input" id="goal" name="stamps_goal" type="number" min="2" max="20" defaultValue={r.stamps_goal} required />
        </div>
        <div className="stack">
          <label className="label" htmlFor="reward">Premio</label>
          <input className="input" id="reward" name="reward_label" defaultValue={r.reward_label} maxLength={60} required />
          <span className="small muted">Se lee así: “Ven {r.stamps_goal} veces y te regalamos {r.reward_label.toLowerCase()}”.</span>
        </div>
        <div className="stack">
          <label className="label" htmlFor="maps">Enlace de reseñas en Google Maps <span className="opt">(opcional)</span></label>
          <input className="input" id="maps" name="google_review_url" type="url" defaultValue={r.google_review_url} placeholder="https://…" />
          <span className="small muted">El botón de reseña aparece para todos los clientes desde su visita número {r.review_from_visit}.</span>
        </div>
        <button className="btn wide" type="submit">Guardar cambios</button>
      </form>
    </main>
  );
}
