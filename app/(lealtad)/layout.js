import './lealtad.css';
import { CUSTOMER_APP } from '@/lib/appMeta';

export const metadata = {
  title: 'Hoshito · Tarjeta de cliente frecuente',
  description: 'Programa de sellos de Hoshito, sushi japo-mex en Minatitlán.',
  ...CUSTOMER_APP,
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#111114', viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
