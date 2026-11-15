import Link from 'next/link';
import { Logo } from '@/components/ui';

// Se ve cuando una etiqueta o un QR apunta a un punto que ya no existe o se desactivó.
export default function NotFound() {
  return (
    <main className="screen white">
      <Logo size={88} />
      <h1 className="display h1">Esta página no está disponible</h1>
      <p className="muted">
        Si escaneaste una etiqueta o un código QR en el restaurante, pide ayuda en caja para registrar tu visita.
      </p>
      <Link className="btn wide" href="/mi-tarjeta">Ver mi tarjeta</Link>
      <Link className="btn ghost wide" href="/">Ir a la página de Hoshi</Link>
    </main>
  );
}
