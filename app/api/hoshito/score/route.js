import { NextResponse } from 'next/server';
import { hoshitoMember, submitScore } from '@/lib/hoshito';

export const dynamic = 'force-dynamic';

// Registra una marca para el ranking semanal.
export async function POST(req) {
  const m = await hoshitoMember();
  if (!m?.access) return NextResponse.json({ ok: false }, { status: m ? 403 : 401 });
  let body = {};
  try {
    body = await req.json();
  } catch {
    /* sin cuerpo */
  }
  return NextResponse.json(await submitScore(m.customer, String(body.game || ''), body.score));
}
