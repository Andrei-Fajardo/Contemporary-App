import { animate } from "motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const OPEN_MS = 0.52;
const CLOSE_MS = 0.42;

const animating = new WeakSet<HTMLDetailsElement>();

function getPanel(item: HTMLDetailsElement): HTMLElement | null {
  return item.querySelector<HTMLElement>(".exhibition-accordion__panel");
}

function rotateChevron(chevron: HTMLElement | null, open: boolean): void {
  if (!chevron) return;
  animate(chevron, { rotate: open ? 45 : 0, scale: open ? 1.12 : 1 }, { duration: 0.35, ease: EASE });
}

function setSummaryStyles(summary: HTMLElement, open: boolean): void {
  animate(
    summary,
    {
      backgroundColor: open ? "rgba(17, 17, 17, 0.06)" : "rgba(17, 17, 17, 0)",
      borderColor: open ? "rgba(17, 17, 17, 0.18)" : "rgba(17, 17, 17, 0)",
      x: open ? 4 : 0,
    },
    { duration: 0.4, ease: EASE }
  );
}

function openPanel(item: HTMLDetailsElement, panel: HTMLElement, summary: HTMLElement, chevron: HTMLElement | null): void {
  animating.add(item);
  item.setAttribute("open", "");
  summary.setAttribute("aria-expanded", "true");

  panel.style.overflow = "hidden";
  panel.style.height = "0px";
  panel.style.opacity = "0";

  requestAnimationFrame(() => {
    const target = panel.scrollHeight;
    animate(panel, { height: target, opacity: 1 }, {
      duration: OPEN_MS,
      ease: EASE,
      onComplete: () => {
        panel.style.height = "auto";
        panel.style.overflow = "visible";
        animating.delete(item);
      },
    });
  });

  setSummaryStyles(summary, true);
  rotateChevron(chevron, true);
}

function closePanel(item: HTMLDetailsElement, panel: HTMLElement, summary: HTMLElement, chevron: HTMLElement | null): void {
  animating.add(item);
  summary.setAttribute("aria-expanded", "false");

  const start = panel.scrollHeight;
  panel.style.overflow = "hidden";
  panel.style.height = `${start}px`;

  animate(panel, { height: 0, opacity: 0 }, {
    duration: CLOSE_MS,
    ease: EASE,
    onComplete: () => {
      item.removeAttribute("open");
      panel.style.height = "";
      panel.style.opacity = "";
      panel.style.overflow = "";
      animating.delete(item);
    },
  });

  setSummaryStyles(summary, false);
  rotateChevron(chevron, false);
}

export function initExhibitionAccordion(): void {
  document.querySelectorAll<HTMLDetailsElement>(".exhibition-accordion__item").forEach((item) => {
    const summary = item.querySelector<HTMLElement>(".exhibition-accordion__summary");
    const panel = getPanel(item);
    const chevron = item.querySelector<HTMLElement>(".exhibition-accordion__chevron");
    if (!summary || !panel || summary.dataset.accordionMotion === "true") return;
    summary.dataset.accordionMotion = "true";

    summary.setAttribute("role", "button");
    summary.setAttribute("aria-expanded", item.open ? "true" : "false");

    if (item.open) {
      panel.style.height = "auto";
      panel.style.opacity = "1";
      rotateChevron(chevron, true);
    } else {
      panel.style.height = "0px";
      panel.style.opacity = "0";
      panel.style.overflow = "hidden";
    }

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (animating.has(item)) return;

      if (item.open) {
        closePanel(item, panel, summary, chevron);
      } else {
        openPanel(item, panel, summary, chevron);
      }
    });

    summary.addEventListener("mouseenter", () => {
      if (item.hasAttribute("open")) return;
      animate(
        summary,
        {
          backgroundColor: "rgba(17, 17, 17, 0.055)",
          borderColor: "rgba(17, 17, 17, 0.14)",
          x: 6,
        },
        { duration: 0.35, ease: EASE }
      );
      if (chevron) {
        animate(chevron, { x: 3, scale: 1.1 }, { duration: 0.35, ease: EASE });
      }
    });

    summary.addEventListener("mouseleave", () => {
      if (item.hasAttribute("open")) {
        setSummaryStyles(summary, true);
        return;
      }
      animate(
        summary,
        {
          backgroundColor: "rgba(17, 17, 17, 0)",
          borderColor: "rgba(17, 17, 17, 0)",
          x: 0,
        },
        { duration: 0.35, ease: EASE }
      );
      if (chevron) {
        animate(chevron, { x: 0, scale: 1, rotate: 0 }, { duration: 0.35, ease: EASE });
      }
    });
  });
}

export function resetExhibitionAccordion(): void {
  document.querySelectorAll<HTMLElement>(".exhibition-accordion__summary").forEach((el) => {
    delete el.dataset.accordionMotion;
  });
}
