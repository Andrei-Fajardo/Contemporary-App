import { activateTab, type TabId } from "./tab-view";

export function restoreLangScroll(): void {
  const savedTab = sessionStorage.getItem("lang-preserve-tab");
  if (savedTab === null) return;

  sessionStorage.removeItem("lang-preserve-tab");
  sessionStorage.removeItem("lang-switching");

  const valid: TabId[] = ["about", "art", "exhibitions", "publications", "research", "press", "contacts"];
  const tab = valid.includes(savedTab as TabId) ? (savedTab as TabId) : "about";

  requestAnimationFrame(() => {
    activateTab(tab, { updateHash: true });

    const overlay = document.getElementById("lang-transition-overlay");
    overlay?.classList.remove("is-active");
    overlay?.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("lang-switching");
    document.body.classList.remove("lang-switching");
  });
}

export function initLangSwitch(): void {
  restoreLangScroll();
}

export function syncLangToggle(): void {
  const seg = window.location.pathname.split("/")[1];
  const langs = ["en", "kr", "kk", "zh", "ru"];
  const active = seg && langs.includes(seg) ? seg : "en";

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const lang = btn.getAttribute("data-lang");
    const isMatch = lang === active;
    btn.classList.toggle("lang-btn--active", isMatch);
    btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
  });
}

export function syncLangHrefs(): void {
  /* Lang controls are buttons — no href syncing */
}
