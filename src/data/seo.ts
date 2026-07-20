import { absoluteUrl, SITE_URL } from './site';
import type { LocaleKey } from './translations';

/** Logical SEO page keys used by `<SEO />` and i18n meta copy. */
export type SeoPageKey =
  | 'home'
  | 'about'
  | 'art'
  | 'exhibitions'
  | 'publications'
  | 'research'
  | 'press'
  | 'contacts'
  | 'artwork';

/** BCP 47 tags for hreflang (project locale → HTML lang). */
export const LOCALE_HREFLANG: Record<LocaleKey, string> = {
  en: 'en',
  kr: 'ko',
  kk: 'kk',
  zh: 'zh-Hans',
  ru: 'ru',
};

export const SEO_LOCALES: LocaleKey[] = ['en', 'kr', 'kk', 'zh', 'ru'];

/** Locale home path (no trailing slash except EN root as `/`). */
export function localeHomePath(locale: LocaleKey): string {
  return locale === 'en' ? '/' : `/${locale}`;
}

/**
 * Canonical path for a logical page.
 * EN and locale trees now share the Studio multi-page shell.
 */
export function seoCanonicalPath(locale: LocaleKey, page: SeoPageKey, artworkSlug?: string): string {
  const home = localeHomePath(locale);
  if (page === 'home') return home === '/' ? '/' : home;
  if (page === 'artwork' && artworkSlug) {
    // Artwork detail routes are currently EN-only (`/art/[slug]`).
    return `/art/${artworkSlug}`;
  }
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${prefix}/${page}`;
}

export function seoDocumentUrl(locale: LocaleKey, page: SeoPageKey, artworkSlug?: string): string {
  return absoluteUrl(seoCanonicalPath(locale, page, artworkSlug));
}

/** Alternate locale URLs for the same logical page (hreflang). */
export function seoHreflangAlternates(
  page: SeoPageKey,
  artworkSlug?: string,
): { locale: LocaleKey; hreflang: string; href: string }[] {
  if (page === 'artwork') {
    // No localized artwork routes yet — only EN URL.
    return [
      {
        locale: 'en',
        hreflang: LOCALE_HREFLANG.en,
        href: absoluteUrl(artworkSlug ? `/art/${artworkSlug}` : '/'),
      },
    ];
  }

  return SEO_LOCALES.map((locale) => ({
    locale,
    hreflang: LOCALE_HREFLANG[locale],
    href: absoluteUrl(seoCanonicalPath(locale, page, artworkSlug)),
  }));
}

export { SITE_URL };
