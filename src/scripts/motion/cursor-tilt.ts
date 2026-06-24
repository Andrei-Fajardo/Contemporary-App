/** Cursor-reactive 3D tilt for editorial images — spring-smoothed rAF, tab-aware */

type TiltState = {
  rotX: number;
  rotY: number;
  targetX: number;
  targetY: number;
  velX: number;
  velY: number;
};

const PROXIMITY_RADIUS = 420;
const MAX_TILT = 9;
const SPRING = 0.16;
const DAMPING = 0.84;

const cursor = { x: -9999, y: -9999, active: false };

const states = new Map<HTMLElement, TiltState>();
let rafId = 0;
let running = false;
let pointerBound = false;
let tabListenerBound = false;
let lastFrameT = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function collectTiltTargets(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-cursor-tilt], [data-press-tilt]"),
  );
}

function isTargetVisible(el: HTMLElement): boolean {
  const panel = el.closest<HTMLElement>("[data-tab-panel]");
  if (panel && (!panel.classList.contains("is-active") || panel.hidden)) {
    return false;
  }

  const details = el.closest<HTMLDetailsElement>("details");
  if (details && !details.open) {
    return false;
  }

  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  if (rect.bottom < -60 || rect.top > window.innerHeight + 60) return false;

  return true;
}

function getState(el: HTMLElement): TiltState {
  let state = states.get(el);
  if (!state) {
    state = { rotX: 0, rotY: 0, targetX: 0, targetY: 0, velX: 0, velY: 0 };
    states.set(el, state);
  }
  return state;
}

function proximityStrength(dist: number, radius: number): number {
  if (dist >= radius) return 0;
  const t = 1 - dist / radius;
  return t * t;
}

function updateTargets(): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = collectTiltTargets();

  if (!cursor.active || reduced) {
    targets.forEach((el) => {
      const state = getState(el);
      state.targetX = 0;
      state.targetY = 0;
    });
    return;
  }

  targets.forEach((el) => {
    const state = getState(el);

    if (!isTargetVisible(el)) {
      state.targetX = 0;
      state.targetY = 0;
      return;
    }

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    const dx = cursor.x - cx;
    const dy = cursor.y - cy;
    const dist = Math.hypot(dx, dy);
    const strength = proximityStrength(
      dist,
      PROXIMITY_RADIUS + Math.max(rect.width, rect.height) * 0.4,
    );

    if (strength <= 0) {
      state.targetX = 0;
      state.targetY = 0;
      return;
    }

    const normX = clamp(dx / (rect.width * 0.5), -1, 1);
    const normY = clamp(dy / (rect.height * 0.5), -1, 1);
    state.targetY = normX * MAX_TILT * strength;
    state.targetX = -normY * MAX_TILT * strength;
  });
}

function integrate(state: TiltState, dt: number): void {
  const damp = Math.pow(DAMPING, dt * 60);
  state.velX = (state.velX + (state.targetX - state.rotX) * SPRING * dt * 60) * damp;
  state.velY = (state.velY + (state.targetY - state.rotY) * SPRING * dt * 60) * damp;
  state.rotX += state.velX * dt;
  state.rotY += state.velY * dt;

  if (!cursor.active && Math.abs(state.rotX) < 0.02 && Math.abs(state.rotY) < 0.02) {
    state.rotX = 0;
    state.rotY = 0;
    state.velX = 0;
    state.velY = 0;
  }
}

function applyTransforms(): void {
  collectTiltTargets().forEach((el) => {
    const state = getState(el);
    const active = Math.hypot(state.rotX, state.rotY) > 0.15;
    el.classList.toggle("is-tilt-active", active);

    const lift = Math.min(10, Math.hypot(state.rotX, state.rotY) * 0.55);
    el.style.transform = `rotateX(${state.rotX.toFixed(3)}deg) rotateY(${state.rotY.toFixed(3)}deg) translateZ(${lift.toFixed(2)}px)`;
  });
}

function tick(now: number): void {
  if (!running) return;

  const dt = lastFrameT ? clamp((now - lastFrameT) / 1000, 0.001, 0.05) : 1 / 60;
  lastFrameT = now;

  updateTargets();
  states.forEach((state) => integrate(state, dt));
  applyTransforms();

  rafId = requestAnimationFrame(tick);
}

function onPointerMove(event: PointerEvent): void {
  cursor.x = event.clientX;
  cursor.y = event.clientY;
  cursor.active = true;
}

function onPointerLeave(): void {
  cursor.active = false;
  collectTiltTargets().forEach((el) => {
    const state = getState(el);
    state.targetX = 0;
    state.targetY = 0;
  });
}

function bindPointer(): void {
  if (pointerBound) return;
  pointerBound = true;
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerMove, { passive: true });
  window.addEventListener("blur", onPointerLeave);
  document.documentElement.addEventListener("mouseleave", onPointerLeave);
}

export function startCursorTilt(): void {
  if (running) return;
  running = true;
  lastFrameT = 0;
  document.documentElement.classList.add("cursor-tilt-live");
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
}

export function stopCursorTilt(): void {
  running = false;
  cancelAnimationFrame(rafId);
}

export function resetCursorTilt(): void {
  stopCursorTilt();
  states.clear();
  cursor.active = false;
  document.documentElement.classList.remove("cursor-tilt-live");
  collectTiltTargets().forEach((el) => {
    el.classList.remove("is-tilt-active");
    el.style.transform = "";
  });
}

export function initCursorTilt(): void {
  if (!collectTiltTargets().length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  bindPointer();
  collectTiltTargets().forEach((el) => getState(el));
  startCursorTilt();
}

export function bindCursorTiltTabListener(): void {
  if (tabListenerBound) return;
  tabListenerBound = true;

  document.addEventListener("tabular:change", () => {
    if (!running) initCursorTilt();
    collectTiltTargets().forEach((el) => {
      const state = getState(el);
      state.targetX = 0;
      state.targetY = 0;
    });
  });

  document.addEventListener(
    "toggle",
    (event) => {
      const target = event.target as HTMLElement;
      if (!target.classList.contains("exhibition-accordion__item")) return;
      collectTiltTargets().forEach((el) => {
        const state = getState(el);
        state.targetX = 0;
        state.targetY = 0;
      });
    },
    true,
  );
}

/** @deprecated Use initCursorTilt */
export const initPressTilt = initCursorTilt;
export const resetPressTilt = resetCursorTilt;
export const bindPressTiltTabListener = bindCursorTiltTabListener;
