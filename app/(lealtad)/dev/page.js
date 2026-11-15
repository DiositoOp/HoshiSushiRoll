import Link from 'next/link';
import { ROLE_LABEL, requireRole } from '@/lib/auth';
import { baseUrl } from '@/lib/baseurl';
import { q } from '@/lib/db';
import { dayAndClock } from '@/lib/format';
import { getRestaurant } from '@/lib/rules';
import { Logo } from '@/components/ui';
import { logout } from '../staff/actions';
import { addPoint, addStaff, saveConfig, setPassword, togglePoint, toggleStaff } from './actions';
import { STAFF_APP } from '@/lib/appMeta';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Consola del desarrollador · Hoshito', ...STAFF_APP };

const EVENT_COLOR = { ajuste: '#ffd9cf', edicion: '#b4b4be', sello: '#bfe8cc', registro: '#bfe8cc', vinculo: '#bfe8cc', canje: '#ffd9cf', sello_manual: '#ffd9cf', config: '#b4b4be', rechazo: '#ffb4a3', bloqueado: '#ffb4a3' };

export default async function DevConsole({ searchParams }) {
  const staff = await requireRole(['dev']);
  const r = await getRestaurant();
  const { aviso } = await searchParams;
  const origin = await baseUrl();

  const points = await q(
    `select p.*, (select count(*)::int from customers c where c.point_id = p.id) as signups
       from points p where p.restaurant_id = $1 order by p.id`,
    [r.id],
  );
  const users = await q('select id, username, name, role, active from staff where restaurant_id = $1 order by id', [r.id]);
  const events = await q(
    `select e.at, e.type, e.detail, s.name as staff_name from events e left join staff s on s.id = e.staff_id
      where e.restaurant_id = $1 order by e.at desc limit 40`,
    [r.id],
  );

  return (
    <main className="dev">
      <header className="row" style={{ flexWrap: 'wrap' }}>
        <div className="row" style={{ justifyContent: 'flex-start', gap: 14 }}>
          <Logo size={52} decorative />
          <div className="stack" style={{ gap: 4 }}>
            <h1 className="display h1">Consola del desarrollador</h1>
            <span className="small muted">{r.name} · sesión de {staff.name}</span>
          </div>
        </div>
        <nav aria-label="Secciones" className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <span className="pill green">{process.env.DATABASE_URL ? 'Postgres conectado' : 'Base local de desarrollo'}</span>
          <Link className="btn ghost sm" href="/caja">Caja</Link>
          <Link className="btn ghost sm" href="/admin">Panel del dueño</Link>
          <form action={logout}><button className="btn sm" type="submit">Salir</button></form>
        </nav>
      </header>

      {aviso && <p className="notice" role="status" style={{ color: '#111114' }}>{aviso}</p>}

      <div className="panels">
        <section className="panel wide">
          <h2 className="display h2">Puntos de registro (NFC y QR)</h2>
          <div className="scroll">
            <table>
              <thead>
                <tr><th>Punto</th><th>Enlace para grabar</th><th>Aperturas</th><th>Registros</th><th>QR</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {points.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.label}</strong></td>
                    <td className="mono">{origin}/r/{p.slug}</td>
                    <td>{p.opens}</td>
                    <td>{p.signups}</td>
                    <td><a href={`/dev/qr/${p.slug}`}>Descargar</a></td>
                    <td>
                      <form action={togglePoint}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="linkbtn" type="submit">{p.active ? 'Activo · desactivar' : 'Inactivo · activar'}</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form action={addPoint} className="formrow">
            <div className="stack">
              <label className="label" htmlFor="p-label">Nuevo punto</label>
              <input className="input" id="p-label" name="label" placeholder="Ej. Mesa 3" maxLength={40} required />
            </div>
            <button className="btn sm" type="submit">Agregar</button>
          </form>
          <p className="small muted">
            Aperturas cuenta los teléfonos sin tarjeta que abrieron el enlace; comparado con registros, te dice qué punto convierte mejor.
          </p>
        </section>

        <section className="panel">
          <h2 className="display h2">Configuración</h2>
          <form action={saveConfig} className="stack gap">
            <div className="stack">
              <label className="label" htmlFor="c-name">Nombre del restaurante</label>
              <input className="input" id="c-name" name="name" defaultValue={r.name} maxLength={60} required />
            </div>
            <div className="stack">
              <label className="label" htmlFor="c-maps">Enlace de reseñas en Google Maps</label>
              <input className="input" id="c-maps" name="google_review_url" type="url" defaultValue={r.google_review_url} placeholder="https://…" />
            </div>
            <div className="stack">
              <label className="label" htmlFor="c-day">Sellos máximos por cliente al día</label>
              <input className="input" id="c-day" name="max_stamps_per_day" type="number" min="1" max="5" defaultValue={r.max_stamps_per_day} />
            </div>
            <div className="stack">
              <label className="label" htmlFor="c-review">Mostrar botón de reseña desde la visita</label>
              <input className="input" id="c-review" name="review_from_visit" type="number" min="1" max="20" defaultValue={r.review_from_visit} />
            </div>
            <button className="btn sm" type="submit">Guardar configuración</button>
          </form>
        </section>
      </div>

      <div className="panels">
        <section className="panel">
          <h2 className="display h2">Usuarios y permisos</h2>
          {users.map((u) => (
            <div key={u.id} className="stack" style={{ borderBottom: '1px solid #34343c', paddingBottom: 8 }}>
              <div className="row">
                <span><strong>{u.name}</strong> <span className="mono muted">{u.username}</span></span>
                <span className={`pill${u.active ? ' green' : ''}`}>{ROLE_LABEL[u.role]}{u.active ? '' : ' · inactivo'}</span>
              </div>
              <details>
                <summary>Cambiar contraseña o estado</summary>
                <div className="stack gap">
                  <form action={setPassword} className="formrow">
                    <input type="hidden" name="id" value={u.id} />
                    <div className="stack">
                      <label className="label" htmlFor={`pw-${u.id}`}>Nueva contraseña</label>
                      <input className="input" id={`pw-${u.id}`} name="password" type="password" minLength={8} autoComplete="new-password" required />
                    </div>
                    <button className="btn sm" type="submit">Cambiar</button>
                  </form>
                  <form action={toggleStaff}>
                    <input type="hidden" name="id" value={u.id} />
                    <button className="linkbtn" type="submit">{u.active ? 'Desactivar usuario' : 'Activar usuario'}</button>
                  </form>
                </div>
              </details>
            </div>
          ))}
          <form action={addStaff} className="stack gap">
            <span className="eyebrow" style={{ color: '#b4b4be' }}>Nuevo usuario</span>
            <div className="formrow">
              <div className="stack">
                <label className="label" htmlFor="u-name">Nombre</label>
                <input className="input" id="u-name" name="name" maxLength={60} required />
              </div>
              <div className="stack">
                <label className="label" htmlFor="u-user">Usuario</label>
                <input className="input" id="u-user" name="username" autoCapitalize="none" required />
              </div>
            </div>
            <div className="formrow">
              <div className="stack">
                <label className="label" htmlFor="u-pass">Contraseña</label>
                <input className="input" id="u-pass" name="password" type="password" minLength={8} autoComplete="new-password" required />
              </div>
              <div className="stack">
                <label className="label" htmlFor="u-role">Rol</label>
                <select className="select" id="u-role" name="role" defaultValue="cashier">
                  <option value="cashier">Caja: confirmar y entregar</option>
                  <option value="owner">Administrador: clientes y promoción</option>
                  <option value="dev">Desarrollador: todo</option>
                </select>
              </div>
            </div>
            <button className="btn sm" type="submit">Crear usuario</button>
          </form>
          <p className="small muted">Caja no puede ver ni descargar la lista de clientes.</p>
        </section>

        <section className="panel wide">
          <h2 className="display h2">Registro de eventos</h2>
          <div className="log mono">
            {events.length === 0 && <span className="muted">Aún no hay eventos.</span>}
            {events.map((e, i) => (
              <div key={i}>
                <span className="muted">{dayAndClock(e.at, r.tz)}</span>{' '}
                <span style={{ color: EVENT_COLOR[e.type] || '#f2f2f5' }}>{e.type}</span>{' '}
                {e.detail}{e.staff_name ? ` · ${e.staff_name}` : ''}
              </div>
            ))}
          </div>
          <p className="small muted">Todo sello, rechazo y premio queda guardado con quién lo hizo.</p>
        </section>
      </div>
    </main>
  );
}
