const OVERLAY_MS = 1500;
const NAV_DELAY_MS = 380;

const LANG_DISPLAY: Record<string, { code: string; name: string }> = {
  en: { code: "EN", name: "English" },
  kr: { code: "KR", name: "한국어" },
  kk: { code: "KK", name: "Қазақша" },
  zh: { code: "简", name: "中文" },
  ru: { code: "RU", name: "Русский" },
};

let switching = false;
let bound = false;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function currentLangFromPath(): string {
  const seg = window.location.pathname.split("/")[1];
  const langs = ["en", "kr", "kk", "zh", "ru"];
  return seg && langs.includes(seg) ? seg : "en";
}

export function restoreLangScroll(): void {
  const saved = sessionStorage.getItem("lang-preserve-scroll");
  if (saved === null) return;

  const y = parseInt(saved, 10);
  if (Number.isNaN(y)) {
    sessionStorage.removeItem("lang-preserve-scroll");
    return;
  }

  const apply = () => window.scrollTo({ top: y, left: 0, behavior: "instant" });

  apply();
  requestAnimationFrame(() => {
    apply();
    sessionStorage.removeItem("lang-preserve-scroll");
    document.dispatchEvent(new CustomEvent("lang-scroll-restored"));
  });
}

function showOverlay(lang: string): void {
  const overlay = document.getElementById("lang-transition-overlay");
  const display = LANG_DISPLAY[lang] ?? { code: lang.toUpperCase(), name: lang };
  const codeEl = overlay?.querySelector<HTMLElement>("[data-lang-code]");
  const nameEl = overlay?.querySelector<HTMLElement>("[data-lang-name]");

  if (codeEl) codeEl.textContent = display.code;
  if (nameEl) nameEl.textContent = display.name;

  overlay?.classList.add("is-active");
  overlay?.setAttribute("aria-hidden", "false");
  document.body.classList.add("lang-switching");
}

function hideOverlay(): void {
  const overlay = document.getElementById("lang-transition-overlay");
  overlay?.classList.remove("is-active");
  overlay?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lang-switching");
}

async function switchLanguage(href: string, lang: string): Promise<void> {
  if (switching || lang === currentLangFromPath()) return;
  switching = true;

  try {
    sessionStorage.setItem("lang-preserve-scroll", String(window.scrollY));
    showOverlay(lang);

    const overlayDone = sleep(OVERLAY_MS);
    const navDone = (async () => {
      await sleep(NAV_DELAY_MS);
      try {
        const { navigate } = await import("astro:transitions/client");
        await navigate(href);
        restoreLangScroll();
      } catch {
        window.location.assign(href);
      }
    })();

    await Promise.all([overlayDone, navDone]);
    restoreLangScroll();
  } finally {
    hideOverlay();
    switching = false;
  }
}

function bindLangButtons(): void {
  document.querySelectorAll<HTMLAnchorElement>(".lang-btn").forEach((btn) => {
    if (btn.dataset.langBound === "true") return;
    btn.dataset.langBound = "true";

    btn.addEventListener("click", (event) => {
      const lang = btn.dataset.lang;
      if (!lang) return;

      const href = lang === "en" ? "/" : `/${lang}`;
      if (lang === currentLangFromPath()) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      void switchLanguage(href, lang);
    });
  });
}

export function initLangSwitch(): void {
  if (bound) {
    bindLangButtons();
    return;
  }
  bound = true;
  bindLangButtons();
  restoreLangScroll();
}

export function syncLangToggle(): void {
  const active = currentLangFromPath();

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const lang = btn.getAttribute("data-lang");
    const isMatch = lang === active;
    btn.classList.toggle("bg-[#111111]", isMatch);
    btn.classList.toggle("bg-[#111]", isMatch);
    btn.classList.toggle("text-white", isMatch);
    btn.classList.toggle("text-[#555]", !isMatch);
  });
}

export function syncLangHrefs(): void {
  document.querySelectorAll<HTMLAnchorElement>(".lang-btn").forEach((btn) => {
    const lang = btn.getAttribute("data-lang");
    btn.href = lang === "en" ? "/" : `/${lang}`;
  });
}
