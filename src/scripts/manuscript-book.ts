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
  let mounted = false;
  let onResize: (() => void) | null = null;

  const isRenderable = () => {
    if (root.closest('[hidden]')) return false;
    const rect = root.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const tryMount = () => {
    if (mounted) {
      onResize?.();
      return;
    }
    if (!isRenderable()) return;
    mounted = true;
    observer.disconnect();
    void mount();
  };

  const isDoubleSpread = () => window.innerWidth >= 1024;

  const flipbookWidth = () => {
    const sticky = root.querySelector<HTMLElement>('[data-manuscript-sticky]');
    const w = sticky?.clientWidth ?? viewport?.clientWidth ?? 0;
    if (w > 120) return w;
    return Math.min(920, window.innerWidth - 48);
  };

  const flipbookHeight = (width: number) => {
    if (isDoubleSpread()) return Math.round(width * 0.68);
    return Math.round(width * 1.32);
  };

  const syncShell = (width: number, height: number) => {
    root.style.setProperty('--manuscript-w', `${width}px`);
    root.style.setProperty('--manuscript-h', `${height}px`);
    if (viewport) {
      viewport.style.width = `${width}px`;
      viewport.style.maxWidth = '100%';
      viewport.style.height = `${height}px`;
    }
  };

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
      syncShell(width, height);

      flipbook = $(flipbookEl);
      flipbook.turn({
        width,
        height,
        autoCenter: true,
        display: isDoubleSpread() ? 'double' : 'single',
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
        const scrollTargets: Array<HTMLElement | Window> = [window];
        const mainColumn = document.querySelector<HTMLElement>('.site-main-column');
        if (mainColumn) scrollTargets.push(mainColumn);
        scrollTargets.forEach((target) => {
          target.addEventListener('scroll', onScroll, { passive: true });
        });
        onScroll();
      }

      prevBtn?.addEventListener('click', () => goToPage(currentPage - 1));
      nextBtn?.addEventListener('click', () => goToPage(currentPage + 1));

      onResize = () => {
        if (!flipbook) return;
        const w = flipbookWidth();
        const h = flipbookHeight(w);
        syncShell(w, h);
        flipbook.turn('size', w, h);
        flipbook.turn('display', isDoubleSpread() ? 'double' : 'single');
        if (useScrollDrive) onScroll();
      };

      window.addEventListener('resize', () => onResize?.());
      window.addEventListener('manuscript-book:visible', tryMount);
    } catch {
      flipbookEl.classList.add('manuscript-flipbook--fallback');
      flipbookEl.classList.add('manuscript-flipbook--ready');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) tryMount();
    },
    { rootMargin: '200px' },
  );

  observer.observe(root);
  document.addEventListener('tabular:change', (event) => {
    const tab = (event as CustomEvent<{ tab: string }>).detail?.tab;
    if (tab === 'publications') setTimeout(tryMount, 120);
  });
}
