import { NextResponse } from 'next/server';
import { claimCamino, hoshitoMember } from '@/lib/hoshito';

export const dynamic = 'force-dynamic';

// Cobra un premio del camino de visitas.
export async function POST(req) {
  const m = await hoshitoMember();
  if (!m?.access) return NextResponse.json({ ok: false }, { status: m ? 403 : 401 });
  let visits = 0;
  try {
    visits = Number((await req.json())?.visits) || 0;
  } catch {
    /* sin cuerpo */
  }
  return NextResponse.json(await claimCamino(m.customer, visits));
}
