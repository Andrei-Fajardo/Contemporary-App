/**
 * Exhibition carousel — finite slide strip with drag, auto-scroll to end,
 * and arrow navigation. Uses Motion for smooth programmatic scroll.
 */
import { animate } from "motion";

const AUTO_SPEED = 0.5;
const RESUME_MS = 3500;
const SCROLL_EPS = 2;

type CarouselState = {
  root: HTMLElement;
  viewport: HTMLDivElement;
  track: HTMLDivElement;
  prevBtn: HTMLButtonElement | null;
  nextBtn: HTMLButtonElement | null;
  resumeTimer: ReturnType<typeof setTimeout> | null;
  autoAnim: ReturnType<typeof animate> | null;
  scrollAnim: ReturnType<typeof animate> | null;
  paused: boolean;
  userPaused: boolean;
  open: boolean;
  dragging: boolean;
  dragStartX: number;
  dragStartScroll: number;
  slideCount: number;
  hasActivated: boolean;
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

function maxScroll(viewport: HTMLDivElement): number {
  return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
}

function clampScroll(viewport: HTMLDivElement, value: number): number {
  return Math.min(Math.max(0, value), maxScroll(viewport));
}

function atStart(state: CarouselState): boolean {
  return state.viewport.scrollLeft <= SCROLL_EPS;
}

function atEnd(state: CarouselState): boolean {
  return state.viewport.scrollLeft >= maxScroll(state.viewport) - SCROLL_EPS;
}

function updateButtons(state: CarouselState): void {
  const start = atStart(state);
  const end = atEnd(state);

  state.prevBtn?.toggleAttribute("disabled", start);
  state.nextBtn?.toggleAttribute("disabled", end);
  state.prevBtn?.classList.toggle("is-disabled", start);
  state.nextBtn?.classList.toggle("is-disabled", end);
  state.prevBtn?.setAttribute("aria-disabled", start ? "true" : "false");
  state.nextBtn?.setAttribute("aria-disabled", end ? "true" : "false");
}

function animateScrollTo(
  state: CarouselState,
  target: number,
  onComplete?: () => void
): void {
  state.scrollAnim?.stop();
  const from = state.viewport.scrollLeft;
  const to = clampScroll(state.viewport, target);

  if (Math.abs(to - from) < 0.5) {
    updateButtons(state);
    onComplete?.();
    return;
  }

  state.scrollAnim = animate(from, to, {
    duration: prefersReducedMotion() ? 0 : 0.55,
    ease: [0.16, 1, 0.3, 1],
    onUpdate: (value) => {
      state.viewport.scrollLeft = value;
      updateButtons(state);
    },
    onComplete: () => {
      state.scrollAnim = null;
      updateButtons(state);
      onComplete?.();
    },
  });
}

function pause(state: CarouselState, byUser = false): void {
  state.paused = true;
  if (byUser) state.userPaused = true;
  if (state.resumeTimer) clearTimeout(state.resumeTimer);
  stopAutoAnim(state);
}

function resume(state: CarouselState): void {
  if (state.open && !state.userPaused && !atEnd(state)) {
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
  if (prefersReducedMotion() || !state.open || state.paused || state.dragging || atEnd(state)) {
    return;
  }

  const end = maxScroll(state.viewport);
  if (end <= SCROLL_EPS) return;

  stopAutoAnim(state);

  const from = state.viewport.scrollLeft;
  const remaining = end - from;
  const duration = Math.max(0.5, remaining / (AUTO_SPEED * 60));

  state.autoAnim = animate(from, end, {
    duration,
    ease: "linear",
    onUpdate: (value) => {
      state.viewport.scrollLeft = value;
      updateButtons(state);
    },
    onComplete: () => {
      state.autoAnim = null;
      state.viewport.scrollLeft = end;
      updateButtons(state);
      state.paused = true;
    },
  });
}

function nudge(state: CarouselState, direction: -1 | 1): void {
  if (direction === -1 && atStart(state)) return;
  if (direction === 1 && atEnd(state)) return;

  pause(state, true);
  const target = state.viewport.scrollLeft + direction * slideStep(state);
  animateScrollTo(state, target, () => scheduleResume(state));
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
    updateButtons(state);
    if (!atEnd(state)) startAutoAnim(state);
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

  const slides = track.querySelectorAll(".exhibition-carousel__slide");
  const state: CarouselState = {
    root,
    viewport,
    track,
    prevBtn: root.querySelector<HTMLButtonElement>(".exhibition-carousel__btn--prev"),
    nextBtn: root.querySelector<HTMLButtonElement>(".exhibition-carousel__btn--next"),
    resumeTimer: null,
    autoAnim: null,
    scrollAnim: null,
    paused: true,
    userPaused: false,
    open: false,
    dragging: false,
    dragStartX: 0,
    dragStartScroll: 0,
    slideCount: slides.length,
    hasActivated: false,
  };
  states.set(root, state);

  state.prevBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nudge(state, -1);
  });

  state.nextBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nudge(state, 1);
  });

  viewport.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    stopAutoAnim(state);
    state.scrollAnim?.stop();
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
    viewport.scrollLeft = clampScroll(viewport, state.dragStartScroll - dx);
    updateButtons(state);
  });

  const endDrag = () => {
    if (!state.dragging) return;
    state.dragging = false;
    viewport.classList.remove("is-dragging");
    viewport.scrollLeft = clampScroll(viewport, viewport.scrollLeft);
    updateButtons(state);
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
      requestAnimationFrame(() => {
        viewport.scrollLeft = clampScroll(viewport, viewport.scrollLeft);
        updateButtons(state);
      });
      scheduleResume(state);
    },
    { passive: true }
  );

  viewport.addEventListener("scroll", () => {
    if (state.dragging) return;
    updateButtons(state);
  });

  const details = root.closest("details");
  if (details) {
    details.addEventListener("toggle", () => (details.open ? activate(state) : deactivate(state)));
    if (details.open) activate(state);
  } else {
    activate(state);
  }

  new ResizeObserver(() => {
    viewport.scrollLeft = clampScroll(viewport, viewport.scrollLeft);
    updateButtons(state);
    if (state.open && !state.paused && !state.userPaused && !atEnd(state)) {
      startAutoAnim(state);
    }
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
      state.scrollAnim?.stop();
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
