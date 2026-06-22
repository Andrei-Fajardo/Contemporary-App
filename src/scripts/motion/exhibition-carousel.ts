/**
 * Exhibition carousel — self-contained, works inside <details> accordions.
 * Supports: auto-scroll, drag, arrow buttons, touch swipe.
 */

const AUTO_SPEED = 0.55;
const RESUME_MS = 3000;

type CarouselState = {
  root: HTMLElement;
  viewport: HTMLDivElement;
  track: HTMLDivElement;
  raf: number;
  resumeTimer: ReturnType<typeof setTimeout> | null;
  paused: boolean;
  userPaused: boolean;
  open: boolean;
  dragging: boolean;
  dragStartX: number;
  dragStartScroll: number;
  programmatic: boolean;
};

const states = new WeakMap<HTMLElement, CarouselState>();

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function slideStep(state: CarouselState): number {
  const slide = state.track.querySelector<HTMLElement>(".exhibition-carousel__slide");
  if (!slide) return 280;
  const gap = parseFloat(getComputedStyle(state.track).gap) || 16;
  return slide.getBoundingClientRect().width + gap;
}

function loopWidth(state: CarouselState): number {
  return state.track.scrollWidth / 2;
}

function pause(state: CarouselState, byUser = false): void {
  state.paused = true;
  if (byUser) state.userPaused = true;
  if (state.resumeTimer) clearTimeout(state.resumeTimer);
}

function resume(state: CarouselState): void {
  if (state.open && !state.userPaused) state.paused = false;
}

function scheduleResume(state: CarouselState): void {
  if (state.resumeTimer) clearTimeout(state.resumeTimer);
  state.resumeTimer = setTimeout(() => {
    state.userPaused = false;
    resume(state);
  }, RESUME_MS);
}

function scrollTo(state: CarouselState, left: number, smooth = false): void {
  state.programmatic = true;
  state.viewport.style.scrollBehavior = smooth ? "smooth" : "auto";
  const half = loopWidth(state);
  let target = left;
  if (half > 0) {
    while (target < 0) target += half;
    while (target >= half) target -= half;
  }
  state.viewport.scrollLeft = target;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      state.programmatic = false;
    });
  });
}

function nudge(state: CarouselState, direction: -1 | 1): void {
  pause(state, true);
  scrollTo(state, state.viewport.scrollLeft + direction * slideStep(state), true);
  scheduleResume(state);
}

function tick(state: CarouselState): void {
  state.raf = requestAnimationFrame(() => tick(state));
  if (!state.open || state.paused || state.dragging || prefersReducedMotion()) return;

  const half = loopWidth(state);
  if (half <= state.viewport.clientWidth + 8) return;

  scrollTo(state, state.viewport.scrollLeft + AUTO_SPEED);
}

function activate(state: CarouselState): void {
  state.open = true;
  state.userPaused = false;
  state.paused = false;
  scrollTo(state, 0);
  requestAnimationFrame(() => scrollTo(state, 0));
}

function deactivate(state: CarouselState): void {
  state.open = false;
  pause(state);
}

function bindCarousel(root: HTMLElement): void {
  if (root.dataset.carouselBound === "true") return;

  const viewport = root.querySelector<HTMLDivElement>(".exhibition-carousel__viewport");
  const track = root.querySelector<HTMLDivElement>(".exhibition-carousel__track");
  if (!viewport || !track) return;

  root.dataset.carouselBound = "true";

  const state: CarouselState = {
    root,
    viewport,
    track,
    raf: 0,
    resumeTimer: null,
    paused: true,
    userPaused: false,
    open: false,
    dragging: false,
    dragStartX: 0,
    dragStartScroll: 0,
    programmatic: false,
  };
  states.set(root, state);

  root.querySelector(".exhibition-carousel__btn--prev")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nudge(state, -1);
  });

  root.querySelector(".exhibition-carousel__btn--next")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nudge(state, 1);
  });

  viewport.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    state.dragging = true;
    state.dragStartX = e.clientX;
    state.dragStartScroll = viewport.scrollLeft;
    pause(state, true);
    viewport.style.scrollBehavior = "auto";
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add("is-dragging");
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!state.dragging) return;
    const dx = e.clientX - state.dragStartX;
    viewport.scrollLeft = state.dragStartScroll - dx;
  });

  const endDrag = () => {
    if (!state.dragging) return;
    state.dragging = false;
    viewport.style.scrollBehavior = "smooth";
    viewport.classList.remove("is-dragging");
    scheduleResume(state);
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("lostpointercapture", endDrag);

  viewport.addEventListener(
    "wheel",
    () => {
      pause(state, true);
      scheduleResume(state);
    },
    { passive: true }
  );

  viewport.addEventListener("scroll", () => {
    if (state.programmatic || state.dragging) return;
    pause(state, true);
    scheduleResume(state);
  });

  const details = root.closest("details");
  if (details) {
    const sync = () => (details.open ? activate(state) : deactivate(state));
    details.addEventListener("toggle", sync);
    if (details.open) activate(state);
  } else {
    activate(state);
  }

  new ResizeObserver(() => {
    if (state.open) scrollTo(state, state.viewport.scrollLeft);
  }).observe(track);

  tick(state);
}

export function initExhibitionCarousels(): void {
  document.querySelectorAll<HTMLElement>("[data-exhibition-carousel]").forEach(bindCarousel);
}

export function resetExhibitionCarousels(): void {
  document.querySelectorAll<HTMLElement>("[data-exhibition-carousel]").forEach((root) => {
    const state = states.get(root);
    if (state?.raf) cancelAnimationFrame(state.raf);
    delete root.dataset.carouselBound;
  });
}

// Self-boot when imported as a module (PageLayout + direct import)
if (typeof document !== "undefined") {
  const boot = () => initExhibitionCarousels();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  document.addEventListener("astro:page-load", boot);
}
