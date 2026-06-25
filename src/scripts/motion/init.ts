import { initLazyMedia } from "./lazy-media";
import { initParallax, resetParallax } from "./parallax";
import { initScrollReveal } from "./scroll-reveal";
import { initScrollVelocity, resetScrollVelocity } from "./scroll-velocity";
import { initAnchorNav, initScrollSpy, resetScrollSpy } from "./scroll-spy";
import { initDepthField, resetDepthField, updateDepthField } from "./depth-field";
import { initExhibitionCarousels, resetExhibitionCarousels } from "./exhibition-carousel";
import { initExhibitionAccordion, resetExhibitionAccordion } from "./exhibition-accordion";
import { initNavHover, resetNavHover } from "./nav-hover";
import { initGlobalLightbox, resetGlobalLightbox } from "../lightbox";
import { initCursorTilt, resetCursorTilt, bindCursorTiltTabListener } from "./cursor-tilt";
import { initArtViewToggle, resetArtViewToggle } from "../art-view-toggle";
import { initExhibitionFilter, resetExhibitionFilter } from "../exhibition-filter";
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
  resetExhibitionCarousels();
  resetExhibitionAccordion();
  resetNavHover();
  resetGlobalLightbox();
  resetCursorTilt();
  resetArtViewToggle();
  resetExhibitionFilter();

  if (prefersReducedMotion() || document.body.dataset.layout === "tabular") {
    document.documentElement.classList.add("motion-reduced");
    document.documentElement.classList.remove("motion-live");
    revealAllFallback();
  } else {
    document.documentElement.classList.add("motion-live");
    document.documentElement.classList.remove("motion-reduced");

    initScrollReveal();
    initLazyMedia();
    initDepthField();
    initParallax();
    initScrollVelocity();
    updateDepthField();
  }

  const isTabular = document.body.dataset.layout === "tabular";

  if (!isTabular) {
    initScrollSpy();
    initAnchorNav();
  }
  initExhibitionCarousels();
  initExhibitionAccordion();
  initNavHover();
  initGlobalLightbox();
  bindCursorTiltTabListener();
  initCursorTilt();
  initArtViewToggle();
  initExhibitionFilter();
}
