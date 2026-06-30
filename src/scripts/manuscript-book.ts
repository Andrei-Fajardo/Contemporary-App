declare global {
  interface Window {
    jQuery?: JQueryStatic;
    $?: JQueryStatic;
  }
}

type JQueryStatic = {
  (selector: string | HTMLElement): JQueryInstance;
};

type JQueryInstance = {
  turn(options?: Record<string, unknown>): JQueryInstance;
  turn(method: string, ...args: unknown[]): unknown;
};

const VENDOR = {
  jquery: '/vendor/jquery.js',
  turn: '/vendor/turn.js',
} as const;

let vendorPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function loadVendors(): Promise<void> {
  if (!vendorPromise) {
    vendorPromise = loadScript(VENDOR.jquery).then(() => loadScript(VENDOR.turn));
  }
  return vendorPromise;
}

function contentPageCount(root: HTMLElement): number {
  return Number(root.dataset.pageCount ?? '0');
}

function flipbookPageCount(contentPages: number): number {
  return contentPages + 4;
}

function pageFromScroll(progress: number, contentPages: number): number {
  const total = flipbookPageCount(contentPages);
  const clamped = Math.min(1, Math.max(0, progress));
  const index = Math.min(total - 1, Math.max(1, Math.round(clamped * (total - 1)) + 1));
  return index;
}

function scrollProgress(stage: HTMLElement): number {
  const rect = stage.getBoundingClientRect();
  const scrollable = stage.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  const traveled = Math.min(scrollable, Math.max(0, -rect.top));
  return traveled / scrollable;
}

function padPage(n: number): string {
  return String(n).padStart(2, '0');
}

export function initManuscriptBook(root: HTMLElement): void {
  const stage = root.querySelector<HTMLElement>('[data-manuscript-stage]');
  const binder = root.querySelector<HTMLElement>('[data-manuscript-binder]');
  const flipbookEl = root.querySelector<HTMLElement>('[data-manuscript-flipbook]');
  const indicator = root.querySelector<HTMLElement>('[data-manuscript-indicator]');
  const progressFill = root.querySelector<HTMLElement>('[data-manuscript-progress]');
  const scrollFill = root.querySelector<HTMLElement>('[data-manuscript-scroll-fill]');
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-manuscript-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-manuscript-next]');

  if (!stage || !flipbookEl) return;

  const contentPages = contentPageCount(root);
  if (!contentPages) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const useScrollDrive = !reducedMotion && !isCoarse && window.innerWidth >= 768;

  let flipbook: JQueryInstance | null = null;
  let currentPage = 1;
  let rafId = 0;

  const updateProgress = (displayPage: number, scrollRatio?: number) => {
    const ratio = scrollRatio ?? displayPage / contentPages;
    const pct = `${Math.min(100, Math.max(0, ratio * 100))}%`;

    if (progressFill) progressFill.style.width = pct;
    if (scrollFill) {
      if (window.innerWidth <= 1023) {
        scrollFill.style.width = pct;
        scrollFill.style.height = '100%';
      } else {
        scrollFill.style.height = pct;
        scrollFill.style.width = '100%';
      }
    }
  };

  const updateIndicator = (page: number) => {
    const display = Math.min(contentPages, Math.max(1, page - 2));
    if (indicator) {
      indicator.innerHTML = `${padPage(display)} <span class="manuscript-book__indicator-sep">/</span> ${padPage(contentPages)}`;
    }
    updateProgress(display);
  };

  const goToPage = (page: number, animate = true) => {
    if (!flipbook) return;
    const total = flipbookPageCount(contentPages);
    const next = Math.min(total, Math.max(1, page));
    if (next === currentPage) return;
    currentPage = next;
    flipbook.turn('page', next);
    if (!animate) flipbook.turn('stop');
    updateIndicator(next);
  };

  const flipbookWidth = () => {
    const binderWidth = binder?.clientWidth ?? flipbookEl.clientWidth;
    if (binderWidth > 0) return Math.round(binderWidth * 0.92);
    return Math.min(340, window.innerWidth - 64);
  };

  const flipbookHeight = (width: number) => Math.round(width * 1.32);

  const onScroll = () => {
    if (!useScrollDrive || !flipbook) return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const progress = scrollProgress(stage);
      const page = pageFromScroll(progress, contentPages);
      goToPage(page);
      const display = Math.min(contentPages, Math.max(1, page - 2));
      updateProgress(display, progress);
    });
  };

  const mount = async () => {
    try {
      await loadVendors();
      const $ = window.jQuery ?? window.$;
      if (!$) return;

      const width = flipbookWidth();
      const height = flipbookHeight(width);
      const useDouble = window.innerWidth >= 1024;

      flipbook = $(flipbookEl);
      flipbook.turn({
        width,
        height,
        page: 1,
        autoCenter: true,
        display: useDouble ? 'double' : 'single',
        acceleration: true,
        elevation: 64,
        gradients: !reducedMotion,
        duration: reducedMotion ? 0 : 720,
        when: {
          turned(_event: unknown, page: number) {
            currentPage = page;
            updateIndicator(page);
          },
        },
      });

      flipbookEl.classList.remove('manuscript-flipbook--loading');
      flipbookEl.classList.add('manuscript-flipbook--ready');
      root.classList.add('manuscript-book--ready');

      updateIndicator(1);

      if (useScrollDrive) {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }

      prevBtn?.addEventListener('click', () => goToPage(currentPage - 1));
      nextBtn?.addEventListener('click', () => goToPage(currentPage + 1));

      const onResize = () => {
        if (!flipbook) return;
        const w = flipbookWidth();
        const h = flipbookHeight(w);
        flipbook.turn('size', w, h);
        flipbook.turn('display', window.innerWidth >= 1024 ? 'double' : 'single');
        if (useScrollDrive) onScroll();
      };

      window.addEventListener('resize', onResize);
      window.addEventListener('manuscript-book:visible', onResize);
    } catch {
      flipbookEl.classList.add('manuscript-flipbook--fallback');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void mount();
      }
    },
    { rootMargin: '200px' },
  );

  observer.observe(root);
}
