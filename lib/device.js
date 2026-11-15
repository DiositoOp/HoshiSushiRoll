import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { q } from './db';

// El "teléfono vinculado" es una cookie que pone el servidor. En la base solo se guarda su hash.
const COOKIE = 'hoshi_device';
const TWO_YEARS = 60 * 60 * 24 * 730;

function hash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Cliente dueño de este teléfono, o null si el teléfono no está vinculado. */
export async function currentCustomer() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [row] = await q(
    `select c.* from devices d join customers c on c.id = d.customer_id where d.token_hash = $1`,
    [hash(token)],
  );
  return row || null;
}

/**
 * Vincula este teléfono con el cliente. Solo se puede llamar desde una acción del servidor.
 * run: función de consulta (de una transacción o q). exclusive: desvincula los teléfonos anteriores.
 */
export async function linkThisDevice(run, customerId, { exclusive = false } = {}) {
  const token = crypto.randomBytes(32).toString('base64url');
  if (exclusive) await run('delete from devices where customer_id = $1', [customerId]);
  await run('insert into devices (customer_id, token_hash) values ($1, $2)', [customerId, hash(token)]);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && process.env.LOCAL_DB !== '1',
    sameSite: 'lax',
    path: '/',
    maxAge: TWO_YEARS,
  });
}
