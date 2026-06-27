/**
 * Exhibition Gallery Overlay
 * Opens a full-screen Google Photos style grid when "View All" is clicked.
 * Images load lazily via IntersectionObserver, each showing a skeleton shimmer
 * while loading. Clicking any image opens a full-screen lightbox.
 * Videos always start muted; the user unmutes via native player controls.
 */

interface GalleryState {
  images: string[];
  title: string;
  place: string;
  lbIndex: number;
}

let state: GalleryState = { images: [], title: '', place: '', lbIndex: 0 };
let overlayBound = false;
let previewOnly = false;
let lockedScrollY = 0;
let scrollLockCount = 0;

const SCROLL_LOCK_CLASS = 'exg-scroll-lock';

function lockPageScroll(): void {
  if (scrollLockCount === 0) {
    lockedScrollY = window.scrollY;
    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    document.body.classList.add(SCROLL_LOCK_CLASS);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount += 1;
}

function unlockPageScroll(): void {
  if (scrollLockCount <= 0) return;
  scrollLockCount -= 1;
  if (scrollLockCount > 0) return;

  document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
  document.body.classList.remove(SCROLL_LOCK_CLASS);
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, lockedScrollY);
}

function isLightboxOpen(r: ReturnType<typeof refs>): boolean {
  return !r.lightbox.hasAttribute('hidden');
}

function isGalleryOpen(r: ReturnType<typeof refs>): boolean {
  return !r.overlay.hasAttribute('hidden');
}

function preventBackgroundScroll(e: Event): void {
  const r = refs();
  if (!isGalleryOpen(r)) return;

  if (isLightboxOpen(r)) {
    e.preventDefault();
    return;
  }

  const target = e.target;
  if (!(target instanceof Node) || !r.body.contains(target)) {
    e.preventDefault();
  }
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

function isVideo(src: string): boolean {
  return VIDEO_EXT.test(src);
}

function mediaLabel(count: number): string {
  return `${count} item${count !== 1 ? 's' : ''}`;
}

// ── DOM refs (resolved once on first open) ──────────────────────────────────
function refs() {
  return {
    overlay:   document.getElementById('exhibition-gallery-overlay')!,
    backdrop:  document.getElementById('exg-backdrop')!,
    eyebrow:   document.getElementById('exg-eyebrow')!,
    titleEl:   document.getElementById('exg-title')!,
    count:     document.getElementById('exg-count')!,
    closeBtn:  document.getElementById('exg-close')!,
    body:      document.getElementById('exg-body')!,
    skeleton:  document.getElementById('exg-skeleton')!,
    grid:      document.getElementById('exg-grid')!,
    lightbox:  document.getElementById('exg-lightbox')!,
    lbBackdrop:document.getElementById('exg-lightbox-backdrop')!,
    lbImg:     document.getElementById('exg-lb-img') as HTMLImageElement,
    lbVideo:   document.getElementById('exg-lb-video') as HTMLVideoElement,
    lbPrev:    document.getElementById('exg-lb-prev') as HTMLButtonElement,
    lbNext:    document.getElementById('exg-lb-next') as HTMLButtonElement,
    lbClose:   document.getElementById('exg-lb-close')!,
  };
}

function stopLightboxVideo(r: ReturnType<typeof refs>): void {
  r.lbVideo.pause();
  r.lbVideo.removeAttribute('src');
  r.lbVideo.load();
  r.lbVideo.hidden = true;
  r.lbVideo.muted = true;
}

// ── Open overlay ─────────────────────────────────────────────────────────────
export function openGallery(images: string[], title: string, place: string) {
  previewOnly = false;
  state = { images, title, place, lbIndex: 0 };
  const r = refs();

  r.overlay.classList.remove('exg-overlay--preview-only');

  // Populate header
  r.eyebrow.textContent = place;
  r.titleEl.textContent = title;
  r.count.textContent   = mediaLabel(images.length);

  // Show skeleton, hide real grid
  r.skeleton.classList.remove('is-hidden');
  r.grid.classList.add('is-hidden');
  r.grid.innerHTML = '';

  // Show overlay
  r.overlay.removeAttribute('hidden');
  r.overlay.setAttribute('aria-hidden', 'false');
  lockPageScroll();
  // Scroll grid to top
  r.body.scrollTop = 0;

  // Animate in (next frame so transition fires)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      r.overlay.classList.add('is-open');
    });
  });

  // Build the grid with lazy loading
  buildGrid(r, images, title);

  bindOverlayEvents(r);
}

/** Open a single carousel image fullscreen (thumbnails 1–3) without the grid. */
export function openGalleryPreview(images: string[], startIndex: number, title: string, place: string) {
  previewOnly = true;
  state = { images, title, place, lbIndex: startIndex };
  const r = refs();

  r.overlay.classList.add('exg-overlay--preview-only');
  r.overlay.removeAttribute('hidden');
  r.overlay.setAttribute('aria-hidden', 'false');
  lockPageScroll();

  openLightbox(startIndex);
  bindOverlayEvents(r);
}

// ── Close overlay ────────────────────────────────────────────────────────────
function closeGallery() {
  previewOnly = false;
  const r = refs();
  r.overlay.classList.remove('exg-overlay--preview-only');
  r.overlay.classList.remove('is-open');
  r.overlay.setAttribute('aria-hidden', 'true');
  unlockPageScroll();
  closeLightbox(r);

  // Wait for slide-down animation then fully hide
  const panel = r.overlay.querySelector('.exg-overlay__panel') as HTMLElement;
  const onEnd = () => {
    r.overlay.setAttribute('hidden', '');
    panel.removeEventListener('transitionend', onEnd);
  };
  panel.addEventListener('transitionend', onEnd, { once: true });
}

// ── Build the photo grid ──────────────────────────────────────────────────────
function buildGrid(r: ReturnType<typeof refs>, images: string[], alt: string) {
  // Use a short delay so the skeleton is visible even on fast connections
  const SKELETON_MIN_MS = 300;
  const startTime = Date.now();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = entry.target as HTMLElement;
        const src  = item.dataset.src!;
        const media = item.querySelector('img, video')!;

        if (media instanceof HTMLVideoElement) {
          media.src = src;
          media.onloadeddata = () => item.classList.add('is-loaded');
          media.onerror = () => item.classList.add('is-loaded');
        } else {
          media.src = src;
          media.onload = () => item.classList.add('is-loaded');
          media.onerror = () => item.classList.add('is-loaded');
        }

        io.unobserve(item);
      });
    },
    { root: r.body, rootMargin: '200px' }
  );

  // Build all items (media not yet loaded — src assigned by IO)
  images.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = isVideo(src) ? 'exg-grid__item exg-grid__item--video' : 'exg-grid__item';
    item.dataset.src = src;
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', isVideo(src) ? `Play video from ${alt}` : `View image from ${alt}`);

    const media: HTMLImageElement | HTMLVideoElement = isVideo(src)
      ? document.createElement('video')
      : document.createElement('img');

    if (media instanceof HTMLVideoElement) {
      media.muted = true;
      media.playsInline = true;
      media.preload = 'metadata';
      media.loop = true;
    } else {
      media.alt = alt;
    }

    item.appendChild(media);
    r.grid.appendChild(item);

    // Click to open lightbox (stop global lightbox from intercepting)
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(i);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });

    io.observe(item);
  });

  // Swap skeleton → grid after minimum display time
  const elapsed = Date.now() - startTime;
  const delay   = Math.max(0, SKELETON_MIN_MS - elapsed);
  setTimeout(() => {
    r.skeleton.classList.add('is-hidden');
    r.grid.classList.remove('is-hidden');
  }, delay);
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function openLightbox(index: number) {
  state.lbIndex = index;
  const r = refs();
  r.body.scrollTop = 0;
  r.lightbox.removeAttribute('hidden');
  r.lightbox.setAttribute('aria-hidden', 'false');
  renderLightbox(r);
}

function renderLightbox(r: ReturnType<typeof refs>) {
  const { images, lbIndex } = state;
  const src = images[lbIndex];

  if (isVideo(src)) {
    stopLightboxVideo(r);
    r.lbImg.hidden = true;
    r.lbImg.removeAttribute('src');
    r.lbVideo.hidden = false;
    r.lbVideo.src = src;
    r.lbVideo.muted = true;
    r.lbVideo.currentTime = 0;
    void r.lbVideo.play().catch(() => {});
  } else {
    stopLightboxVideo(r);
    r.lbImg.hidden = false;
    r.lbImg.src = '';
    r.lbImg.src = src;
    r.lbImg.alt = state.title;
  }

  r.lbPrev.disabled = lbIndex === 0;
  r.lbNext.disabled = lbIndex === images.length - 1;
}

function closeLightbox(r: ReturnType<typeof refs>) {
  r.lightbox.setAttribute('hidden', '');
  r.lightbox.setAttribute('aria-hidden', 'true');
  r.lbImg.src = '';
  r.lbImg.hidden = true;
  stopLightboxVideo(r);

  if (previewOnly) {
    previewOnly = false;
    r.overlay.classList.remove('exg-overlay--preview-only');
    r.overlay.setAttribute('aria-hidden', 'true');
    r.overlay.setAttribute('hidden', '');
    unlockPageScroll();
  }
}

// ── Events ────────────────────────────────────────────────────────────────────
function bindOverlayEvents(r: ReturnType<typeof refs>) {
  if (overlayBound) return;
  overlayBound = true;

  // Close on backdrop
  r.backdrop.onclick   = closeGallery;
  r.closeBtn.onclick   = closeGallery;

  // Lightbox nav — backdrop and empty stage area close fullscreen
  r.lbBackdrop.onclick = () => closeLightbox(r);
  r.lbClose.onclick    = () => closeLightbox(r);
  r.lightbox.onclick = (e) => {
    if (e.target === r.lightbox) closeLightbox(r);
  };
  const stage = r.lightbox.querySelector('.exg-lightbox__stage');
  stage?.addEventListener('click', (e) => {
    if (e.target === stage) closeLightbox(r);
  });
  r.lbPrev.onclick = (e) => {
    e.stopPropagation();
    if (state.lbIndex > 0) {
      state.lbIndex -= 1;
      renderLightbox(r);
    }
  };
  r.lbNext.onclick = (e) => {
    e.stopPropagation();
    if (state.lbIndex < state.images.length - 1) {
      state.lbIndex += 1;
      renderLightbox(r);
    }
  };

  // Keyboard
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
  document.addEventListener('wheel', preventBackgroundScroll, { passive: false });
}

function handleKeydown(e: KeyboardEvent) {
  const r = refs();
  const overlayOpen = !r.overlay.hasAttribute('hidden');
  if (!overlayOpen) return;

  const lbOpen = !r.lightbox.hasAttribute('hidden');

  if (e.key === 'Escape') {
    if (lbOpen) { closeLightbox(r); } else if (!previewOnly) { closeGallery(); }
    return;
  }

  if (lbOpen) {
    if (e.key === 'ArrowLeft' && state.lbIndex > 0) {
      e.preventDefault();
      state.lbIndex -= 1;
      renderLightbox(r);
    }
    if (e.key === 'ArrowRight' && state.lbIndex < state.images.length - 1) {
      e.preventDefault();
      state.lbIndex += 1;
      renderLightbox(r);
    }
  }
}

// ── Init: wire thumbnail preview + View All buttons ───────────────────────────
export function initExhibitionGallery() {
  document.querySelectorAll<HTMLButtonElement>('[data-gallery-open], [data-gallery-preview]').forEach((btn) => {
    if (btn.dataset.galleryBound) return;
    btn.dataset.galleryBound = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const imagesRaw = btn.dataset.galleryImages ?? '';
      const images    = imagesRaw ? imagesRaw.split('|').filter(Boolean) : [];
      const title     = btn.dataset.galleryTitle  ?? '';
      const place     = btn.dataset.galleryPlace  ?? '';

      if (btn.hasAttribute('data-gallery-preview')) {
        const index = Number(btn.dataset.galleryIndex ?? 0);
        openGalleryPreview(images, index, title, place);
      } else {
        openGallery(images, title, place);
      }
    });
  });
}
