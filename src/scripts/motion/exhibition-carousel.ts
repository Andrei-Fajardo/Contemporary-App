/**
 * Exhibition carousel — free-scroll drag (no snap), seamless infinite loop,
 * auto-scroll, and arrow navigation. Uses Motion for smooth programmatic moves.
 */
import { animate } from "motion";

const AUTO_SPEED = 0.5;
const RESUME_MS = 3500;

type CarouselState = {
  root: HTMLElement;
  viewport: HTMLDivElement;
  track: HTMLDivElement;
  resumeTimer: ReturnType<typeof setTimeout> | null;
  autoAnim: ReturnType<typeof animate> | null;
  paused: boolean;
  userPaused: boolean;
  open: boolean;
  dragging: boolean;
  dragStartX: number;
  dragStartScroll: number;
  programmatic: boolean;
  hasActivated: boolean;
};

const states = new WeakMap<HTMLElement, CarouselState>();

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function loopWidth(state: CarouselState): number {
  return state.track.scrollWidth / 2;
}

function slideStep(state: CarouselState): number {
  const slide = state.track.querySelector<HTMLElement>(".exhibition-carousel__slide");
  if (!slide) return 280;
  const gap = parseFloat(getComputedStyle(state.track).gap) || 16;
  return slide.getBoundingClientRect().width + gap;
}

/** Invisible wrap at duplicate boundary — keeps infinite loop without visual jump */
function normalizeLoop(state: CarouselState): number {
  const half = loopWidth(state);
  if (half <= 0) return 0;

  const { viewport } = state;
  let shift = 0;

  if (viewport.scrollLeft >= half) {
    shift = -half;
  } else if (viewport.scrollLeft < 0) {
    shift = half;
  }

  if (shift !== 0) {
    state.programmatic = true;
    viewport.scrollLeft += shift;
    requestAnimationFrame(() => {
      state.programmatic = false;
    });
  }

  return shift;
}

function pause(state: CarouselState, byUser = false): void {
  state.paused = true;
  if (byUser) state.userPaused = true;
  if (state.resumeTimer) clearTimeout(state.resumeTimer);
  stopAutoAnim(state);
}

function resume(state: CarouselState): void {
  if (state.open && !state.userPaused) {
    state.paused = false;
    startAutoAnim(state);
  }
}

function scheduleResume(state: CarouselState): void {
  if (state.resumeTimer) clearTimeout(state.resumeTimer);
  state.resumeTimer = setTimeout(() => {
    state.userPaused = false;
    resume(state);
  }, RESUME_MS);
}

function stopAutoAnim(state: CarouselState): void {
  state.autoAnim?.stop();
  state.autoAnim = null;
}

function startAutoAnim(state: CarouselState): void {
  if (prefersReducedMotion() || !state.open || state.paused || state.dragging) return;

  const half = loopWidth(state);
  if (half <= state.viewport.clientWidth + 8) return;

  stopAutoAnim(state);

  const runCycle = () => {
    if (!state.open || state.paused || state.dragging || state.userPaused) return;

    const from = state.viewport.scrollLeft;
    const remaining = half - from;
    const duration = Math.max(0.5, remaining / (AUTO_SPEED * 60));

    state.autoAnim = animate(
      state.viewport,
      { scrollLeft: half },
      {
        duration,
        ease: "linear",
        onComplete: () => {
          state.programmatic = true;
          state.viewport.scrollLeft = 0;
          state.programmatic = false;
          runCycle();
        },
      }
    );
  };

  runCycle();
}

function nudge(state: CarouselState, direction: -1 | 1): void {
  pause(state, true);
  const target = state.viewport.scrollLeft + direction * slideStep(state);

  animate(state.viewport, { scrollLeft: target }, {
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1],
    onComplete: () => {
      normalizeLoop(state);
      scheduleResume(state);
    },
  });
}

function activate(state: CarouselState): void {
  state.open = true;
  state.userPaused = false;
  state.paused = false;

  if (!state.hasActivated) {
    state.viewport.scrollLeft = 0;
    state.hasActivated = true;
  }

  requestAnimationFrame(() => {
    normalizeLoop(state);
    startAutoAnim(state);
  });
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
  viewport.style.scrollBehavior = "auto";

  const state: CarouselState = {
    root,
    viewport,
    track,
    resumeTimer: null,
    autoAnim: null,
    paused: true,
    userPaused: false,
    open: false,
    dragging: false,
    dragStartX: 0,
    dragStartScroll: 0,
    programmatic: false,
    hasActivated: false,
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
    stopAutoAnim(state);
    state.dragging = true;
    state.dragStartX = e.clientX;
    state.dragStartScroll = viewport.scrollLeft;
    pause(state, true);
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add("is-dragging");
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!state.dragging) return;
    e.preventDefault();
    const dx = e.clientX - state.dragStartX;
    viewport.scrollLeft = state.dragStartScroll - dx;
    const shift = normalizeLoop(state);
    if (shift !== 0) state.dragStartScroll += shift;
  });

  const endDrag = () => {
    if (!state.dragging) return;
    state.dragging = false;
    viewport.classList.remove("is-dragging");
    normalizeLoop(state);
    scheduleResume(state);
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("lostpointercapture", endDrag);

  viewport.addEventListener(
    "wheel",
    () => {
      stopAutoAnim(state);
      pause(state, true);
      requestAnimationFrame(() => normalizeLoop(state));
      scheduleResume(state);
    },
    { passive: true }
  );

  viewport.addEventListener("scroll", () => {
    if (state.programmatic || state.dragging) return;
    stopAutoAnim(state);
    normalizeLoop(state);
    pause(state, true);
    scheduleResume(state);
  });

  const details = root.closest("details");
  if (details) {
    details.addEventListener("toggle", () => (details.open ? activate(state) : deactivate(state)));
    if (details.open) activate(state);
  } else {
    activate(state);
  }

  new ResizeObserver(() => {
    if (state.open) normalizeLoop(state);
  }).observe(track);
}

export function initExhibitionCarousels(): void {
  document.querySelectorAll<HTMLElement>("[data-exhibition-carousel]").forEach(bindCarousel);
}

export function resetExhibitionCarousels(): void {
  document.querySelectorAll<HTMLElement>("[data-exhibition-carousel]").forEach((root) => {
    const state = states.get(root);
    if (state) {
      stopAutoAnim(state);
      if (state.resumeTimer) clearTimeout(state.resumeTimer);
    }
    delete root.dataset.carouselBound;
  });
}

if (typeof document !== "undefined") {
  const boot = () => initExhibitionCarousels();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  document.addEventListener("astro:page-load", boot);
}
