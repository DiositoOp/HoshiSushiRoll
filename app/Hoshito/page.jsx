import localFont from 'next/font/local';
import HoshitoMascot from './HoshitoMascot';
import './hoshito.css';

const fredoka = localFont({ src: './jugar/fonts/fredoka-700.woff2', weight: '700', variable: '--hoshito-title', display: 'swap' });
const barlow = localFont({ src: './jugar/fonts/barlow-condensed-700.woff2', weight: '700', variable: '--hoshito-display', display: 'swap' });

export const metadata = {
  title: 'Hoshito · Hoshi Sushi Roll',
  description: 'Conoce a Hoshito, la mascota de Hoshi Sushi Roll. Hazlo reaccionar.',
};

export default function HoshitoPage() {
  return (
    <main className={`hoshito-page ${fredoka.variable} ${barlow.variable}`}>
      <h1 className="hoshito-title">Hoshito</h1>
      <HoshitoMascot />
    </main>
  );
}
