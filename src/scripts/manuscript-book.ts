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

export function initManuscriptBook(root: HTMLElement): void {
  const stage = root.querySelector<HTMLElement>('[data-manuscript-stage]');
  const viewport = root.querySelector<HTMLElement>('[data-manuscript-viewport]');
  const flipbookEl = root.querySelector<HTMLElement>('[data-manuscript-flipbook]');
  const indicator = root.querySelector<HTMLElement>('[data-manuscript-indicator]');
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

  const flipbookWidth = () => {
    const fromViewport = viewport?.clientWidth ?? 0;
    if (fromViewport > 120) return fromViewport;
    return Math.min(920, window.innerWidth - 48);
  };

  const flipbookHeight = (width: number) => Math.round(width * 0.62);

  const updateIndicator = (page: number) => {
    if (!indicator) return;
    const display = Math.min(contentPages, Math.max(1, page - 2));
    indicator.textContent = `${display} / ${contentPages}`;
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

  const onScroll = () => {
    if (!useScrollDrive || !flipbook) return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const page = pageFromScroll(scrollProgress(stage), contentPages);
      goToPage(page);
    });
  };

  const mount = async () => {
    try {
      await loadVendors();
      const $ = window.jQuery ?? window.$;
      if (!$) return;

      const width = flipbookWidth();
      const height = flipbookHeight(width);

      flipbook = $(flipbookEl);
      flipbook.turn({
        width,
        height,
        autoCenter: true,
        display: window.innerWidth >= 1024 ? 'double' : 'single',
        acceleration: true,
        elevation: 50,
        gradients: !reducedMotion,
        duration: reducedMotion ? 0 : 600,
        when: {
          turned(_event: unknown, page: number) {
            currentPage = page;
            updateIndicator(page);
          },
        },
      });

      flipbookEl.classList.add('manuscript-flipbook--ready');
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
      flipbookEl.classList.add('manuscript-flipbook--ready');
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
