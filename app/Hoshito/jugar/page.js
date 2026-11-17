import localFont from 'next/font/local';
import { hoshitoMember, payloadFor } from '@/lib/hoshito';
import Game from './Game';
import './jugar.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hoshito · tu mascota',
  description: 'La mascota virtual de la comunidad Hoshi Sushi Roll.',
  robots: { index: false, follow: false },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b1210' };

const title = localFont({ src: './fonts/fredoka-700.woff2', weight: '700', variable: '--hj-title', display: 'swap' });
const display = localFont({ src: './fonts/barlow-condensed-700.woff2', weight: '700', variable: '--hj-display', display: 'swap' });

function Gate({ heading, text, href, label }) {
  return (
    <main className={`hj hj-gate ${title.variable} ${display.variable}`}>
      <div className="gate">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hoshito/aro.svg" alt="" width={120} height={120} />
        <h1>{heading}</h1>
        <p>{text}</p>
        <a href={href}>{label}</a>
      </div>
    </main>
  );
}

export default async function Jugar() {
  const member = await hoshitoMember();
  if (!member) {
    return (
      <Gate
        heading="Hoshito vive en tu tarjeta"
        text="Abre esta página en el teléfono donde tienes tu tarjeta de sellos de Hoshi."
        href="/mi-tarjeta"
        label="Ir a mi tarjeta"
      />
    );
  }
  if (!member.access) {
    return (
      <Gate
        heading="Hoshito es para la familia Hoshi"
        text="Es un rincón para clientes muy frecuentes, el equipo y amigos de la casa. Si crees que deberías tener acceso, pregunta en caja."
        href="/mi-tarjeta"
        label="Volver a mi tarjeta"
      />
    );
  }
  const initial = await payloadFor(member.customer);
  return (
    <main className={`hj ${title.variable} ${display.variable}`}>
      <Game initial={initial} />
    </main>
  );
}
