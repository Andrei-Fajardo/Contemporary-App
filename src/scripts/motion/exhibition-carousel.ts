import { prefersReducedMotion } from "./utils";

const AUTO_SPEED = 0.6;
const RESUME_DELAY_MS = 3500;

interface CarouselState {
  root: HTMLElement;
  viewport: HTMLElement;
  track: HTMLElement;
  rafId: number | null;
  resumeTimer: ReturnType<typeof setTimeout> | null;
  paused: boolean;
  userPaused: boolean;
  programmaticScroll: boolean;
  open: boolean;
  slideStep: number;
}

const carousels = new Map<HTMLElement, CarouselState>();

function measureSlideStep(state: CarouselState): number {
  const slide = state.track.querySelector<HTMLElement>(".exhibition-carousel__slide");
  if (!slide) return 300;
  const gap = parseFloat(getComputedStyle(state.track).gap) || 16;
  return slide.offsetWidth + gap;
}

function pauseCarousel(state: CarouselState, userInitiated = false): void {
  state.paused = true;
  if (userInitiated) state.userPaused = true;
  if (state.resumeTimer) {
    clearTimeout(state.resumeTimer);
    state.resumeTimer = null;
  }
}

function resumeCarousel(state: CarouselState): void {
  if (!state.open || state.userPaused) return;
  state.paused = false;
}

function scheduleResume(state: CarouselState): void {
  if (state.resumeTimer) clearTimeout(state.resumeTimer);
  state.resumeTimer = setTimeout(() => {
    state.userPaused = false;
    resumeCarousel(state);
  }, RESUME_DELAY_MS);
}

function setScrollLeft(state: CarouselState, value: number): void {
  state.programmaticScroll = true;
  state.viewport.scrollLeft = value;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      state.programmaticScroll = false;
    });
  });
}

function tick(state: CarouselState): void {
  state.rafId = requestAnimationFrame(() => tick(state));

  if (!state.open || state.paused || prefersReducedMotion()) return;

  state.slideStep = measureSlideStep(state);
  const halfWidth = state.track.scrollWidth / 2;
  if (halfWidth <= state.viewport.clientWidth + 4) return;

  const next = state.viewport.scrollLeft + AUTO_SPEED;
  if (next >= halfWidth) {
    setScrollLeft(state, next - halfWidth);
  } else {
    setScrollLeft(state, next);
  }
}

function scrollBySlide(state: CarouselState, direction: -1 | 1): void {
  state.slideStep = measureSlideStep(state);
  const halfWidth = state.track.scrollWidth / 2;
  let next = state.viewport.scrollLeft + direction * state.slideStep;

  if (next < 0) next = halfWidth + next;
  if (next >= halfWidth) next -= halfWidth;

  pauseCarousel(state, true);
  state.viewport.scrollTo({ left: next, behavior: "smooth" });
  scheduleResume(state);
}

function onDetailsToggle(state: CarouselState, details: HTMLDetailsElement): void {
  state.open = details.open;
  if (state.open) {
    state.userPaused = false;
    state.paused = false;
    setScrollLeft(state, 0);
    state.slideStep = measureSlideStep(state);
    requestAnimationFrame(() => {
      state.slideStep = measureSlideStep(state);
    });
  } else {
    pauseCarousel(state);
  }
}

function bindCarousel(root: HTMLElement): void {
  if (carousels.has(root)) return;

  const viewport = root.querySelector<HTMLElement>(".exhibition-carousel__viewport");
  const track = root.querySelector<HTMLElement>(".exhibition-carousel__track");
  if (!viewport || !track) return;

  const state: CarouselState = {
    root,
    viewport,
    track,
    rafId: null,
    resumeTimer: null,
    paused: true,
    userPaused: false,
    programmaticScroll: false,
    open: false,
    slideStep: 300,
  };
  carousels.set(root, state);

  const prev = root.querySelector<HTMLButtonElement>(".exhibition-carousel__btn--prev");
  const next = root.querySelector<HTMLButtonElement>(".exhibition-carousel__btn--next");

  prev?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    scrollBySlide(state, -1);
  });

  next?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    scrollBySlide(state, 1);
  });

  let dragging = false;
  viewport.addEventListener("pointerdown", () => {
    dragging = true;
    pauseCarousel(state, true);
  });
  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    scheduleResume(state);
  });

  viewport.addEventListener("wheel", () => pauseCarousel(state, true), { passive: true });
  viewport.addEventListener("touchstart", () => pauseCarousel(state, true), { passive: true });

  viewport.addEventListener("scroll", () => {
    if (state.programmaticScroll || dragging) return;
    pauseCarousel(state, true);
    scheduleResume(state);
  });

  const details = root.closest("details");
  if (details) {
    details.addEventListener("toggle", () => onDetailsToggle(state, details));
    onDetailsToggle(state, details);
  } else {
    state.open = true;
    state.paused = false;
  }

  const resizeObserver = new ResizeObserver(() => {
    state.slideStep = measureSlideStep(state);
  });
  resizeObserver.observe(track);

  track.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", () => {
      state.slideStep = measureSlideStep(state);
    });
  });

  state.rafId = requestAnimationFrame(() => tick(state));
}

export function initExhibitionCarousels(): void {
  document.querySelectorAll<HTMLElement>("[data-exhibition-carousel]").forEach(bindCarousel);
}

export function resetExhibitionCarousels(): void {
  carousels.forEach((state) => {
    if (state.rafId) cancelAnimationFrame(state.rafId);
    if (state.resumeTimer) clearTimeout(state.resumeTimer);
  });
  carousels.clear();
}
