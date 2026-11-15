export const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

/** 9220000001 -> 922 000 0001 */
export function prettyPhone(phone) {
  const d = onlyDigits(phone);
  return d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : d;
}

export function clock(date, tz) {
  if (!date) return '';
  return new Intl.DateTimeFormat('es-MX', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(new Date(date));
}

export function dayAndClock(date, tz) {
  if (!date) return '';
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: tz }).format(new Date(date));
}

/** "hoy", "ayer", "hace 9 días" */
export function daysAgo(date) {
  if (!date) return 'sin visitas';
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
  if (days <= 0) return 'hoy';
  if (days === 1) return 'ayer';
  return `hace ${days} días`;
}

export function minutesAgo(date) {
  const min = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 60_000));
  return min < 1 ? 'ahora' : `hace ${min} min`;
}

export function birthday(day, month) {
  return day && month ? `${day} ${MONTHS[month - 1]}` : '';
}
