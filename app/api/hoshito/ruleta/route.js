import { NextResponse } from 'next/server';
import { hoshitoMember, openSpin } from '@/lib/hoshito';

export const dynamic = 'force-dynamic';

// Gira la ruleta: usa un giro pendiente y el servidor decide el premio.
export async function POST() {
  const m = await hoshitoMember();
  if (!m?.access) return NextResponse.json({ ok: false }, { status: m ? 403 : 401 });
  return NextResponse.json(await openSpin(m.customer));
}
