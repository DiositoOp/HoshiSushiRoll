/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@electric-sql/pglite', 'pg'],
  // La web y la tarjeta tienen diseños separados; esta opción permite una sola página de "no encontrado".
  experimental: { globalNotFound: true },
};

export default nextConfig;
