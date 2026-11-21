import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// A static site for GitHub Pages: `pnpm build` writes it to dist/.
export default defineConfig({
  build: { format: 'directory' },
  integrations: [react()],
  site: 'https://erict16.github.io',
  trailingSlash: 'ignore',
  vite: { plugins: [tailwindcss()] },
});
