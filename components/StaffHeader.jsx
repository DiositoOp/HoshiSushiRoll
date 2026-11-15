import { ROLE_LABEL } from '@/lib/auth';
import { logout } from '@/app/(lealtad)/staff/actions';
import { Logo } from './ui';

/** Encabezado de las pantallas del personal: logo, título, quién tiene la sesión y botón de salir. */
export default function StaffHeader({ title, staff, subtitle }) {
  return (
    <header className="staff-header">
      <Logo size={44} decorative />
      <div className="stack" style={{ gap: 0, minWidth: 0, flexGrow: 1 }}>
        <h1 className="display" style={{ fontSize: 24 }}>{title}</h1>
        <span className="small muted ellipsis">{subtitle || (staff.name === ROLE_LABEL[staff.role] ? staff.name : `${staff.name} · ${ROLE_LABEL[staff.role]}`)}</span>
      </div>
      <form action={logout}>
        <button className="btn quiet sm" type="submit">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
          </svg>
          Salir
        </button>
      </form>
    </header>
  );
}
