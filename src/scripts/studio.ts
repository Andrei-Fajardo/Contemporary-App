/**
 * Studio shell behaviour: mobile drawer, scroll reveals, restrained parallax,
 * plus exhibition accordion / gallery when those modules are on the page.
 */
import { initExhibitionAccordion, resetExhibitionAccordion } from './motion/exhibition-accordion';
import { initExhibitionGallery } from './exhibition-gallery';
import { initManuscriptModal } from './manuscript-modal';
import { initPieceLightbox } from './piece-lightbox';
import { initStudioNav, syncStudioNav } from './studio-nav';

function initDrawer(): void {
  const burger = document.getElementById('st-burger');
  const closeBtn = document.getElementById('st-drawer-close');
  const drawer = document.getElementById('st-drawer');
  if (!burger || !drawer) return;
  if (drawer.dataset.bound === 'true') return;
  drawer.dataset.bound = 'true';

  const setOpen = (open: boolean) => {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => setOpen(true));
  closeBtn?.addEventListener('click', () => setOpen(false));
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    const pieceLb = document.getElementById('st-piece-lb');
    if (pieceLb && !pieceLb.hasAttribute('hidden')) return;
    if (e.key === 'Escape') setOpen(false);
  });
}

function initReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>('.st-reveal:not(.is-in)');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const group = el.closest('[data-reveal-group]');
        if (group) {
          const idx = Array.from(group.querySelectorAll('.st-reveal')).indexOf(el);
          el.style.setProperty('--st-delay', `${Math.min(idx, 7) * 80}ms`);
        }
        el.classList.add('is-in');
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );
  targets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      el.classList.add('is-in');
    } else {
      io.observe(el);
    }
  });
}

function initParallax(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 1023px)').matches) return;

  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-px]'));
  if (!layers.length) return;

  const visible = new Set<HTMLElement>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(el);
      else visible.delete(el);
    });
    if (visible.size && !running) {
      running = true;
      requestAnimationFrame(tick);
    }
  });
  layers.forEach((el) => io.observe(el));

  let running = false;
  const tick = () => {
    if (!visible.size) {
      running = false;
      return;
    }
    visible.forEach((el) => {
      const speed = parseFloat(el.dataset.px || '0.12');
      const rect = el.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const y = (clamped - 0.5) * 100 * speed;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    });
    requestAnimationFrame(tick);
  };
  running = true;
  requestAnimationFrame(tick);
}

export function initStudio(): void {
  initDrawer();
  initStudioNav();
  syncStudioNav();
  initReveals();
  initParallax();
  resetExhibitionAccordion();
  initExhibitionAccordion();
  initExhibitionGallery();
  initManuscriptModal();
  initPieceLightbox();
}
