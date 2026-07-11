// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// TODO(confirm-domain): must match production custom domain / Vercel project URL
const SITE = 'https://annadauylrockswell.com';

/** Paths that 301 to hash tabs or are demo/legacy — keep out of the sitemap. */
function shouldIncludeInSitemap(page) {
  const { pathname } = new URL(page);
  const p = pathname.replace(/\/$/, '') || '/';

  const excludedExact = new Set([
    '/artists',
    '/gallery',
    '/en',
    '/about',
    '/art',
    '/contacts',
    '/exhibitions',
    '/feature',
    '/magazines',
    '/press',
    '/publications',
    '/research',
    '/virtual-exhibitions',
    '/404',
  ]);

  if (excludedExact.has(p)) return false;

  // Locale-prefixed section redirects & legacy galleries
  if (
    /^\/(kr|kk|zh|ru)\/(about|contacts|exhibitions|feature|magazines|press|publications|research|virtual-exhibitions|gallery)/.test(
      p,
    )
  ) {
    return false;
  }

  return true;
}

// https://astro.build/config
export default defineConfig({
  site: SITE,

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    domains: ['images.unsplash.com'],
  },

  integrations: [
    sitemap({
      filter: shouldIncludeInSitemap,
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          kr: 'ko',
          kk: 'kk',
          zh: 'zh-Hans',
          ru: 'ru',
        },
      },
    }),
  ],

  adapter: vercel(),
});
