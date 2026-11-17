import { NextResponse } from 'next/server';
import { hoshitoMember, payloadFor, saveState } from '@/lib/hoshito';

export const dynamic = 'force-dynamic';

const deny = (status) => NextResponse.json({ ok: false }, { status });

// Estado del juego del cliente de este teléfono.
export async function GET() {
  const m = await hoshitoMember();
  if (!m) return deny(401);
  if (!m.access) return deny(403);
  return NextResponse.json({ ok: true, ...(await payloadFor(m.customer)) });
}

// Guarda el estado (lo manda el juego cada vez que pasa algo).
export async function PUT(req) {
  const m = await hoshitoMember();
  if (!m) return deny(401);
  if (!m.access) return deny(403);
  let body;
  try {
    body = await req.json();
  } catch {
    return deny(400);
  }
  const ok = await saveState(m.customer, body?.state);
  return ok ? NextResponse.json({ ok: true }) : deny(400);
}
