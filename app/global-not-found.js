import './(sitio)/sitio.css';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

// Página de "no encontrado" para todo el dominio (la web y la tarjeta tienen diseños separados).
export const metadata = { title: 'Página no encontrada · Hoshi Sushi Roll', robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="es-MX">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <Header />
        <main id="contenido" className="block">
          <div className="wrap not-found">
            <img src="/logo.png" alt="" width="120" height="120" />
            <h1 className="display h2">Esta página no existe</h1>
            <p className="muted lead">Pero el menú sí, y está completo.</p>
            <div className="actions">
              <Link className="btn btn-primary" href="/menu">Ver el menú</Link>
              <Link className="btn btn-ghost" href="/">Ir al inicio</Link>
            </div>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
