'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ICONS = {
  caja: <><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M7 8V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" /><path d="M7 14h4" /></>,
  resumen: <><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></>,
  clientes: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18 14a6.5 6.5 0 0 1 3.5 6" /></>,
  promocion: <><rect x="3" y="9" width="18" height="12" rx="2" /><path d="M12 9v12" /><path d="M3 13h18" /><path d="M12 9c-2-4-6-4-6-1.5S9 9 12 9c3 0 6-.5 6-1.5S14 5 12 9z" /></>,
  consola: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3" /><path d="M13 15h4" /></>,
};

/**
 * Barra de pestañas fija abajo para dueño y desarrollador: Caja, Resumen, Clientes, Promoción (y Consola).
 * pending: visitas por confirmar, se muestra como globo sobre "Caja".
 */
export default function StaffTabs({ role, pending = 0 }) {
  const path = usePathname();
  const tabs = [
    ['/caja', 'Caja', 'caja'],
    ['/admin', 'Resumen', 'resumen'],
    ['/admin/clientes', 'Clientes', 'clientes'],
    ['/admin/promocion', 'Promoción', 'promocion'],
  ];
  if (role === 'dev') tabs.push(['/dev', 'Consola', 'consola']);

  return (
    <nav className="tabs" aria-label="Secciones" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
      {tabs.map(([href, label, icon]) => {
        const on = path === href;
        return (
          <Link key={href} href={href} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}>
            <span className="tab-icon">
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[icon]}
              </svg>
              {icon === 'caja' && pending > 0 && <span className="tab-badge">{pending}</span>}
            </span>
            <span>
              {label}
              {icon === 'caja' && pending > 0 && <span className="sr-only">, {pending} por confirmar</span>}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
