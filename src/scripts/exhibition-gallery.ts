/**
 * Exhibition Gallery Overlay
 * Opens a full-screen Google Photos style grid when "View All" is clicked.
 * Images load lazily via IntersectionObserver, each showing a skeleton shimmer
 * while loading. Clicking any image opens a full-screen lightbox.
 */

interface GalleryState {
  images: string[];
  title: string;
  place: string;
  lbIndex: number;
}

let state: GalleryState = { images: [], title: '', place: '', lbIndex: 0 };
let overlayBound = false;

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
    lbPrev:    document.getElementById('exg-lb-prev') as HTMLButtonElement,
    lbNext:    document.getElementById('exg-lb-next') as HTMLButtonElement,
    lbClose:   document.getElementById('exg-lb-close')!,
    lbCounter: document.getElementById('exg-lb-counter')!,
  };
}

// ── Open overlay ─────────────────────────────────────────────────────────────
export function openGallery(images: string[], title: string, place: string) {
  state = { images, title, place, lbIndex: 0 };
  const r = refs();

  // Populate header
  r.eyebrow.textContent = place;
  r.titleEl.textContent = title;
  r.count.textContent   = `${images.length} photo${images.length !== 1 ? 's' : ''}`;

  // Show skeleton, hide real grid
  r.skeleton.classList.remove('is-hidden');
  r.grid.classList.add('is-hidden');
  r.grid.innerHTML = '';

  // Show overlay
  r.overlay.removeAttribute('hidden');
  r.overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Scroll body to top
  r.body.scrollTop = 0;

  // Animate in (next frame so transition fires)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      r.overlay.classList.add('is-open');
    });
  });

  // Build the grid with lazy loading
  buildGrid(r, images, title);

  // Bind overlay-level events once
  if (!overlayBound) {
    bindOverlayEvents(r);
    overlayBound = false; // reset flag managed inside bindOverlayEvents
  }
  bindOverlayEvents(r);
}

// ── Close overlay ────────────────────────────────────────────────────────────
function closeGallery() {
  const r = refs();
  r.overlay.classList.remove('is-open');
  r.overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
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
        const img  = item.querySelector('img')!;
        const src  = item.dataset.src!;
        img.src = src;
        img.onload = () => item.classList.add('is-loaded');
        img.onerror = () => item.classList.add('is-loaded'); // show broken gracefully
        io.unobserve(item);
      });
    },
    { root: r.body, rootMargin: '200px' }
  );

  // Build all items (images not yet loaded — src assigned by IO)
  images.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'exg-grid__item';
    item.dataset.src = src;
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Photo ${i + 1} of ${images.length}`);

    const img = document.createElement('img');
    img.alt = `${alt} — photo ${i + 1}`;
    img.decoding = 'async';

    const overlay = document.createElement('div');
    overlay.className = 'exg-grid__item-overlay';
    overlay.innerHTML = `<span class="exg-grid__item-num">${String(i + 1).padStart(2, '0')}</span>`;

    item.appendChild(img);
    item.appendChild(overlay);
    r.grid.appendChild(item);

    // Click to open lightbox
    item.addEventListener('click', () => openLightbox(i));
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
  r.lightbox.removeAttribute('hidden');
  r.lightbox.setAttribute('aria-hidden', 'false');
  renderLightbox(r);
}

function renderLightbox(r: ReturnType<typeof refs>) {
  const { images, lbIndex } = state;
  const src = images[lbIndex];
  r.lbImg.src  = '';
  r.lbImg.src  = src;
  r.lbImg.alt  = `Photo ${lbIndex + 1} of ${images.length}`;
  r.lbCounter.textContent = `${lbIndex + 1} / ${images.length}`;
  (r.lbPrev as HTMLButtonElement).disabled = lbIndex === 0;
  (r.lbNext as HTMLButtonElement).disabled = lbIndex === images.length - 1;
}

function closeLightbox(r: ReturnType<typeof refs>) {
  r.lightbox.setAttribute('hidden', '');
  r.lightbox.setAttribute('aria-hidden', 'true');
  r.lbImg.src = '';
}

// ── Events ────────────────────────────────────────────────────────────────────
function bindOverlayEvents(r: ReturnType<typeof refs>) {
  // Close on backdrop
  r.backdrop.onclick   = closeGallery;
  r.closeBtn.onclick   = closeGallery;

  // Lightbox nav
  r.lbBackdrop.onclick = () => closeLightbox(r);
  r.lbClose.onclick    = () => closeLightbox(r);
  r.lbPrev.onclick     = () => { state.lbIndex = Math.max(0, state.lbIndex - 1); renderLightbox(r); };
  r.lbNext.onclick     = () => { state.lbIndex = Math.min(state.images.length - 1, state.lbIndex + 1); renderLightbox(r); };

  // Keyboard
  document.addEventListener('keydown', handleKeydown);
}

function handleKeydown(e: KeyboardEvent) {
  const r = refs();
  const overlayOpen = !r.overlay.hasAttribute('hidden');
  if (!overlayOpen) return;

  const lbOpen = !r.lightbox.hasAttribute('hidden');

  if (e.key === 'Escape') {
    if (lbOpen) { closeLightbox(r); } else { closeGallery(); }
    return;
  }

  if (lbOpen) {
    if (e.key === 'ArrowLeft')  { state.lbIndex = Math.max(0, state.lbIndex - 1); renderLightbox(r); }
    if (e.key === 'ArrowRight') { state.lbIndex = Math.min(state.images.length - 1, state.lbIndex + 1); renderLightbox(r); }
  }
}

// ── Init: wire up all "View All" buttons already in the DOM ─────────────────
export function initExhibitionGallery() {
  document.querySelectorAll<HTMLButtonElement>('[data-gallery-open]').forEach((btn) => {
    if (btn.dataset.galleryBound) return;
    btn.dataset.galleryBound = 'true';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imagesRaw = btn.dataset.galleryImages ?? '';
      const images    = imagesRaw ? imagesRaw.split('|').filter(Boolean) : [];
      const title     = btn.dataset.galleryTitle  ?? '';
      const place     = btn.dataset.galleryPlace  ?? '';
      openGallery(images, title, place);
    });
  });
}
