/**
 * Full-viewport maximized view for artwork images (Art page “View Piece”).
 */
export function initPieceLightbox(): void {
  const lb = document.getElementById('st-piece-lb');
  if (!lb || lb.dataset.bound === 'true') return;
  lb.dataset.bound = 'true';

  const img = lb.querySelector<HTMLImageElement>('[data-piece-lb-img]');
  const titleEl = lb.querySelector<HTMLElement>('[data-piece-lb-title]');
  const closeBtn = lb.querySelector<HTMLButtonElement>('[data-piece-lb-close]');
  let lastFocus: HTMLElement | null = null;

  const isOpen = () => !lb.hasAttribute('hidden');

  const open = (src: string, alt: string, title: string) => {
    if (!img || !src) return;
    lastFocus = document.activeElement as HTMLElement | null;
    img.src = src;
    img.alt = alt || title;
    if (titleEl) titleEl.textContent = title;
    lb.removeAttribute('hidden');
    lb.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('exg-gallery-open');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  const close = () => {
    if (!isOpen()) return;
    lb.setAttribute('hidden', '');
    lb.setAttribute('aria-hidden', 'true');
    if (img) {
      img.removeAttribute('src');
      img.alt = '';
    }
    if (titleEl) titleEl.textContent = '';
    document.documentElement.classList.remove('exg-gallery-open');
    document.body.style.overflow = '';
    lastFocus?.focus();
  };

  document.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-piece-open]');
    if (!trigger) return;
    e.preventDefault();
    open(
      trigger.dataset.pieceSrc || '',
      trigger.dataset.pieceAlt || '',
      trigger.dataset.pieceTitle || '',
    );
  });

  const onClose = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  };
  closeBtn?.addEventListener('click', onClose);
  closeBtn?.addEventListener('pointerup', (e) => {
    if ((e as PointerEvent).pointerType === 'mouse') return;
    onClose(e);
  });
  lb.querySelector('[data-piece-lb-backdrop]')?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      close();
    }
  });
}
