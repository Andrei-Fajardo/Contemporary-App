export function initArtViewToggle(): void {
  const section = document.querySelector<HTMLElement>("[data-art-section]");
  if (!section || section.dataset.artToggleBound === "true") return;
  section.dataset.artToggleBound = "true";

  const buttons = section.querySelectorAll<HTMLButtonElement>("[data-art-view]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.artView ?? "separated";
      buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
      section.classList.toggle("art-section--unified", mode === "unified");
      section.classList.toggle("art-section--separated", mode === "separated");
    });
  });
}

export function resetArtViewToggle(): void {
  document.querySelectorAll<HTMLElement>("[data-art-section]").forEach((el) => {
    delete el.dataset.artToggleBound;
  });
}
