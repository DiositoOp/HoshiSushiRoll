'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Vuelve a pedir los datos de la página cada cierto tiempo (caja y pantalla de espera del cliente). */
export default function AutoRefresh({ seconds = 5 }) {
  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh();
    }, seconds * 1000);
    return () => clearInterval(timer);
  }, [router, seconds]);
  return null;
}
