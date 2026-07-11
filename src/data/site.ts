/**
 * Site-wide identity + production URL for canonicals, sitemap, and JSON-LD.
 * TODO(confirm-domain): confirm this matches the live Vercel custom domain before launch.
 */
export const SITE_URL = 'https://annadauylrockswell.com';

export const SITE_PERSON = {
  name: 'Anna Dauyl Rockswell',
  alternateName: 'NANA',
  email: 'contact@annadauylrockswell.com',
  /** English jobTitle for schema.org (stable across locales). */
  jobTitle: 'Writer, Ghostwriter, Painter, Visual Artist',
  /** sameAs — social / public profiles already linked in the footer. */
  sameAs: ['https://instagram.com/rockswellnana'] as string[],
  homeLocation: {
    // TODO(confirm-location): schema Place; city names only — no invented street address
    locality: 'Seoul',
    alsoKnown: 'Almaty',
  },
} as const;

/** Absolute URL helper (no trailing slash except root). */
export function absoluteUrl(path = '/'): string {
  const base = SITE_URL.replace(/\/$/, '');
  if (!path || path === '/') return `${base}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized.replace(/\/$/, '')}`;
}
