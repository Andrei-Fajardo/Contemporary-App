import type { LocaleKey } from './translations';

/** Prefix for locale section routes (`''` for English root). */
export function localePrefix(locale: LocaleKey): string {
  return locale === 'en' ? '' : `/${locale}`;
}

/** Home path for a locale. */
export function localeHome(locale: LocaleKey): string {
  return locale === 'en' ? '/' : `/${locale}`;
}

/** Section path, e.g. localePath('kr', 'about') → `/kr/about`. */
export function localePath(locale: LocaleKey, section: string): string {
  const base = localePrefix(locale);
  return `${base}/${section}`;
}

/** Artwork detail — currently EN-only routes. */
export function artworkPath(_locale: LocaleKey, slug: string): string {
  return `/art/${slug}`;
}

export const STUDIO_LOCALES: LocaleKey[] = ['en', 'kr', 'kk', 'zh', 'ru'];
