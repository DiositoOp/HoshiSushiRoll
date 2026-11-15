import { notFound, redirect } from 'next/navigation';
import { q } from '@/lib/db';
import { currentCustomer } from '@/lib/device';
import { ensurePendingVisit, getRestaurant } from '@/lib/rules';
import { Logo } from '@/components/ui';
import RegisterForm from './RegisterForm';

export const dynamic = 'force-dynamic';

// Destino de las etiquetas NFC y los códigos QR: /r/mesa-1, /r/caja, etc.
export default async function PuntoPage({ params }) {
  const { punto } = await params;
  const [point] = await q('select * from points where slug = $1 and active', [punto]);
  if (!point) notFound();
  const r = await getRestaurant();

  // Teléfono ya vinculado: deja la visita por confirmar y muestra la tarjeta.
  const customer = await currentCustomer();
  if (customer) {
    await ensurePendingVisit(customer, point.id, r);
    redirect('/mi-tarjeta');
  }

  await q('update points set opens = opens + 1 where id = $1', [point.id]);

  return (
    <main className="screen white">
      <div className="row" style={{ justifyContent: 'flex-start' }}>
        <Logo size={64} decorative />
        <div className="stack" style={{ gap: 0 }}>
          <span className="display" style={{ fontSize: 22 }}>{r.name}</span>
          <span className="small muted">Sushi japo-mex · Minatitlán</span>
        </div>
      </div>
      <div className="stack">
        <h1 className="display h1">Tu tarjeta de cliente frecuente</h1>
        <p className="muted">
          Regístrate una sola vez. Ven {r.stamps_goal} veces y te regalamos {r.reward_label.toLowerCase()}.
        </p>
      </div>
      <RegisterForm punto={punto} />
    </main>
  );
}
