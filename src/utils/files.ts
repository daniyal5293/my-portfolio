import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Build-time check that a file exists in /public.
 * Used so the "Download CV" button only renders when the PDF is really there.
 */
export function publicFileExists(href: string): boolean {
  if (!href.startsWith('/')) return false;
  return existsSync(join(process.cwd(), 'public', decodeURIComponent(href)));
}

export const cvExists = publicFileExists;
