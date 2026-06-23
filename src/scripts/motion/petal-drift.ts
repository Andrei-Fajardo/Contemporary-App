/** Smooth petal drift via requestAnimationFrame — hero + site-wide layers */

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

let rafId = 0;
let running = false;
let tabListenerBound = false;

function prepPetalElements(): void {
  document.querySelectorAll(".chaos-splash, .floating-petal").forEach((el) => {
    (el as HTMLElement).style.animation = "none";
    (el as HTMLElement).dataset.drift = "true";
  });
}

function tick(now: number): void {
  if (!running) return;

  const t = now / 1000;
  const slow = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.35 : 1;

  GROUPS.forEach((group) => {
    if (group.isActive && !group.isActive()) return;

    const root = document.querySelector<HTMLElement>(group.rootSelector);
    if (!root) return;

    const w = root.clientWidth || window.innerWidth;
    const h = root.clientHeight || window.innerHeight;

    group.petals.forEach((p) => {
      const el = root.querySelector<HTMLElement>(p.sel);
      if (!el) return;

      const phase = t * p.sp * slow + p.ph;
      const x = p.ox * w + Math.sin(phase) * p.ax * slow;
      const y = p.oy * h + Math.cos(phase * 0.85 + p.ph) * p.ay * slow;
      const rot = p.rot + Math.sin(phase * 1.1) * p.rs * slow;
      const scale = 1 + Math.sin(phase * 0.7) * 0.06 * slow;
      el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${scale})`;
    });
  });

  rafId = requestAnimationFrame(tick);
}

export function startPetalDrift(): void {
  if (running) return;
  running = true;
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
  document.documentElement.classList.remove("petals-live");
}

export function initPetalDrift(): void {
  const hasPetals =
    document.querySelector(".floating-petals") || document.querySelector(".hero-chaos .chaos-splash");
  if (!hasPetals) return;

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
