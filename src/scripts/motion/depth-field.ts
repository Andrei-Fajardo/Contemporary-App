import { isMobileViewport, prefersReducedMotion } from "./utils";

let depthBound = false;
let depthTicking = false;
let depthScrollHandler: (() => void) | null = null;

function applyDepth(el: HTMLElement, focus: number): void {
  const f = Math.max(0, Math.min(1, focus));
  el.style.setProperty("--depth-focus", f.toFixed(3));
  el.classList.toggle("is-focused", f >= 0.72);

  if (el.classList.contains("art-piece")) {
    el.style.opacity = String(0.32 + f * 0.68);
  }

  el.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    const wrap = img.closest(".lazy-media");
    const isReady = !wrap || wrap.classList.contains("is-loaded") || !img.dataset.src;
    if (!isReady) return;

    const blurMax = isMobileViewport() ? 8 : 16;
    const blurPx = (1 - f) * blurMax;
    img.style.opacity = String(0.38 + f * 0.62);
    const blur = blurPx > 0.35 ? `blur(${blurPx}px)` : "none";
    img.style.filter = blur;
    img.style.setProperty("-webkit-filter", blur);
  });
}

/** Distance from viewport center → focus (0 far, 1 centered). Applies inline styles for cross-browser reliability. */
export function updateDepthField(): void {
  if (prefersReducedMotion()) return;

  const viewportCenter = window.innerHeight * 0.5;
  const focusRadius = window.innerHeight * (isMobileViewport() ? 0.5 : 0.32);

  document.querySelectorAll<HTMLElement>(".depth-target").forEach((el) => {
    const rect = el.getBoundingClientRect();

    if (rect.bottom < -40 || rect.top > window.innerHeight + 40) {
      applyDepth(el, 0);
      return;
    }

    const elementCenter = rect.top + rect.height * 0.5;
    const distance = Math.abs(elementCenter - viewportCenter);
    const focus = Math.max(0, 1 - distance / focusRadius);
    applyDepth(el, focus);
  });
}

function onDepthScroll(): void {
  if (!depthTicking) {
    depthTicking = true;
    requestAnimationFrame(() => {
      updateDepthField();
      depthTicking = false;
    });
  }
}

export function initDepthField(): void {
  if (depthBound || prefersReducedMotion()) return;
  depthBound = true;

  depthScrollHandler = onDepthScroll;
  window.addEventListener("scroll", depthScrollHandler, { passive: true });
  window.addEventListener("resize", depthScrollHandler, { passive: true });
  updateDepthField();
}

export function resetDepthField(): void {
  if (depthScrollHandler) {
    window.removeEventListener("scroll", depthScrollHandler);
    window.removeEventListener("resize", depthScrollHandler);
    depthScrollHandler = null;
  }
  depthBound = false;
}
