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

type BookState = {
  flipbook: JQueryInstance | null;
  currentPage: number;
  contentPages: number;
  onResize: (() => void) | null;
};

const books = new WeakMap<HTMLElement, BookState>();

function isDoubleSpread(): boolean {
  return window.innerWidth >= 1024;
}

function measureBook(root: HTMLElement): { width: number; height: number } {
  const stage = root.querySelector<HTMLElement>('[data-manuscript-stage]');
  const maxW = Math.max(280, (stage?.clientWidth ?? window.innerWidth) - 24);
  const maxH = Math.max(360, (stage?.clientHeight ?? window.innerHeight) - 120);
  const ratio = isDoubleSpread() ? 0.68 : 1.32;

  let width = Math.min(maxW, isDoubleSpread() ? 960 : 520);
  let height = Math.round(width * ratio);

  if (height > maxH) {
    height = maxH;
    width = Math.round(height / ratio);
  }

  return { width, height };
}

function syncShell(root: HTMLElement, viewport: HTMLElement | null, width: number, height: number) {
  root.style.setProperty('--manuscript-w', `${width}px`);
  root.style.setProperty('--manuscript-h', `${height}px`);
  if (viewport) {
    viewport.style.width = `${width}px`;
    viewport.style.height = `${height}px`;
    viewport.style.maxWidth = '100%';
  }
}

export function resizeManuscriptBook(root: HTMLElement): void {
  const state = books.get(root);
  if (!state?.flipbook) return;

  const viewport = root.querySelector<HTMLElement>('[data-manuscript-viewport]');
  const { width, height } = measureBook(root);
  syncShell(root, viewport, width, height);
  state.flipbook.turn('size', width, height);
  state.flipbook.turn('display', isDoubleSpread() ? 'double' : 'single');
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

  const state: BookState = {
    flipbook: null,
    currentPage: 1,
    contentPages,
    onResize: null,
  };
  books.set(root, state);

  const updateIndicator = (page: number) => {
    if (!indicator) return;
    const display = Math.min(contentPages, Math.max(1, page - 2));
    indicator.textContent = `${display} / ${contentPages}`;
  };

  const goToPage = (page: number) => {
    if (!state.flipbook) return;
    const total = flipbookPageCount(contentPages);
    const next = Math.min(total, Math.max(1, page));
    if (next === state.currentPage) return;
    state.currentPage = next;
    state.flipbook.turn('page', next);
    updateIndicator(next);
  };

  const mount = async () => {
    try {
      await loadVendors();
      const $ = window.jQuery ?? window.$;
      if (!$) return;

      const { width, height } = measureBook(root);
      syncShell(root, viewport, width, height);

      state.flipbook = $(flipbookEl);
      state.flipbook.turn({
        width,
        height,
        page: 1,
        autoCenter: true,
        display: isDoubleSpread() ? 'double' : 'single',
        acceleration: true,
        elevation: 50,
        gradients: !reducedMotion,
        duration: reducedMotion ? 0 : 600,
        when: {
          turned(_event: unknown, page: number) {
            state.currentPage = page;
            updateIndicator(page);
          },
        },
      });

      flipbookEl.classList.add('manuscript-flipbook--ready');
      updateIndicator(1);

      prevBtn?.addEventListener('click', () => goToPage(state.currentPage - 1));
      nextBtn?.addEventListener('click', () => goToPage(state.currentPage + 1));

      state.onResize = () => resizeManuscriptBook(root);
      window.addEventListener('resize', state.onResize);
    } catch {
      flipbookEl.classList.add('manuscript-flipbook--fallback');
      flipbookEl.classList.add('manuscript-flipbook--ready');
    }
  };

  void mount();
}
