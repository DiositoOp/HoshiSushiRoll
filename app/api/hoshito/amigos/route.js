import { NextResponse } from 'next/server';
import { addFriendByPhone, claimInbox, friendsList, hoshitoMember, sendFood, sendSaludo, setFriend, visitPet } from '@/lib/hoshito';

export const dynamic = 'force-dynamic';

const deny = (status) => NextResponse.json({ ok: false }, { status });

// Lista de amigos y comunidad; con ?id= devuelve el Hoshito de esa persona para visitarlo.
export async function GET(req) {
  const m = await hoshitoMember();
  if (!m) return deny(401);
  if (!m.access) return deny(403);
  const id = new URL(req.url).searchParams.get('id');
  if (id) return NextResponse.json(await visitPet(m.customer, id));
  return NextResponse.json({ ok: true, ...(await friendsList(m.customer)) });
}

// Acciones: agregar por teléfono, agregar/quitar, saludar, regalar comida y abrir el buzón.
export async function POST(req) {
  const m = await hoshitoMember();
  if (!m) return deny(401);
  if (!m.access) return deny(403);
  let b;
  try {
    b = await req.json();
  } catch {
    return deny(400);
  }
  const c = m.customer;
  switch (b?.action) {
    case 'phone':
      return NextResponse.json(await addFriendByPhone(c, b.phone));
    case 'add':
      return NextResponse.json(await setFriend(c, b.id, true));
    case 'remove':
      return NextResponse.json(await setFriend(c, b.id, false));
    case 'saludo':
      return NextResponse.json(await sendSaludo(c, b.id));
    case 'regalo':
      return NextResponse.json(await sendFood(c, b.id, b.food));
    case 'buzon':
      return NextResponse.json(await claimInbox(c));
    default:
      return deny(400);
  }
}
