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

/** Width ÷ height for pre-rendered double-page spread JPGs */
const SPREAD_ASPECT = 1.45;

/** Safety inset so the double spread never clips against the stage edges */
const STAGE_SAFETY_MARGIN = 40;

/** Turn.js page index (1-based) where spread 0001.jpg first appears as a full spread */
const FIRST_CONTENT_PAGE = 2;

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

type BookState = {
  flipbook: JQueryInstance | null;
  currentPage: number;
  contentPages: number;
  onResize: (() => void) | null;
};

const books = new WeakMap<HTMLElement, BookState>();

function measureBook(root: HTMLElement): { width: number; height: number } {
  const stage = root.querySelector<HTMLElement>('[data-manuscript-stage]');
  const stageBody = root.querySelector<HTMLElement>('.manuscript-book__stage-body');
  const bodyPad =
    stageBody
      ? parseFloat(getComputedStyle(stageBody).paddingLeft) +
        parseFloat(getComputedStyle(stageBody).paddingRight)
      : 0;

  const maxW = Math.max(
    280,
    (stage?.clientWidth ?? window.innerWidth) - STAGE_SAFETY_MARGIN - bodyPad - 24,
  );
  const maxH = Math.max(
    200,
    (stage?.clientHeight ?? window.innerHeight) - STAGE_SAFETY_MARGIN - 120,
  );

  let width = Math.min(maxW, 1100);
  let height = Math.round(width / SPREAD_ASPECT);

  if (height > maxH) {
    height = maxH;
    width = Math.round(height * SPREAD_ASPECT);
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

function lastContentTurnPage(contentPages: number): number {
  return contentPages * 2;
}

function turnPageToSpreadIndex(turnPage: number, contentPages: number): number {
  if (turnPage <= 1) return 1;
  return Math.min(contentPages, Math.floor((turnPage + 1) / 2));
}

function updateIndicator(root: HTMLElement, turnPage: number, contentPages: number) {
  const indicator = root.querySelector<HTMLElement>('[data-manuscript-indicator]');
  if (!indicator) return;
  indicator.textContent = `${turnPageToSpreadIndex(turnPage, contentPages)} / ${contentPages}`;
}

export function resizeManuscriptBook(root: HTMLElement): void {
  const state = books.get(root);
  const viewport = root.querySelector<HTMLElement>('[data-manuscript-viewport]');
  const { width, height } = measureBook(root);
  syncShell(root, viewport, width, height);

  if (!state?.flipbook) return;
  state.flipbook.turn('size', width, height);
  state.flipbook.turn('display', 'double');
}

export function resetManuscriptBook(root: HTMLElement): void {
  const state = books.get(root);
  if (!state?.flipbook) return;

  state.currentPage = FIRST_CONTENT_PAGE;
  state.flipbook.turn('page', FIRST_CONTENT_PAGE);
  updateIndicator(root, FIRST_CONTENT_PAGE, state.contentPages);
  resizeManuscriptBook(root);
}

export function goManuscriptPrev(root: HTMLElement): void {
  const state = books.get(root);
  if (!state?.flipbook || state.currentPage <= 1) return;
  state.flipbook.turn('previous');
}

export function goManuscriptNext(root: HTMLElement): void {
  const state = books.get(root);
  if (!state?.flipbook) return;
  if (state.currentPage >= lastContentTurnPage(state.contentPages)) return;
  state.flipbook.turn('next');
}

export function initManuscriptBook(root: HTMLElement): void {
  const viewport = root.querySelector<HTMLElement>('[data-manuscript-viewport]');
  const flipbookEl = root.querySelector<HTMLElement>('[data-manuscript-flipbook]');
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-manuscript-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-manuscript-next]');

  if (!flipbookEl) return;

  const contentPages = contentPageCount(root);
  if (!contentPages) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state: BookState = {
    flipbook: null,
    currentPage: FIRST_CONTENT_PAGE,
    contentPages,
    onResize: null,
  };
  books.set(root, state);

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
        page: FIRST_CONTENT_PAGE,
        autoCenter: true,
        display: 'double',
        acceleration: true,
        elevation: 50,
        gradients: true,
        duration: reducedMotion ? 0 : 600,
        when: {
          turned(_event: unknown, page: number) {
            state.currentPage = page;
            updateIndicator(root, page, contentPages);
          },
        },
      });

      state.flipbook.turn('page', FIRST_CONTENT_PAGE);
      flipbookEl.classList.add('manuscript-flipbook--ready');
      updateIndicator(root, FIRST_CONTENT_PAGE, contentPages);

      prevBtn?.addEventListener('click', () => goManuscriptPrev(root));
      nextBtn?.addEventListener('click', () => goManuscriptNext(root));

      state.onResize = () => resizeManuscriptBook(root);
      window.addEventListener('resize', state.onResize);
    } catch {
      flipbookEl.classList.add('manuscript-flipbook--fallback');
      flipbookEl.classList.add('manuscript-flipbook--ready');
    }
  };

  void mount();
}
