// Layout propio de /Hoshito. Hace falta porque el layout principal del sitio
// está dentro de otra carpeta y esta página quedaba fuera de él.
export default function HoshitoLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: '#0b1210' }}>{children}</body>
    </html>
  );
}
