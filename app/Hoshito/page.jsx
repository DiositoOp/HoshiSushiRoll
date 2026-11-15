import { Barlow_Condensed, Fredoka } from 'next/font/google';
import HoshitoMascot from './HoshitoMascot';
import './hoshito.css';

const fredoka = Fredoka({ subsets: ['latin'], weight: '700', variable: '--hoshito-title' });
const barlow = Barlow_Condensed({ subsets: ['latin'], weight: '700', variable: '--hoshito-display' });

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
