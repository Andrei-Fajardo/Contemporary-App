import { initLazyMedia } from "./lazy-media";
import { initParallax, resetParallax } from "./parallax";
import { initScrollReveal } from "./scroll-reveal";
import { initScrollVelocity, resetScrollVelocity } from "./scroll-velocity";
import { initAnchorNav, initScrollSpy, resetScrollSpy } from "./scroll-spy";
import { initDepthField, resetDepthField, updateDepthField } from "./depth-field";
import { prefersReducedMotion } from "./utils";

function revealAllFallback(): void {
  document.querySelectorAll(".scroll-reveal").forEach((el) => el.classList.add("is-visible"));
  document.querySelectorAll<HTMLImageElement>(".lazy-media img[data-src]").forEach((img) => {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute("data-src");
      img.closest(".lazy-media")?.classList.add("is-loaded");
    }
  });
}

export function initMotion(): void {
  resetParallax();
  resetScrollVelocity();
  resetScrollSpy();
  resetDepthField();

  if (prefersReducedMotion()) {
    document.documentElement.classList.add("motion-reduced");
    document.documentElement.classList.remove("motion-live");
    revealAllFallback();
    return;
  }

  document.documentElement.classList.add("motion-live");
  document.documentElement.classList.remove("motion-reduced");

  initScrollReveal();
  initLazyMedia();
  initDepthField();
  initParallax();
  initScrollVelocity();
  initScrollSpy();
  initAnchorNav();
  updateDepthField();
}
