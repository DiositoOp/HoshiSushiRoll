import { SCHEMA } from './schema';
import { hashPassword } from './password';

// Una sola conexión por proceso (sobrevive a las recargas de desarrollo).
const g = globalThis;

async function connect() {
  let impl;
  if (process.env.DATABASE_URL) {
    const { default: pg } = await import('pg');
    const url = process.env.DATABASE_URL;
    const local = /localhost|127\.0\.0\.1/.test(url);
    const pool = new pg.Pool({
      connectionString: url,
      max: 5,
      ssl: local ? false : { rejectUnauthorized: false },
    });
    impl = {
      q: async (text, params) => (await pool.query(text, params)).rows,
      exec: (sql) => pool.query(sql),
      tx: async (fn) => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const result = await fn(async (text, params) => (await client.query(text, params)).rows);
          await client.query('COMMIT');
          return result;
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      },
    };
  } else {
    if (process.env.NODE_ENV === 'production' && process.env.LOCAL_DB !== '1') {
      throw new Error('Falta DATABASE_URL. En producción se necesita una base Postgres.');
    }
    const fs = await import('node:fs');
    const { PGlite } = await import('@electric-sql/pglite');
    fs.mkdirSync('.data', { recursive: true });
    const db = new PGlite('.data/pglite');
    impl = {
      q: async (text, params) => (await db.query(text, params)).rows,
      exec: (sql) => db.exec(sql),
      tx: (fn) => db.transaction((t) => fn(async (text, params) => (await t.query(text, params)).rows)),
    };
  }
  await impl.exec(SCHEMA);
  await seed(impl);
  return impl;
}

// Primer arranque: crea el restaurante, puntos de registro de ejemplo y el usuario desarrollador.
async function seed(impl) {
  const existing = await impl.q('select id from restaurants limit 1');
  if (existing.length) return;
  const user = process.env.BOOTSTRAP_USER || 'dev';
  const password = process.env.BOOTSTRAP_PASSWORD || (process.env.NODE_ENV === 'production' ? null : 'cambia-esta-clave');
  if (!password) throw new Error('Falta BOOTSTRAP_PASSWORD para crear el primer usuario.');
  await impl.tx(async (run) => {
    const [r] = await run("insert into restaurants (name) values ('Hoshito') returning id");
    for (const [slug, label] of [['caja', 'Caja'], ['mesa-1', 'Mesa 1'], ['mesa-2', 'Mesa 2'], ['llevar', 'Empaque para llevar']]) {
      await run('insert into points (restaurant_id, slug, label) values ($1, $2, $3)', [r.id, slug, label]);
    }
    await run(
      "insert into staff (restaurant_id, username, name, role, pass_hash) values ($1, $2, 'Desarrollador', 'dev', $3)",
      [r.id, user.toLowerCase(), hashPassword(password)],
    );
  });
}

function db() {
  if (!g.__hoshitoDb) {
    // Si la conexión falla, se vuelve a intentar en la siguiente petición.
    g.__hoshitoDb = connect().catch((err) => {
      g.__hoshitoDb = null;
      throw err;
    });
  }
  return g.__hoshitoDb;
}

/** Consulta simple: devuelve las filas. */
export async function q(text, params = []) {
  return (await db()).q(text, params);
}

/** Transacción: fn recibe una función run(text, params) que devuelve filas. */
export async function tx(fn) {
  return (await db()).tx(fn);
}
