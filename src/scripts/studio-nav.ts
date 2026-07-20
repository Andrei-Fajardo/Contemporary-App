/**
 * Sliding sidebar active indicator + aria-current sync after client navigations.
 */

function pathKey(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  return clean || '/';
}

function linkMatches(href: string, path: string): boolean {
  const key = pathKey(href);
  if (key === '/') return path === '/';
  return path === key || path.startsWith(`${key}/`);
}

export function syncStudioNav(): void {
  const path = pathKey(window.location.pathname);
  const links = document.querySelectorAll<HTMLAnchorElement>('.st-nav a, .st-drawer__nav a');

  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (linkMatches(href, path)) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  positionNavIndicator();
}

function positionNavIndicator(target?: HTMLElement | null): void {
  const nav = document.querySelector<HTMLElement>('[data-st-nav]');
  const indicator = nav?.querySelector<HTMLElement>('[data-st-nav-indicator]');
  if (!nav || !indicator) return;

  const active =
    target ||
    nav.querySelector<HTMLElement>('a[aria-current="page"]') ||
    null;

  if (!active) {
    nav.classList.remove('has-active');
    indicator.style.opacity = '0';
    return;
  }

  const navRect = nav.getBoundingClientRect();
  const linkRect = active.getBoundingClientRect();
  const y = linkRect.top - navRect.top + linkRect.height / 2;

  nav.classList.add('has-active');
  indicator.style.opacity = '1';
  indicator.style.transform = `translate3d(0, ${y}px, 0) translateY(-50%)`;
}

export function initStudioNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-st-nav]');
  if (!nav) return;

  syncStudioNav();

  if (nav.dataset.navBound === 'true') return;
  nav.dataset.navBound = 'true';

  nav.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('mouseenter', () => positionNavIndicator(link));
    link.addEventListener('focus', () => positionNavIndicator(link));
  });

  nav.addEventListener('mouseleave', () => positionNavIndicator());
  nav.addEventListener('focusout', (e) => {
    if (!nav.contains(e.relatedTarget as Node | null)) positionNavIndicator();
  });

  window.addEventListener('resize', () => positionNavIndicator());
}
