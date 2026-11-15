import QRCode from 'qrcode';
import { currentStaff } from '@/lib/auth';
import { baseUrl } from '@/lib/baseurl';
import { q } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Descarga el código QR (SVG, listo para imprimir) de un punto de registro.
export async function GET(_request, { params }) {
  const staff = await currentStaff();
  if (!staff || staff.role !== 'dev') return new Response('No autorizado', { status: 401 });
  const { slug } = await params;
  const [point] = await q('select slug from points where slug = $1', [slug]);
  if (!point) return new Response('No existe', { status: 404 });
  const svg = await QRCode.toString(`${await baseUrl()}/r/${point.slug}`, { type: 'svg', margin: 2, width: 600, errorCorrectionLevel: 'M' });
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': `attachment; filename="qr-${point.slug}.svg"`,
    },
  });
}
