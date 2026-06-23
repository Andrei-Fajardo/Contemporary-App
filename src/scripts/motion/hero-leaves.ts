import { animate, type AnimationPlaybackControls } from "motion";
import { prefersReducedMotion } from "./utils";

const controllers = new WeakMap<HTMLElement, AnimationPlaybackControls>();

const LEAF_CONFIGS = [
  {
    className: "chaos-splash--1",
    keyframes: [
      { x: 0, y: 0, rotate: -18, scale: 1 },
      { x: -90, y: 55, rotate: -34, scale: 1.06 },
      { x: -160, y: 20, rotate: -10, scale: 0.95 },
      { x: -70, y: -45, rotate: -26, scale: 1.03 },
      { x: 0, y: 0, rotate: -18, scale: 1 },
    ],
    duration: 14,
  },
  {
    className: "chaos-splash--2",
    keyframes: [
      { x: 0, y: 0, rotate: 32, scale: 1 },
      { x: 110, y: -40, rotate: 18, scale: 1.08 },
      { x: 180, y: 35, rotate: 44, scale: 0.92 },
      { x: 60, y: 70, rotate: 24, scale: 1.04 },
      { x: 0, y: 0, rotate: 32, scale: 1 },
    ],
    duration: 18,
  },
  {
    className: "chaos-splash--3",
    keyframes: [
      { x: 0, y: 0, rotate: -42, scale: 1 },
      { x: -50, y: 75, rotate: -28, scale: 1.14 },
      { x: 95, y: 110, rotate: -58, scale: 0.88 },
      { x: 35, y: 30, rotate: -36, scale: 1.06 },
      { x: 0, y: 0, rotate: -42, scale: 1 },
    ],
    duration: 11,
  },
] as const;

function isHeroVisible(hero: HTMLElement): boolean {
  const panel = hero.closest<HTMLElement>("[data-tab-panel]");
  if (panel) return !panel.hidden && panel.classList.contains("is-active");
  return hero.getBoundingClientRect().width > 0;
}

export function initHeroLeaves(): void {
  if (prefersReducedMotion()) return;

  const hero = document.querySelector<HTMLElement>(".hero-chaos");
  if (!hero || !isHeroVisible(hero)) return;

  LEAF_CONFIGS.forEach((cfg) => {
    const el = hero.querySelector<HTMLElement>(`.${cfg.className}`);
    if (!el) return;

    const existing = controllers.get(el);
    if (existing) {
      existing.play();
      return;
    }

    el.style.animation = "none";
    el.dataset.leafDrift = "true";

    const controls = animate(el, [...cfg.keyframes], {
      duration: cfg.duration,
      ease: "easeInOut",
      repeat: Infinity,
    });

    controllers.set(el, controls);
  });
}

export function pauseHeroLeaves(): void {
  controllers.forEach((ctrl) => ctrl.pause());
}

export function resetHeroLeaves(): void {
  document.querySelectorAll<HTMLElement>(".hero-chaos .chaos-splash").forEach((el) => {
    delete el.dataset.leafDrift;
    el.style.animation = "";
    controllers.get(el)?.stop();
    controllers.delete(el);
  });
}

export function bindHeroLeavesTabListener(): void {
  if (document.documentElement.dataset.heroLeavesTab === "true") return;
  document.documentElement.dataset.heroLeavesTab = "true";

  document.addEventListener("tabular:change", (e) => {
    const tab = (e as CustomEvent<{ tab: string }>).detail?.tab;
    if (tab === "about") {
      requestAnimationFrame(() => initHeroLeaves());
    } else {
      pauseHeroLeaves();
    }
  });
}
