'use client';

import { useEffect, useRef } from 'react';

// Monta el juego (engine.js) en el navegador. initial: datos del cliente que manda el servidor.
export default function Game({ initial }) {
  const ref = useRef(null);
  useEffect(() => {
    let stop = null;
    let alive = true;
    import('./engine').then(({ start }) => {
      if (alive && ref.current) stop = start(ref.current, { ...initial, api: '/api/hoshito' });
    });
    return () => {
      alive = false;
      if (stop) stop();
    };
  }, [initial]);
  return <div ref={ref} className="hj-mount" />;
}
