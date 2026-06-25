export function initExhibitionFilter(): void {
  const root = document.querySelector<HTMLElement>("[data-exhibition-filter-root]");
  if (!root || root.dataset.filterBound === "true") return;
  root.dataset.filterBound = "true";

  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-exhibition-filter]");
  const items = root.querySelectorAll<HTMLElement>(".exhibition-accordion__item");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.exhibitionFilter ?? "all";

      buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
      items.forEach((item) => {
        const match =
          category === "all" || item.dataset.category === category;
        item.classList.toggle("is-filtered-out", !match);
      });
    });
  });
}

export function resetExhibitionFilter(): void {
  document.querySelectorAll<HTMLElement>("[data-exhibition-filter-root]").forEach((el) => {
    delete el.dataset.filterBound;
  });
}
