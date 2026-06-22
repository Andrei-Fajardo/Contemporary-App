import { prefersReducedMotion } from "./utils";

const AUTO_SPEED = 0.35;
const RESUME_DELAY_MS = 4000;

interface CarouselState {
  viewport: HTMLElement;
  track: HTMLElement;
  rafId: number | null;
  resumeTimer: ReturnType<typeof setTimeout> | null;
  paused: boolean;
  userPaused: boolean;
  autoScrolling: boolean;
  open: boolean;
}

const carousels = new Map<HTMLElement, CarouselState>();

function pauseCarousel(state: CarouselState, userInitiated = false): void {
  state.paused = true;
  if (userInitiated) state.userPaused = true;
  if (state.resumeTimer) {
    clearTimeout(state.resumeTimer);
    state.resumeTimer = null;
  }
}

function scheduleResume(state: CarouselState): void {
  if (state.resumeTimer) clearTimeout(state.resumeTimer);
  state.resumeTimer = setTimeout(() => {
    state.userPaused = false;
    if (state.open) state.paused = false;
  }, RESUME_DELAY_MS);
}

function tick(state: CarouselState): void {
  if (!state.open || state.paused || prefersReducedMotion()) {
    state.rafId = requestAnimationFrame(() => tick(state));
    return;
  }

  const halfWidth = state.track.scrollWidth / 2;
  if (halfWidth <= state.viewport.clientWidth) {
    state.rafId = requestAnimationFrame(() => tick(state));
    return;
  }

  state.autoScrolling = true;
  state.viewport.scrollLeft += AUTO_SPEED;
  if (state.viewport.scrollLeft >= halfWidth) {
    state.viewport.scrollLeft -= halfWidth;
  }
  state.autoScrolling = false;

  state.rafId = requestAnimationFrame(() => tick(state));
}

function scrollBySlide(state: CarouselState, direction: -1 | 1): void {
  const slide = state.track.querySelector<HTMLElement>(".exhibition-carousel__slide");
  const gap = parseFloat(getComputedStyle(state.track).gap) || 16;
  const amount = (slide?.offsetWidth ?? 280) + gap;
  pauseCarousel(state, true);
  state.viewport.scrollBy({ left: direction * amount, behavior: "smooth" });
  scheduleResume(state);
}

function bindCarousel(root: HTMLElement): void {
  if (carousels.has(root)) return;

  const viewport = root.querySelector<HTMLElement>(".exhibition-carousel__viewport");
  const track = root.querySelector<HTMLElement>(".exhibition-carousel__track");
  if (!viewport || !track) return;

  const state: CarouselState = {
    viewport,
    track,
    rafId: null,
    resumeTimer: null,
    paused: true,
    userPaused: false,
    autoScrolling: false,
    open: false,
  };
  carousels.set(root, state);

  const prev = root.querySelector<HTMLButtonElement>(".exhibition-carousel__btn--prev");
  const next = root.querySelector<HTMLButtonElement>(".exhibition-carousel__btn--next");

  prev?.addEventListener("click", () => scrollBySlide(state, -1));
  next?.addEventListener("click", () => scrollBySlide(state, 1));

  viewport.addEventListener("pointerdown", () => pauseCarousel(state, true));
  viewport.addEventListener("wheel", () => pauseCarousel(state, true), { passive: true });
  viewport.addEventListener("touchstart", () => pauseCarousel(state, true), { passive: true });

  viewport.addEventListener("scroll", () => {
    if (!state.autoScrolling) {
      pauseCarousel(state, true);
      scheduleResume(state);
    }
  });

  root.addEventListener("mouseenter", () => pauseCarousel(state));
  root.addEventListener("mouseleave", () => {
    if (!state.userPaused && state.open) state.paused = false;
  });

  const details = root.closest("details");
  if (details) {
    const onToggle = () => {
      state.open = details.open;
      if (state.open) {
        state.paused = false;
        state.userPaused = false;
        viewport.scrollLeft = 0;
      } else {
        pauseCarousel(state);
      }
    };
    details.addEventListener("toggle", onToggle);
    state.open = details.open;
    if (state.open) state.paused = false;
  } else {
    state.open = true;
    state.paused = false;
  }

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
