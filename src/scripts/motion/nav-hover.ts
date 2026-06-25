/**
 * Sidebar navigation hover — smooth Motion-driven shifts and label emphasis.
 */
import { animate } from "motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function initNavHover(): void {
  document.querySelectorAll<HTMLElement>(".sidebar-nav-link").forEach((link) => {
    if (link.dataset.navHover === "true") return;
    link.dataset.navHover = "true";

    const label = link.querySelector<HTMLElement>(".sidebar-nav-label");
    const isMobile = Boolean(link.closest("#mobile-drawer"));

    const reset = () => {
      if (link.classList.contains("nav-link--active")) return;
      animate(link, { x: 0 }, { duration: 0.45, ease: EASE });
      if (label) {
        animate(
          label,
          { opacity: isMobile ? 0.55 : 0.72, letterSpacing: "0.01em" },
          { duration: 0.4, ease: EASE }
        );
      }
    };

    link.addEventListener("mouseenter", () => {
      if (link.classList.contains("nav-link--active")) return;
      animate(link, { x: isMobile ? 6 : 10 }, { duration: 0.45, ease: EASE });
      if (label) {
        animate(label, { opacity: 1, letterSpacing: "0.06em" }, { duration: 0.4, ease: EASE });
      }
    });

    link.addEventListener("mouseleave", reset);
    link.addEventListener("focus", () => {
      if (link.classList.contains("nav-link--active")) return;
      animate(link, { x: isMobile ? 4 : 6 }, { duration: 0.35, ease: EASE });
    });
    link.addEventListener("blur", reset);
  });
}

export function resetNavHover(): void {
  document.querySelectorAll<HTMLElement>(".sidebar-nav-link").forEach((el) => {
    delete el.dataset.navHover;
  });
}
