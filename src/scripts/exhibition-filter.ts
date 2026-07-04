import { animate } from "motion";
import { loadLazyMediaIn } from "./motion/lazy-media";
import { resetExhibitionAccordion } from "./motion/exhibition-accordion";

const EASE = [0.16, 1, 0.3, 1] as const;
const DEFAULT_CATEGORY = "physical";

function closeExpandedItems(root: HTMLElement): void {
  root.querySelectorAll<HTMLDetailsElement>(".exhibition-accordion__item[open]").forEach((item) => {
    item.removeAttribute("open");
    item.classList.remove("is-expanded");
    const panel = item.querySelector<HTMLElement>(".exhibition-accordion__panel");
    const summary = item.querySelector<HTMLElement>(".exhibition-accordion__summary");
    if (panel) {
      panel.style.height = "0px";
      panel.style.opacity = "0";
      panel.style.overflow = "hidden";
    }
    summary?.setAttribute("aria-expanded", "false");
  });
}

function applyFilter(root: HTMLElement, category: string, animateIn: boolean): void {
  const items = root.querySelectorAll<HTMLElement>(".exhibition-accordion__item");

  closeExpandedItems(root);

  items.forEach((item) => {
    const match = item.dataset.category === category;
    item.classList.toggle("is-filtered-out", !match);

    if (match && animateIn) {
      item.style.opacity = "0";
      item.style.transform = "translateY(10px)";
      animate(
        item,
        { opacity: [0, 1], y: [10, 0] },
        { duration: 0.42, ease: EASE },
      ).then(() => {
        item.style.opacity = "";
        item.style.transform = "";
      });
    }
  });

  loadLazyMediaIn(root);
}

export function initExhibitionFilter(): void {
  const root = document.querySelector<HTMLElement>("[data-exhibition-filter-root]");
  if (!root || root.dataset.filterBound === "true") return;
  root.dataset.filterBound = "true";

  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-exhibition-filter]");

  const activate = (category: string, animateIn = true) => {
    buttons.forEach((btn) => {
      const on = btn.dataset.exhibitionFilter === category;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    applyFilter(root, category, animateIn);
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.exhibitionFilter;
      if (!category || btn.classList.contains("is-active")) return;
      activate(category);
    });
  });

  activate(DEFAULT_CATEGORY, false);
}

export function resetExhibitionFilter(): void {
  document.querySelectorAll<HTMLElement>("[data-exhibition-filter-root]").forEach((el) => {
    delete el.dataset.filterBound;
  });
}

document.addEventListener("tabular:change", (event) => {
  const tab = (event as CustomEvent<{ tab: string }>).detail?.tab;
  if (tab !== "exhibitions") return;
  resetExhibitionAccordion();
  resetExhibitionFilter();
  initExhibitionFilter();
});
