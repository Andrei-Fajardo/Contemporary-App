import { isMobileViewport, prefersReducedMotion } from "./utils";

/** Distance from viewport center → --depth-focus (0 far, 1 centered). Game-style depth of field. */
export function updateDepthField(): void {
  if (prefersReducedMotion()) return;

  const viewportCenter = window.innerHeight * 0.5;
  const focusRadius = window.innerHeight * (isMobileViewport() ? 0.55 : 0.38);

  document.querySelectorAll<HTMLElement>(".depth-target").forEach((el) => {
    const rect = el.getBoundingClientRect();

    if (rect.bottom < -80 || rect.top > window.innerHeight + 80) {
      el.style.setProperty("--depth-focus", "0");
      el.classList.remove("is-focused");
      return;
    }

    const elementCenter = rect.top + rect.height * 0.5;
    const distance = Math.abs(elementCenter - viewportCenter);
    const focus = Math.max(0, Math.min(1, 1 - distance / focusRadius));

    el.style.setProperty("--depth-focus", focus.toFixed(3));
    el.classList.toggle("is-focused", focus >= 0.82);
  });
}
