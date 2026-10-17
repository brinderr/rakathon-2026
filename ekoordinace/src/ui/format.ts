// Czech formatting shared by all sections.
const NBSP = ' ';

/** "2026-10-21" → "21. 10. 2026" (non-breaking, so the date never splits across lines). */
export function czDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}.${NBSP}${m}.${NBSP}${y}`;
}

/** Keep Czech dates in a text on one line ("21. 10. 2026" never breaks after "21."). */
export function nb(text: string): string {
  return text.replace(/(\d{1,2})\. (\d{1,2})\. (\d{4})/g, `$1.${NBSP}$2.${NBSP}$3`).replace(/(\d{1,2})\. (\d{1,2})\.(?!\s?\d)/g, `$1.${NBSP}$2.`);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

/** 0 → "dnes", 1 → "zítra", 2 → "za 2 dny", 5 → "za 5 dní" */
export function inDays(n: number): string {
  if (n === 0) return 'dnes';
  if (n === 1) return 'zítra';
  return `za ${n} ${n < 5 ? 'dny' : 'dní'}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}
