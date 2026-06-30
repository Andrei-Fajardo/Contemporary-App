/** Width ÷ height for pre-rendered double-page spread JPGs */
const SPREAD_ASPECT = 1.45;

const FLIP_DURATION_MS = 600;

type BookState = {
  currentIndex: number;
  total: number;
  animating: boolean;
  spreads: HTMLElement[];
  reducedMotion: boolean;
  onResize: (() => void) | null;
};

const books = new WeakMap<HTMLElement, BookState>();

function contentPageCount(root: HTMLElement): number {
  return Number(root.dataset.pageCount ?? '0');
}

function measureBook(root: HTMLElement): { width: number; height: number } {
  const stage = root.querySelector<HTMLElement>('[data-manuscript-stage]');
  const maxW = Math.max(280, (stage?.clientWidth ?? window.innerWidth) - 24);
  const maxH = Math.max(200, (stage?.clientHeight ?? window.innerHeight) - 120);

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
  root.style.setProperty('--manuscript-flip-ms', `${FLIP_DURATION_MS}ms`);
  if (viewport) {
    viewport.style.width = `${width}px`;
    viewport.style.height = `${height}px`;
    viewport.style.maxWidth = '100%';
  }
}

function updateIndicator(root: HTMLElement, index: number, total: number) {
  const indicator = root.querySelector<HTMLElement>('[data-manuscript-indicator]');
  if (!indicator) return;
  indicator.textContent = `${index + 1} / ${total}`;
}

function waitTransition(el: HTMLElement, reducedMotion: boolean): Promise<void> {
  if (reducedMotion) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      el.removeEventListener('transitionend', onEnd);
      clearTimeout(fallback);
      resolve();
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target === el && event.propertyName === 'transform') done();
    };
    el.addEventListener('transitionend', onEnd);
    const fallback = window.setTimeout(done, FLIP_DURATION_MS + 80);
  });
}

function clearSpreadClasses(spread: HTMLElement) {
  spread.classList.remove('is-active', 'is-behind', 'is-flip-out', 'is-flip-in');
  spread.removeAttribute('style');
}

function applyIdleState(state: BookState) {
  state.spreads.forEach((spread, index) => {
    clearSpreadClasses(spread);
    const isActive = index === state.currentIndex;
    spread.classList.toggle('is-active', isActive);
    spread.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });
}

export function resizeManuscriptBook(root: HTMLElement): void {
  const viewport = root.querySelector<HTMLElement>('[data-manuscript-viewport]');
  const { width, height } = measureBook(root);
  syncShell(root, viewport, width, height);
}

export function resetManuscriptBook(root: HTMLElement): void {
  const state = books.get(root);
  if (!state) return;

  state.animating = false;
  state.currentIndex = 0;
  applyIdleState(state);
  updateIndicator(root, 0, state.total);
  resizeManuscriptBook(root);
}

export function goManuscriptPrev(root: HTMLElement): void {
  const state = books.get(root);
  if (!state || state.animating || state.currentIndex <= 0) return;

  const { spreads, reducedMotion } = state;
  const current = spreads[state.currentIndex];
  const previous = spreads[state.currentIndex - 1];
  const nextIndex = state.currentIndex - 1;

  if (reducedMotion) {
    state.currentIndex = nextIndex;
    applyIdleState(state);
    updateIndicator(root, nextIndex, state.total);
    return;
  }

  state.animating = true;
  current.classList.remove('is-active');
  previous.classList.add('is-flip-in');
  void previous.offsetWidth;
  previous.classList.add('is-active');

  void waitTransition(previous, reducedMotion).then(() => {
    state.currentIndex = nextIndex;
    applyIdleState(state);
    updateIndicator(root, nextIndex, state.total);
    state.animating = false;
  });
}

export function goManuscriptNext(root: HTMLElement): void {
  const state = books.get(root);
  if (!state || state.animating || state.currentIndex >= state.total - 1) return;

  const { spreads, reducedMotion } = state;
  const current = spreads[state.currentIndex];
  const next = spreads[state.currentIndex + 1];
  const nextIndex = state.currentIndex + 1;

  if (reducedMotion) {
    state.currentIndex = nextIndex;
    applyIdleState(state);
    updateIndicator(root, nextIndex, state.total);
    return;
  }

  state.animating = true;
  next.classList.add('is-behind');
  void next.offsetWidth;
  current.classList.add('is-flip-out');

  void waitTransition(current, reducedMotion).then(() => {
    state.currentIndex = nextIndex;
    applyIdleState(state);
    updateIndicator(root, nextIndex, state.total);
    state.animating = false;
  });
}

export function initManuscriptBook(root: HTMLElement): void {
  const stage = root.querySelector<HTMLElement>('[data-manuscript-stage]');
  const viewport = root.querySelector<HTMLElement>('[data-manuscript-viewport]');
  const carousel = root.querySelector<HTMLElement>('[data-manuscript-carousel]');
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-manuscript-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-manuscript-next]');

  if (!stage || !carousel) return;

  const total = contentPageCount(root);
  if (!total) return;

  const spreads = Array.from(
    carousel.querySelectorAll<HTMLElement>('[data-manuscript-spread]'),
  );
  if (spreads.length !== total) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state: BookState = {
    currentIndex: 0,
    total,
    animating: false,
    spreads,
    reducedMotion,
    onResize: null,
  };
  books.set(root, state);

  const { width, height } = measureBook(root);
  syncShell(root, viewport, width, height);
  applyIdleState(state);
  updateIndicator(root, 0, total);
  carousel.classList.add('manuscript-carousel--ready');

  prevBtn?.addEventListener('click', () => goManuscriptPrev(root));
  nextBtn?.addEventListener('click', () => goManuscriptNext(root));

  state.onResize = () => resizeManuscriptBook(root);
  window.addEventListener('resize', state.onResize);
}
