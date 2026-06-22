import { prefersReducedMotion } from "./utils";
import { updateDepthField } from "./depth-field";

let scrollBound = false;
let ticking = false;
let onScrollHandler: (() => void) | null = null;

function updateParallax(): void {
  const layers = document.querySelectorAll<HTMLElement>(".parallax-layer, [data-parallax-speed]");

  layers.forEach((el) => {
    if (el.tagName === "IMG") return;
    const speed = parseFloat(el.dataset.parallaxSpeed ?? el.getAttribute("data-parallax-speed") ?? "0.35");
    if (speed <= 0) return;
    const rect = el.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, progress));
    const y = (clamped - 0.5) * 140 * speed;
    const scale = 1 + (1 - clamped) * 0.08 * speed;
    el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
  });

  const heroLayer = document.querySelector<HTMLElement>(".hero-parallax-layer");
  if (heroLayer) {
    const heroSection = heroLayer.closest(".hero-section");
    const heroTop = heroSection?.getBoundingClientRect().top ?? 0;
    const drift = Math.max(0, -heroTop) * 0.18;
    heroLayer.style.transform = `translate3d(0, ${drift}px, 0)`;
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
