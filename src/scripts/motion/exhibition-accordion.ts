import { animate } from "motion";

export function initExhibitionAccordion(): void {
  document.querySelectorAll<HTMLElement>(".exhibition-accordion__item").forEach((item) => {
    const summary = item.querySelector<HTMLElement>(".exhibition-accordion__summary");
    const chevron = item.querySelector<HTMLElement>(".exhibition-accordion__chevron");
    if (!summary || summary.dataset.accordionMotion === "true") return;
    summary.dataset.accordionMotion = "true";

    const setOpenStyles = (open: boolean) => {
      animate(
        summary,
        {
          backgroundColor: open ? "rgba(17, 17, 17, 0.06)" : "rgba(17, 17, 17, 0)",
          borderColor: open ? "rgba(17, 17, 17, 0.18)" : "rgba(17, 17, 17, 0)",
          x: open ? 4 : 0,
        },
        { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      );
      if (chevron) {
        animate(chevron, { scale: open ? 1.15 : 1 }, { duration: 0.35, ease: [0.16, 1, 0.3, 1] });
      }
    };

    summary.addEventListener("mouseenter", () => {
      if (item.hasAttribute("open")) return;
      animate(
        summary,
        {
          backgroundColor: "rgba(17, 17, 17, 0.055)",
          borderColor: "rgba(17, 17, 17, 0.14)",
          x: 6,
        },
        { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      );
      if (chevron) {
        animate(chevron, { x: 3, scale: 1.1 }, { duration: 0.35, ease: [0.16, 1, 0.3, 1] });
      }
    });

    summary.addEventListener("mouseleave", () => {
      if (item.hasAttribute("open")) {
        setOpenStyles(true);
        return;
      }
      animate(
        summary,
        {
          backgroundColor: "rgba(17, 17, 17, 0)",
          borderColor: "rgba(17, 17, 17, 0)",
          x: 0,
        },
        { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      );
      if (chevron) {
        animate(chevron, { x: 0, scale: 1 }, { duration: 0.35, ease: [0.16, 1, 0.3, 1] });
      }
    });

    item.addEventListener("toggle", () => setOpenStyles(item.open));

    if (item.open) setOpenStyles(true);
  });
}

export function resetExhibitionAccordion(): void {
  document.querySelectorAll<HTMLElement>(".exhibition-accordion__summary").forEach((el) => {
    delete el.dataset.accordionMotion;
  });
}
