/** Press poster cursor tilt — minimal 3D lean toward pointer, spring-smoothed rAF */

type TiltState = {
  rotX: number;
  rotY: number;
  targetX: number;
  targetY: number;
  velX: number;
  velY: number;
};

const PROXIMITY_RADIUS = 340;
const MAX_TILT = 5.5;
const SPRING = 0.14;
const DAMPING = 0.82;

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

function isPressPanelActive(): boolean {
  const panel = document.querySelector<HTMLElement>('[data-tab-panel="press"]');
  if (!panel) return !!document.querySelector("#press");
  return panel.classList.contains("is-active") && !panel.hidden;
}

function collectTiltTargets(): HTMLElement[] {
  const root = document.querySelector("#press");
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>("[data-press-tilt]"));
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
  if (!cursor.active || reduced || !isPressPanelActive()) {
    collectTiltTargets().forEach((el) => {
      const state = getState(el);
      state.targetX = 0;
      state.targetY = 0;
    });
    return;
  }

  collectTiltTargets().forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    const dx = cursor.x - cx;
    const dy = cursor.y - cy;
    const dist = Math.hypot(dx, dy);
    const strength = proximityStrength(dist, PROXIMITY_RADIUS + Math.max(rect.width, rect.height) * 0.35);

    const state = getState(el);
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
    const lift = Math.min(6, Math.hypot(state.rotX, state.rotY) * 0.45);
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

export function startPressTilt(): void {
  if (running) return;
  running = true;
  lastFrameT = 0;
  document.documentElement.classList.add("press-tilt-live");
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
}

export function stopPressTilt(): void {
  running = false;
  cancelAnimationFrame(rafId);
}

export function resetPressTilt(): void {
  stopPressTilt();
  states.clear();
  cursor.active = false;
  document.documentElement.classList.remove("press-tilt-live");
  collectTiltTargets().forEach((el) => {
    el.style.transform = "";
  });
}

export function initPressTilt(): void {
  if (!document.querySelector("#press [data-press-tilt]")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  bindPointer();
  collectTiltTargets().forEach((el) => getState(el));
  startPressTilt();
}

export function bindPressTiltTabListener(): void {
  if (tabListenerBound) return;
  tabListenerBound = true;

  document.addEventListener("tabular:change", (event) => {
    const tab = (event as CustomEvent<{ tab: string }>).detail?.tab;
    if (tab === "press") {
      if (!running) initPressTilt();
      return;
    }
    collectTiltTargets().forEach((el) => {
      const state = getState(el);
      state.targetX = 0;
      state.targetY = 0;
    });
  });
}
