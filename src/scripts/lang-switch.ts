export function restoreLangScroll(): void {
  const saved = sessionStorage.getItem("lang-preserve-scroll");
  if (saved === null) return;

  const y = parseInt(saved, 10);
  if (Number.isNaN(y)) {
    sessionStorage.removeItem("lang-preserve-scroll");
    sessionStorage.removeItem("lang-switching");
    return;
  }

  const apply = () => window.scrollTo({ top: y, left: 0, behavior: "instant" });

  apply();
  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(() => {
      apply();
      sessionStorage.removeItem("lang-preserve-scroll");
      sessionStorage.removeItem("lang-switching");
      document.dispatchEvent(new CustomEvent("lang-scroll-restored"));

      const overlay = document.getElementById("lang-transition-overlay");
      overlay?.classList.remove("is-active");
      overlay?.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("lang-switching");
      document.body.classList.remove("lang-switching");
    });
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
