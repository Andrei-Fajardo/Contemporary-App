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

/** Single Turn.js page (half spread) width ÷ height */
const PAGE_HALF_ASPECT = SPREAD_ASPECT / 2;

/** Viewport width breakpoint for single-page mobile layout */
const MOBILE_BREAKPOINT = 768;

/** Mobile book width as a fraction of the viewport */
const MOBILE_VW_FILL = 0.93;

/** Desktop target fraction of the stage used for the flipbook spread */
const VIEWPORT_FILL = 0.88;

/** Bottom chrome (page indicator) reserved inside the stage */
const CHROME_RESERVE = 36;

/** Minimum inset from the stage edge for nav controls */
const STAGE_EDGE_INSET = 12;

/** Gap between the book edge and the nav button */
const NAV_BOOK_GAP = 14;

/** Turn.js page index (1-based) where spread 0001.jpg first appears as a full spread */
const FIRST_CONTENT_PAGE = 2;

/** Corner peel demo duration (ms) */
const PEEL_HINT_MS = 1500;

/** Delay after flipbook is ready before peel hint runs (ms) */
const PEEL_HINT_SETTLE_MS = 400;

/** Poll interval while waiting for turn animation / layout to settle (ms) */
const PEEL_SETTLE_POLL_MS = 50;

/** Debounce window resize recalculation (ms) */
const RESIZE_DEBOUNCE_MS = 175;

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
  peelTimeout: number | null;
  hintDismissed: boolean;
  isTurning: boolean;
  resizeDebounceId: number | null;
  resizePending: boolean;
  lastWidth: number;
  lastHeight: number;
  displayMode: 'single' | 'double';
  peelHintActive: boolean;
};

const books = new WeakMap<HTMLElement, BookState>();

function getViewport(root: HTMLElement): HTMLElement | null {
  return root.querySelector<HTMLElement>('[data-manuscript-viewport]');
}

function getDisplayMode(): 'single' | 'double' {
  return window.innerWidth < MOBILE_BREAKPOINT ? 'single' : 'double';
}

function applyLayoutMode(root: HTMLElement, displayMode: 'single' | 'double'): void {
  const mobile = displayMode === 'single';
  root.classList.toggle('manuscript-book--layout-single', mobile);
  root.dataset.manuscriptLayout = displayMode;
}

function measureBook(root: HTMLElement): {
  width: number;
  height: number;
  displayMode: 'single' | 'double';
} {
  const displayMode = getDisplayMode();
  const mobile = displayMode === 'single';
  const stage = root.querySelector<HTMLElement>('[data-manuscript-stage]');
  const modal = root.closest<HTMLElement>('.manuscript-modal');
  const header = modal?.querySelector<HTMLElement>('.manuscript-modal__header');
  const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;

  const stageW = stage?.clientWidth ?? window.innerWidth;
  const stageH = stage?.clientHeight ?? window.innerHeight;
  const availableH = Math.max(
    200,
    (mobile ? window.innerHeight : stageH) - headerH - CHROME_RESERVE,
  );

  if (mobile) {
    const maxW = Math.round(Math.max(260, window.innerWidth * MOBILE_VW_FILL));
    const maxH = Math.round(availableH * 0.94);

    let width = maxW;
    let height = Math.round(width / PAGE_HALF_ASPECT);

    if (height > maxH) {
      height = maxH;
      width = Math.round(height * PAGE_HALF_ASPECT);
    }

    return { width: Math.round(width), height: Math.round(height), displayMode };
  }

  const navBtn = root.querySelector<HTMLElement>('.manuscript-book__nav--side');
  const navSize = navBtn ? Math.ceil(navBtn.getBoundingClientRect().width) : 56;
  const navGutter = navSize + NAV_BOOK_GAP + STAGE_EDGE_INSET;

  const maxW = Math.max(280, stageW * VIEWPORT_FILL - navGutter * 2);
  const maxH = Math.max(200, (stageH - CHROME_RESERVE) * VIEWPORT_FILL);

  let width = maxW;
  let height = Math.round(width / SPREAD_ASPECT);

  if (height > maxH) {
    height = maxH;
    width = Math.round(height * SPREAD_ASPECT);
  }

  return { width: Math.round(width), height: Math.round(height), displayMode };
}

function syncShell(root: HTMLElement, viewport: HTMLElement | null, width: number, height: number) {
  const safeW = Math.round(width);
  const safeH = Math.round(height);
  const navBtn = root.querySelector<HTMLElement>('.manuscript-book__nav--side');
  const navSize = navBtn ? Math.ceil(navBtn.getBoundingClientRect().width) : 56;
  const navOffset = Math.round(navSize + NAV_BOOK_GAP);

  root.style.setProperty('--manuscript-w', `${safeW}px`);
  root.style.setProperty('--manuscript-h', `${safeH}px`);
  root.style.setProperty('--manuscript-nav-offset', `${navOffset}px`);
  if (viewport) {
    viewport.style.width = `${safeW}px`;
    viewport.style.height = `${safeH}px`;
    viewport.style.maxWidth = '100%';
  }
}

function setTurning(root: HTMLElement, state: BookState, turning: boolean) {
  if (turning && state.peelHintActive) return;

  state.isTurning = turning;
  root.classList.toggle('is-turning', turning);

  if (!turning && state.resizePending) {
    state.resizePending = false;
    resizeManuscriptBook(root, { immediate: true });
  }
}

function scheduleResize(root: HTMLElement) {
  const state = books.get(root);
  if (!state) return;

  if (state.resizeDebounceId !== null) {
    window.clearTimeout(state.resizeDebounceId);
  }

  state.resizeDebounceId = window.setTimeout(() => {
    state.resizeDebounceId = null;

    if (state.isTurning) {
      state.resizePending = true;
      return;
    }

    resizeManuscriptBook(root, { immediate: true });
  }, RESIZE_DEBOUNCE_MS);
}

function lastContentTurnPage(contentPages: number): number {
  return contentPages * 2;
}

function turnPageToSpreadIndex(turnPage: number, contentPages: number): number {
  if (turnPage <= 1) return 1;
  return Math.min(contentPages, Math.ceil((turnPage - 1) / 2));
}

function updateIndicator(root: HTMLElement, turnPage: number, contentPages: number) {
  const indicator = root.querySelector<HTMLElement>('[data-manuscript-indicator]');
  if (!indicator) return;
  indicator.textContent = `${turnPageToSpreadIndex(turnPage, contentPages)} / ${contentPages}`;
}

function clearPeelTimeout(state: BookState) {
  if (state.peelTimeout !== null) {
    window.clearTimeout(state.peelTimeout);
    state.peelTimeout = null;
  }
}

function dismissDragHint(root: HTMLElement, state: BookState) {
  if (state.hintDismissed) return;

  state.hintDismissed = true;
  state.peelHintActive = false;
  clearPeelTimeout(state);

  const viewport = getViewport(root);
  viewport?.classList.add('has-interacted');
  viewport?.classList.remove('is-drag-hint-active');

  try {
    state.flipbook?.turn('peel', false);
  } catch {
    /* Turn.js may reject peel reset mid-animation */
  }
}

function finalizeFlipbookLayout(root: HTMLElement, state: BookState): void {
  const viewport = getViewport(root);
  const { width, height, displayMode } = measureBook(root);

  applyLayoutMode(root, displayMode);
  syncShell(root, viewport, width, height);

  if (!state.flipbook) return;

  const safeW = Math.round(width);
  const safeH = Math.round(height);

  if (state.displayMode !== displayMode) {
    state.displayMode = displayMode;
    state.flipbook.turn('display', displayMode);
  }

  if (state.lastWidth !== safeW || state.lastHeight !== safeH) {
    state.lastWidth = safeW;
    state.lastHeight = safeH;
    state.flipbook.turn('size', safeW, safeH);
  }
}

function startPeelAnimation(root: HTMLElement, state: BookState, viewport: HTMLElement): void {
  if (state.hintDismissed || !state.flipbook) return;

  viewport.classList.add('is-drag-hint-active');
  state.peelHintActive = true;

  try {
    state.flipbook.turn('peel', 'br');
  } catch {
    state.peelHintActive = false;
    viewport.classList.remove('is-drag-hint-active');
    return;
  }

  state.peelTimeout = window.setTimeout(() => {
    state.peelTimeout = null;
    if (state.hintDismissed) return;

    try {
      state.flipbook?.turn('peel', false);
    } catch {
      /* ignore */
    }

    state.peelHintActive = false;
  }, PEEL_HINT_MS);
}

function waitForHintReady(
  root: HTMLElement,
  state: BookState,
  flipbookEl: HTMLElement,
  viewport: HTMLElement,
): void {
  if (state.hintDismissed) return;

  if (!flipbookEl.classList.contains('manuscript-flipbook--ready')) {
    state.peelTimeout = window.setTimeout(
      () => waitForHintReady(root, state, flipbookEl, viewport),
      PEEL_SETTLE_POLL_MS,
    );
    return;
  }

  if (state.isTurning) {
    state.peelTimeout = window.setTimeout(
      () => waitForHintReady(root, state, flipbookEl, viewport),
      PEEL_SETTLE_POLL_MS,
    );
    return;
  }

  finalizeFlipbookLayout(root, state);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (state.hintDismissed) return;
      startPeelAnimation(root, state, viewport);
    });
  });
}

function scheduleDragHint(root: HTMLElement, state: BookState, reducedMotion: boolean): void {
  const viewport = getViewport(root);
  const flipbookEl = root.querySelector<HTMLElement>('[data-manuscript-flipbook]');
  if (!viewport || !state.flipbook || !flipbookEl) return;

  state.hintDismissed = false;
  state.peelHintActive = false;
  viewport.classList.remove('has-interacted');
  viewport.classList.remove('is-drag-hint-active');
  clearPeelTimeout(state);

  if (reducedMotion) return;

  state.peelTimeout = window.setTimeout(() => {
    state.peelTimeout = null;
    waitForHintReady(root, state, flipbookEl, viewport);
  }, PEEL_HINT_SETTLE_MS);
}

function bindDragHintDismiss(root: HTMLElement, flipbookEl: HTMLElement, state: BookState) {
  if (flipbookEl.dataset.dragHintBound === 'true') return;
  flipbookEl.dataset.dragHintBound = 'true';

  const dismiss = () => dismissDragHint(root, state);

  flipbookEl.addEventListener('mousedown', dismiss);
  flipbookEl.addEventListener('touchstart', dismiss, { passive: true });

  root.querySelector('[data-manuscript-prev]')?.addEventListener('click', dismiss);
  root.querySelector('[data-manuscript-next]')?.addEventListener('click', dismiss);
}

export function resizeManuscriptBook(
  root: HTMLElement,
  options: { immediate?: boolean } = {},
): void {
  const state = books.get(root);
  const viewport = root.querySelector<HTMLElement>('[data-manuscript-viewport]');
  const { width, height, displayMode } = measureBook(root);

  applyLayoutMode(root, displayMode);

  if (state?.isTurning && !options.immediate) {
    state.resizePending = true;
    return;
  }

  if (!options.immediate) {
    scheduleResize(root);
    return;
  }

  const dimensionsUnchanged =
    state &&
    state.lastWidth === width &&
    state.lastHeight === height &&
    state.displayMode === displayMode;

  if (dimensionsUnchanged) {
    syncShell(root, viewport, width, height);
    return;
  }

  syncShell(root, viewport, width, height);

  if (!state?.flipbook) return;

  state.lastWidth = width;
  state.lastHeight = height;

  if (state.displayMode !== displayMode) {
    state.displayMode = displayMode;
    state.flipbook.turn('display', displayMode);
  }

  state.flipbook.turn('size', width, height);
}

export function resetManuscriptBook(root: HTMLElement): void {
  const state = books.get(root);
  if (!state?.flipbook) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  state.currentPage = FIRST_CONTENT_PAGE;
  state.flipbook.turn('page', FIRST_CONTENT_PAGE);
  updateIndicator(root, FIRST_CONTENT_PAGE, state.contentPages);
  resizeManuscriptBook(root, { immediate: true });
  scheduleDragHint(root, state, reducedMotion);
}

export function goManuscriptPrev(root: HTMLElement): void {
  const state = books.get(root);
  if (!state?.flipbook || state.currentPage <= 1) return;
  dismissDragHint(root, state);
  state.flipbook.turn('previous');
}

export function goManuscriptNext(root: HTMLElement): void {
  const state = books.get(root);
  if (!state?.flipbook) return;
  if (state.currentPage >= lastContentTurnPage(state.contentPages)) return;
  dismissDragHint(root, state);
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
    peelTimeout: null,
    hintDismissed: false,
    isTurning: false,
    resizeDebounceId: null,
    resizePending: false,
    lastWidth: 0,
    lastHeight: 0,
    displayMode: getDisplayMode(),
    peelHintActive: false,
  };
  books.set(root, state);

  const mount = async () => {
    try {
      await loadVendors();
      const $ = window.jQuery ?? window.$;
      if (!$) return;

      const { width, height, displayMode } = measureBook(root);
      applyLayoutMode(root, displayMode);
      syncShell(root, viewport, width, height);

      state.flipbook = $(flipbookEl);
      state.flipbook.turn({
        width,
        height,
        page: FIRST_CONTENT_PAGE,
        autoCenter: true,
        display: displayMode,
        acceleration: true,
        elevation: 50,
        gradients: true,
        duration: reducedMotion ? 0 : 600,
        when: {
          turning() {
            setTurning(root, state, true);
          },
          turned(_event: unknown, page: number) {
            state.currentPage = page;
            updateIndicator(root, page, contentPages);
            setTurning(root, state, false);
          },
        },
      });

      state.displayMode = displayMode;
      state.lastWidth = width;
      state.lastHeight = height;
      state.flipbook.turn('page', FIRST_CONTENT_PAGE);
      flipbookEl.classList.add('manuscript-flipbook--ready');
      updateIndicator(root, FIRST_CONTENT_PAGE, contentPages);

      bindDragHintDismiss(root, flipbookEl, state);
      scheduleDragHint(root, state, reducedMotion);

      prevBtn?.addEventListener('click', () => goManuscriptPrev(root));
      nextBtn?.addEventListener('click', () => goManuscriptNext(root));

      state.onResize = () => scheduleResize(root);
      window.addEventListener('resize', state.onResize);
    } catch {
      flipbookEl.classList.add('manuscript-flipbook--fallback');
      flipbookEl.classList.add('manuscript-flipbook--ready');
    }
  };

  void mount();
}
