export function Star({ size = 26 }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  );
}

/** Logo de Hoshi Sushi Roll (public/logo.png). decorative = sin texto alternativo cuando el nombre ya está escrito al lado. */
export function Logo({ size = 48, decorative = false }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="logo"
      src="/logo.png"
      width={size}
      height={size}
      alt={decorative ? '' : 'Hoshi Sushi Roll'}
    />
  );
}

/** Tarjeta de sellos. small = una sola fila compacta (caja y pantalla de espera). */
export function Stamps({ count, goal, dark = false, small = false }) {
  return (
    <div
      className={`stamps${dark ? ' on-dark' : ''}${small ? ' small' : ''}`}
      style={{ gridTemplateColumns: small ? `repeat(${goal}, minmax(0, 32px))` : 'repeat(4, minmax(0, 1fr))' }}
      role="img"
      aria-label={`${count} de ${goal} sellos`}
    >
      {Array.from({ length: goal }, (_, i) => i + 1).map((n) => {
        if (n <= count) {
          return (
            <span key={n} className="stamp filled">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {!small && <img className="stamp-logo" src="/logo.png" alt="" />}
            </span>
          );
        }
        if (n === goal) return <span key={n} className="stamp prize">{!small && 'Premio'}</span>;
        return <span key={n} className="stamp empty">{!small && n}</span>;
      })}
    </div>
  );
}
