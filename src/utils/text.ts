/**
 * Splits copy like "I build *containerized* things" into segments so the
 * starred part can be rendered with the serif accent style.
 */
export function splitAccent(text: string): { text: string; accent: boolean }[] {
  return text
    .split('*')
    .map((part, i) => ({ text: part, accent: i % 2 === 1 }))
    .filter((part) => part.text.length > 0);
}

/** Zero-padded index: 3 → "03". */
export const pad = (n: number): string => String(n).padStart(2, '0');

/** Normalises skill / stack names so "React.js" and "React" match. */
export const normalizeTech = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\.js$/, '')
    .replace(/[^a-z0-9+#]/g, '');
