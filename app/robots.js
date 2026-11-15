import { siteUrl } from '@/data/site';

// Google indexa la web; las pantallas de la tarjeta y del personal quedan fuera de los buscadores.
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/caja', '/dev', '/staff', '/r/', '/mi-tarjeta', '/vincular'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
