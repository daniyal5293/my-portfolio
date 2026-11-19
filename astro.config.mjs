// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Public URL of the deployed site. Used for canonical URLs, Open Graph tags,
 * the sitemap and robots.txt.
 * PLACEHOLDER: replace with your real domain (or the *.pages.dev URL that
 * Cloudflare assigns after your first deploy).
 */
const SITE_URL = 'https://daniyal-khan.pages.dev';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',
  // Inline CSS (≈12 KB gzipped) to remove the render-blocking stylesheet request.
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
