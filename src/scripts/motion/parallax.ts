import { prefersReducedMotion } from "./utils";
import { updateDepthField } from "./depth-field";

let scrollBound = false;
let ticking = false;
let onScrollHandler: (() => void) | null = null;

const layerState = new WeakMap<HTMLElement, { y: number; scale: number }>();

function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function updateParallax(): void {
  const layers = document.querySelectorAll<HTMLElement>(".parallax-layer, [data-parallax-speed]");

  layers.forEach((el) => {
    if (el.tagName === "IMG") return;
    const speed = parseFloat(el.dataset.parallaxSpeed ?? el.getAttribute("data-parallax-speed") ?? "0.25");
    if (speed <= 0) return;

    const rect = el.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    const targetY = (clamped - 0.5) * 100 * speed;
    const targetScale = 1 + (1 - clamped) * 0.05 * speed;

    const prev = layerState.get(el) ?? { y: targetY, scale: targetScale };
    const y = lerp(prev.y, targetY, 0.12);
    const scale = lerp(prev.scale, targetScale, 0.12);
    layerState.set(el, { y, scale });

    el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
  });

  const heroLayer = document.querySelector<HTMLElement>(".hero-parallax-layer");
  if (heroLayer) {
    const heroSection = heroLayer.closest(".hero-section");
    const heroTop = heroSection?.getBoundingClientRect().top ?? 0;
    const sectionHeight = heroSection?.getBoundingClientRect().height ?? window.innerHeight;
    const scrollProgress = Math.max(0, Math.min(1, -heroTop / sectionHeight));
    const drift = scrollProgress * 48;
    const prev = layerState.get(heroLayer) ?? { y: drift, scale: 1 };
    const y = lerp(prev.y, drift, 0.1);
    layerState.set(heroLayer, { y, scale: 1 });
    heroLayer.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  }

  const heroFrame = document.querySelector<HTMLElement>(".hero-media-frame");
  if (heroFrame) {
    const rect = heroFrame.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    const targetY = (clamped - 0.5) * 36;
    const prev = layerState.get(heroFrame) ?? { y: targetY, scale: 1 };
    const y = lerp(prev.y, targetY, 0.1);
    layerState.set(heroFrame, { y, scale: 1 });
    heroFrame.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  }

  updateDepthField();
  ticking = false;
}

function onScroll(): void {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateParallax);
  }
}

export function initParallax(): void {
  if (scrollBound || prefersReducedMotion()) return;
  scrollBound = true;

  onScrollHandler = onScroll;
  window.addEventListener("scroll", onScrollHandler, { passive: true });
  window.addEventListener("resize", onScrollHandler, { passive: true });
  updateParallax();
  updateDepthField();
}

export function resetParallax(): void {
  if (onScrollHandler) {
    window.removeEventListener("scroll", onScrollHandler);
    window.removeEventListener("resize", onScrollHandler);
    onScrollHandler = null;
  }
  scrollBound = false;
}
