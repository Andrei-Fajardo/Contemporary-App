// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),

  // Inline CSS so global styles always ship with the page (no missed stylesheet)
  build: {
    inlineStylesheets: 'always',
  },
});