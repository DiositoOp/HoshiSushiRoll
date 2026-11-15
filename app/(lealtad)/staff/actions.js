'use server';

import { redirect } from 'next/navigation';
import { createSession, destroySession, homeFor } from '@/lib/auth';
import { q } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

export async function login(_prev, formData) {
  const username = String(formData.get('username') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const [staff] = await q('select id, role, pass_hash from staff where username = $1 and active', [username]);
  if (!staff || !verifyPassword(password, staff.pass_hash)) {
    return { error: 'Usuario o contraseña incorrectos.', username };
  }
  await createSession(staff.id);
  redirect(homeFor(staff.role));
}

export async function logout() {
  await destroySession();
  redirect('/staff/login');
}
