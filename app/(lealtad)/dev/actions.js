'use server';

import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { q } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { getRestaurant, logEvent } from '@/lib/rules';

async function context() {
  const staff = await requireRole(['dev']);
  return { staff, r: await getRestaurant() };
}

function back(message) {
  redirect(`/dev?aviso=${encodeURIComponent(message)}`);
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
}

export async function addPoint(formData) {
  const { staff, r } = await context();
  const label = String(formData.get('label') || '').trim().slice(0, 40);
  const base = slugify(label);
  if (!base) back('Escribe un nombre para el punto.');
  let slug = base;
  for (let i = 2; (await q('select 1 as x from points where slug = $1', [slug])).length; i += 1) slug = `${base}-${i}`;
  await q('insert into points (restaurant_id, slug, label) values ($1, $2, $3)', [r.id, slug, label]);
  await logEvent(q, { restaurantId: r.id, type: 'config', detail: `Punto nuevo: ${label}`, staffId: staff.id });
  back('Punto creado.');
}

export async function togglePoint(formData) {
  await context();
  await q('update points set active = not active where id = $1', [Number(formData.get('id'))]);
  back('Punto actualizado.');
}

export async function saveConfig(formData) {
  const { staff, r } = await context();
  const name = String(formData.get('name') || '').trim().slice(0, 60) || r.name;
  let url = String(formData.get('google_review_url') || '').trim().slice(0, 500);
  if (url && !/^https:\/\//i.test(url)) url = '';
  const perDay = Math.min(5, Math.max(1, parseInt(formData.get('max_stamps_per_day'), 10) || 1));
  const reviewFrom = Math.min(20, Math.max(1, parseInt(formData.get('review_from_visit'), 10) || 2));
  await q(
    'update restaurants set name = $2, google_review_url = $3, max_stamps_per_day = $4, review_from_visit = $5 where id = $1',
    [r.id, name, url, perDay, reviewFrom],
  );
  await logEvent(q, { restaurantId: r.id, type: 'config', detail: 'Configuración actualizada', staffId: staff.id });
  back('Configuración guardada.');
}

export async function addStaff(formData) {
  const { staff, r } = await context();
  const name = String(formData.get('name') || '').trim().slice(0, 60);
  const username = String(formData.get('username') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const role = String(formData.get('role') || '');
  if (!name || !/^[a-z0-9._-]{3,30}$/.test(username)) back('Usuario inválido: 3 a 30 letras o números, sin espacios.');
  if (password.length < 8) back('La contraseña debe tener al menos 8 caracteres.');
  if (!['cashier', 'owner', 'dev'].includes(role)) back('Elige un rol.');
  if ((await q('select 1 as x from staff where username = $1', [username])).length) back('Ese usuario ya existe.');
  await q(
    'insert into staff (restaurant_id, username, name, role, pass_hash) values ($1, $2, $3, $4, $5)',
    [r.id, username, name, role, hashPassword(password)],
  );
  await logEvent(q, { restaurantId: r.id, type: 'config', detail: `Usuario nuevo: ${username} (${role})`, staffId: staff.id });
  back('Usuario creado.');
}

export async function toggleStaff(formData) {
  const { staff } = await context();
  const id = Number(formData.get('id'));
  if (id === staff.id) back('No puedes desactivar tu propio usuario.');
  await q('update staff set active = not active where id = $1', [id]);
  back('Usuario actualizado.');
}

export async function setPassword(formData) {
  await context();
  const password = String(formData.get('password') || '');
  if (password.length < 8) back('La contraseña debe tener al menos 8 caracteres.');
  await q('update staff set pass_hash = $2 where id = $1', [Number(formData.get('id')), hashPassword(password)]);
  back('Contraseña cambiada.');
}
