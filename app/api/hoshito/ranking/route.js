import { NextResponse } from 'next/server';
import { claimTrophies, hoshitoMember, ranking } from '@/lib/hoshito';

export const dynamic = 'force-dynamic';

// Ranking de esta semana (y premios del podio pendientes).
export async function GET() {
  const m = await hoshitoMember();
  if (!m?.access) return NextResponse.json({ ok: false }, { status: m ? 403 : 401 });
  return NextResponse.json({ ok: true, ...(await ranking(m.customer)) });
}

// Cobra los premios del podio de la semana pasada.
export async function POST() {
  const m = await hoshitoMember();
  if (!m?.access) return NextResponse.json({ ok: false }, { status: m ? 403 : 401 });
  return NextResponse.json(await claimTrophies(m.customer));
}
