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

function clearSummaryInlineStyles(summary: HTMLElement): void {
  summary.style.removeProperty("background-color");
  summary.style.removeProperty("border-color");
  summary.style.removeProperty("transform");
  summary.style.removeProperty("x");
}

function setOpenState(item: HTMLDetailsElement, summary: HTMLElement, open: boolean): void {
  item.classList.toggle("is-expanded", open);
  summary.setAttribute("aria-expanded", open ? "true" : "false");
  if (!open) clearSummaryInlineStyles(summary);
}

function openPanel(item: HTMLDetailsElement, panel: HTMLElement, summary: HTMLElement, chevron: HTMLElement | null): void {
  animating.add(item);
  item.setAttribute("open", "");
  setOpenState(item, summary, true);

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

  rotateChevron(chevron, true);
}

function closePanel(item: HTMLDetailsElement, panel: HTMLElement, summary: HTMLElement, chevron: HTMLElement | null): void {
  animating.add(item);
  setOpenState(item, summary, false);

  const start = panel.scrollHeight;
  panel.style.overflow = "hidden";
  panel.style.height = `${start}px`;

  animate(panel, { height: 0, opacity: 0 }, {
    duration: CLOSE_MS,
    ease: EASE,
    onComplete: () => {
      item.removeAttribute("open");
      item.classList.remove("is-expanded");
      panel.style.height = "";
      panel.style.opacity = "";
      panel.style.overflow = "";
      clearSummaryInlineStyles(summary);
      animating.delete(item);
    },
  });

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
    clearSummaryInlineStyles(summary);

    if (item.open) {
      item.classList.add("is-expanded");
      panel.style.height = "auto";
      panel.style.opacity = "1";
      summary.setAttribute("aria-expanded", "true");
      rotateChevron(chevron, true);
    } else {
      panel.style.height = "0px";
      panel.style.opacity = "0";
      panel.style.overflow = "hidden";
      summary.setAttribute("aria-expanded", "false");
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
  });
}

export function resetExhibitionAccordion(): void {
  document.querySelectorAll<HTMLElement>(".exhibition-accordion__summary").forEach((el) => {
    delete el.dataset.accordionMotion;
    el.style.removeProperty("background-color");
    el.style.removeProperty("border-color");
    el.style.removeProperty("transform");
    el.style.removeProperty("x");
  });
  document.querySelectorAll<HTMLDetailsElement>(".exhibition-accordion__item").forEach((item) => {
    item.classList.remove("is-expanded");
  });
}
