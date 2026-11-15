import { headers } from 'next/headers';

/** Dirección pública del sitio (https://tu-dominio), tomada de la petición. */
export async function baseUrl() {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}
