/** Smooth petal drift via requestAnimationFrame — hero + site-wide layers, cursor-reactive */

export type PetalSpec = {
  sel: string;
  ox: number;
  oy: number;
  ax: number;
  ay: number;
  rot: number;
  rs: number;
  sp: number;
  ph: number;
};

export type PetalGroup = {
  rootSelector: string;
  petals: PetalSpec[];
  isActive?: () => boolean;
};

type PetalPhysics = {
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  rot: number;
  rotV: number;
};

const GLOBAL_PETALS: PetalSpec[] = [
  { sel: ".floating-petal--1", ox: 0.06, oy: 0.08, ax: 100, ay: 65, rot: -15, rs: 12, sp: 0.4, ph: 0 },
  { sel: ".floating-petal--2", ox: 0.88, oy: 0.12, ax: 80, ay: 55, rot: 22, rs: 14, sp: 0.45, ph: 1.2 },
  { sel: ".floating-petal--3", ox: 0.15, oy: 0.35, ax: 90, ay: 70, rot: -30, rs: 11, sp: 0.38, ph: 2.5 },
  { sel: ".floating-petal--4", ox: 0.75, oy: 0.28, ax: 75, ay: 60, rot: 18, rs: 13, sp: 0.42, ph: 0.8 },
  { sel: ".floating-petal--5", ox: 0.45, oy: 0.18, ax: 65, ay: 50, rot: -8, rs: 9, sp: 0.5, ph: 3.1 },
  { sel: ".floating-petal--6", ox: 0.92, oy: 0.55, ax: 85, ay: 75, rot: 28, rs: 15, sp: 0.36, ph: 1.9 },
  { sel: ".floating-petal--7", ox: 0.08, oy: 0.72, ax: 95, ay: 60, rot: -22, rs: 10, sp: 0.44, ph: 4.0 },
  { sel: ".floating-petal--8", ox: 0.62, oy: 0.68, ax: 70, ay: 55, rot: 12, rs: 12, sp: 0.48, ph: 2.2 },
  { sel: ".floating-petal--9", ox: 0.38, oy: 0.82, ax: 60, ay: 45, rot: -35, rs: 16, sp: 0.33, ph: 3.8 },
  { sel: ".floating-petal--10", ox: 0.82, oy: 0.85, ax: 55, ay: 40, rot: 20, rs: 8, sp: 0.52, ph: 5.1 },
];

const HERO_PETALS: PetalSpec[] = [
  { sel: ".chaos-splash--1", ox: 0.04, oy: 0.12, ax: 120, ay: 70, rot: -18, rs: 10, sp: 0.42, ph: 0 },
  { sel: ".chaos-splash--2", ox: 0.08, oy: 0.28, ax: 95, ay: 55, rot: 32, rs: 14, sp: 0.35, ph: 1.4 },
  { sel: ".chaos-splash--3", ox: 0.32, oy: 0.44, ax: 75, ay: 90, rot: -42, rs: 18, sp: 0.55, ph: 2.8 },
  { sel: ".chaos-splash--4", ox: 0.68, oy: 0.05, ax: 85, ay: 60, rot: -12, rs: 12, sp: 0.38, ph: 0.6 },
  { sel: ".chaos-splash--5", ox: 0.82, oy: 0.22, ax: 70, ay: 50, rot: 24, rs: 16, sp: 0.48, ph: 2.1 },
  { sel: ".chaos-splash--6", ox: 0.72, oy: 0.48, ax: 90, ay: 65, rot: -28, rs: 11, sp: 0.33, ph: 3.5 },
  { sel: ".chaos-splash--7", ox: 0.86, oy: 0.62, ax: 55, ay: 45, rot: 18, rs: 9, sp: 0.52, ph: 4.2 },
];

const GENTLE_RADIUS = 130;
const GENTLE_STRENGTH = 52;
const SWIPE_RADIUS = 320;
const SWIPE_VEL_THRESHOLD = 280;
const SWIPE_STRENGTH = 0.14;
const SWIPE_MAX_SPEED = 3200;
const DAMPING = 0.9;
const SPRING = 0.065;
const MAX_OFFSET = 260;
const ROT_SWIPE_FACTOR = 0.022;
const ROT_DAMPING = 0.86;
const ROT_SPRING = 0.08;

function isHeroVisible(): boolean {
  const hero = document.querySelector(".hero-chaos");
  if (!hero) return false;
  const panel = hero.closest("[data-tab-panel]");
  if (!panel) return true;
  return panel.classList.contains("is-active") && !panel.hidden;
}

const GROUPS: PetalGroup[] = [
  { rootSelector: ".floating-petals", petals: GLOBAL_PETALS },
  {
    rootSelector: ".hero-chaos",
    petals: HERO_PETALS,
    isActive: isHeroVisible,
  },
];

const physics = new Map<HTMLElement, PetalPhysics>();
const cursor = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
const lastMove = { x: 0, y: 0, t: 0 };

let rafId = 0;
let running = false;
let tabListenerBound = false;
let pointerListenerBound = false;
let lastFrameT = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hypot(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function getPhysics(el: HTMLElement): PetalPhysics {
  let state = physics.get(el);
  if (!state) {
    state = { ox: 0, oy: 0, vx: 0, vy: 0, rot: 0, rotV: 0 };
    physics.set(el, state);
  }
  return state;
}

function clearPhysics(): void {
  physics.clear();
}

function prepPetalElements(): void {
  document.querySelectorAll(".chaos-splash, .floating-petal").forEach((el) => {
    (el as HTMLElement).style.animation = "none";
    (el as HTMLElement).dataset.drift = "true";
  });
}

function applyCursorForces(
  state: PetalPhysics,
  centerX: number,
  centerY: number,
  dt: number,
  react: number,
): void {
  if (!cursor.active || react <= 0) return;

  const dx = centerX - cursor.x;
  const dy = centerY - cursor.y;
  const dist = hypot(dx, dy);
  if (dist < 1) return;

  const nx = dx / dist;
  const ny = dy / dist;

  if (dist < GENTLE_RADIUS) {
    const proximity = 1 - dist / GENTLE_RADIUS;
    const gentle = GENTLE_STRENGTH * proximity * proximity * react;
    state.vx += nx * gentle * dt;
    state.vy += ny * gentle * dt;
  }

  const speed = hypot(cursor.vx, cursor.vy);
  if (speed > SWIPE_VEL_THRESHOLD && dist < SWIPE_RADIUS) {
    const proximity = 1 - dist / SWIPE_RADIUS;
    const capped = Math.min(speed, SWIPE_MAX_SPEED);
    const swipe = capped * SWIPE_STRENGTH * proximity * proximity * react;
    const invSpeed = 1 / speed;
    state.vx += cursor.vx * invSpeed * swipe * dt;
    state.vy += cursor.vy * invSpeed * swipe * dt;
    const rotImpulse = (cursor.vx * ny - cursor.vy * nx) * ROT_SWIPE_FACTOR * proximity * proximity * react;
    state.rotV += rotImpulse * dt * 60;
  }
}

function integratePhysics(state: PetalPhysics, dt: number): void {
  const damp = Math.pow(DAMPING, dt * 60);
  state.vx *= damp;
  state.vy *= damp;
  state.vx += -state.ox * SPRING * dt * 60;
  state.vy += -state.oy * SPRING * dt * 60;
  state.ox += state.vx * dt;
  state.oy += state.vy * dt;
  state.ox = clamp(state.ox, -MAX_OFFSET, MAX_OFFSET);
  state.oy = clamp(state.oy, -MAX_OFFSET, MAX_OFFSET);

  const rotDamp = Math.pow(ROT_DAMPING, dt * 60);
  state.rotV *= rotDamp;
  state.rotV += -state.rot * ROT_SPRING * dt * 60;
  state.rot += state.rotV * dt;
  state.rot = clamp(state.rot, -45, 45);
}

function decayCursorVelocity(now: number): void {
  const idle = (now - lastMove.t) / 1000;
  if (idle > 0.04) {
    const decay = Math.pow(0.82, idle * 60);
    cursor.vx *= decay;
    cursor.vy *= decay;
  }
}

function tick(now: number): void {
  if (!running) return;

  const dt = lastFrameT ? clamp((now - lastFrameT) / 1000, 0.001, 0.05) : 1 / 60;
  lastFrameT = now;

  const t = now / 1000;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slow = reduced ? 0.35 : 1;
  const react = reduced ? 0.3 : 1;

  decayCursorVelocity(now);

  GROUPS.forEach((group) => {
    if (group.isActive && !group.isActive()) return;

    const root = document.querySelector<HTMLElement>(group.rootSelector);
    if (!root) return;

    const rootRect = root.getBoundingClientRect();
    const w = root.clientWidth || window.innerWidth;
    const h = root.clientHeight || window.innerHeight;

    group.petals.forEach((p) => {
      const el = root.querySelector<HTMLElement>(p.sel);
      if (!el) return;

      const phase = t * p.sp * slow + p.ph;
      const baseX = p.ox * w + Math.sin(phase) * p.ax * slow;
      const baseY = p.oy * h + Math.cos(phase * 0.85 + p.ph) * p.ay * slow;

      const state = getPhysics(el);
      const centerX = rootRect.left + baseX + el.offsetWidth * 0.5;
      const centerY = rootRect.top + baseY + el.offsetHeight * 0.5;
      applyCursorForces(state, centerX, centerY, dt, react);
      integratePhysics(state, dt);

      const x = baseX + state.ox;
      const y = baseY + state.oy;
      const rot = p.rot + Math.sin(phase * 1.1) * p.rs * slow + state.rot;
      const scale = 1 + Math.sin(phase * 0.7) * 0.06 * slow;
      el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${scale})`;
    });
  });

  rafId = requestAnimationFrame(tick);
}

function onPointerMove(event: PointerEvent): void {
  const now = performance.now();

  if (!lastMove.t) {
    lastMove.x = event.clientX;
    lastMove.y = event.clientY;
    lastMove.t = now;
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    cursor.active = true;
    return;
  }

  const dt = Math.max(0.001, (now - lastMove.t) / 1000);
  const rawVx = (event.clientX - lastMove.x) / dt;
  const rawVy = (event.clientY - lastMove.y) / dt;

  cursor.vx = cursor.vx * 0.45 + rawVx * 0.55;
  cursor.vy = cursor.vy * 0.45 + rawVy * 0.55;
  cursor.x = event.clientX;
  cursor.y = event.clientY;
  cursor.active = true;

  lastMove.x = event.clientX;
  lastMove.y = event.clientY;
  lastMove.t = now;
}

function onPointerEnd(): void {
  cursor.active = false;
}

export function bindPetalPointerListener(): void {
  if (pointerListenerBound) return;
  pointerListenerBound = true;

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerEnd, { passive: true });
  window.addEventListener("pointercancel", onPointerEnd, { passive: true });
  window.addEventListener("blur", onPointerEnd);
  document.documentElement.addEventListener("mouseleave", onPointerEnd);
}

export function startPetalDrift(): void {
  if (running) return;
  running = true;
  lastFrameT = 0;
  document.documentElement.classList.add("petals-live");
  prepPetalElements();
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
}

export function stopPetalDrift(): void {
  running = false;
  cancelAnimationFrame(rafId);
}

export function resetPetalDrift(): void {
  stopPetalDrift();
  clearPhysics();
  cursor.active = false;
  cursor.vx = 0;
  cursor.vy = 0;
  lastMove.t = 0;
  document.documentElement.classList.remove("petals-live");
}

export function initPetalDrift(): void {
  const hasPetals =
    document.querySelector(".floating-petals") || document.querySelector(".hero-chaos .chaos-splash");
  if (!hasPetals) return;

  bindPetalPointerListener();
  prepPetalElements();
  startPetalDrift();
}

export function bindPetalDriftTabListener(): void {
  if (tabListenerBound) return;
  tabListenerBound = true;

  document.addEventListener("tabular:change", () => {
    if (!running) initPetalDrift();
  });
}
