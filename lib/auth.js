import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { q } from './db';

const COOKIE = 'hoshi_staff';
const HOURS = 12;

export const ROLE_LABEL = { dev: 'Desarrollador', owner: 'Administrador', cashier: 'Caja' };
export const ANY_STAFF = ['cashier', 'owner', 'dev'];

function secret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === 'production' && process.env.LOCAL_DB !== '1') {
    throw new Error('Falta SESSION_SECRET.');
  }
  return 'solo-para-desarrollo-local';
}

function sign(data) {
  return crypto.createHmac('sha256', secret()).update(data).digest('base64url');
}

export function homeFor(role) {
  return role === 'dev' ? '/dev' : role === 'owner' ? '/admin' : '/caja';
}

export async function createSession(staffId) {
  const payload = Buffer.from(JSON.stringify({ id: staffId, exp: Date.now() + HOURS * 3600_000 })).toString('base64url');
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.LOCAL_DB !== '1',
    sameSite: 'lax',
    path: '/',
    maxAge: HOURS * 3600,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** Devuelve el usuario del personal con sesión válida, o null. */
export async function currentStaff() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, mac] = raw.split('.');
  if (!payload || !mac) return null;
  const expected = sign(payload);
  if (mac.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return null;
  }
  if (!data.id || data.exp < Date.now()) return null;
  const [staff] = await q('select id, restaurant_id, username, name, role from staff where id = $1 and active', [data.id]);
  return staff || null;
}

/** Exige sesión con uno de los roles; si no, manda al inicio de sesión o a su pantalla. */
export async function requireRole(roles) {
  const staff = await currentStaff();
  if (!staff) redirect('/staff/login');
  if (!roles.includes(staff.role)) redirect(homeFor(staff.role));
  return staff;
}
