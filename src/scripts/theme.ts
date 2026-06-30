export type SiteTheme = 'light' | 'dark';

const STORAGE_KEY = 'site-theme';

export function getTheme(): SiteTheme {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: SiteTheme) {
  document.documentElement.setAttribute('data-theme', theme);

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#F0EEE9' : '#141414';

  document.querySelectorAll<HTMLButtonElement>('[data-theme-switch]').forEach((btn) => {
    btn.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
  });

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function toggleTheme() {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function initThemeToggle() {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-switch]').forEach((btn) => {
    if (btn.dataset.themeBound === 'true') return;
    btn.dataset.themeBound = 'true';
    btn.addEventListener('click', toggleTheme);
  });

  applyTheme(getTheme());
}
