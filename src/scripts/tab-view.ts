/**
 * Tabular view — instant section switching via left sidebar.
 * No scroll-spy, no page transitions between panels.
 */

import { loadLazyMediaIn } from "./motion/lazy-media";

const VALID_TABS = [
  "about",
  "art",
  "exhibitions",
  "publications",
  "research",
  "press",
  "contacts",
] as const;

export type TabId = (typeof VALID_TABS)[number];

let bound = false;

function isValidTab(id: string): id is TabId {
  return (VALID_TABS as readonly string[]).includes(id);
}

function setActiveNav(tab: TabId): void {
  document.querySelectorAll<HTMLElement>("[data-nav-key]").forEach((link) => {
    const on = link.dataset.navKey === tab;
    link.classList.toggle("nav-link--active", on);
    link.setAttribute("aria-current", on ? "true" : "false");
  });
}

function closeMobileDrawer(): void {
  const drawer = document.getElementById("mobile-drawer");
  const btn = document.getElementById("hamburger-btn");
  if (drawer && !drawer.classList.contains("translate-x-full") && btn) {
    btn.click();
  }
}

export function activateTab(tab: TabId, options: { updateHash?: boolean } = {}): void {
  const root = document.querySelector<HTMLElement>("[data-tabular-view]");
  if (!root) return;

  const panels = root.querySelectorAll<HTMLElement>("[data-tab-panel]");
  const incoming = root.querySelector<HTMLElement>(`[data-tab-panel="${tab}"]`);
  const outgoing = root.querySelector<HTMLElement>("[data-tab-panel].is-active");

  // Same panel — skip
  if (outgoing === incoming) return;

  setActiveNav(tab);

  if (options.updateHash !== false) {
    const base = window.location.pathname + window.location.search;
    history.replaceState(null, "", `${base}#${tab}`);
  }

  const FADE_MS = 160;

  const doSwap = () => {
    panels.forEach((panel) => {
      const on = panel.dataset.tabPanel === tab;
      panel.classList.toggle("is-active", on);
      panel.hidden = !on;
      panel.setAttribute("aria-hidden", on ? "false" : "true");
    });

    const main = document.querySelector<HTMLElement>(".tabular-main");
    if (main) main.scrollTo({ top: 0, behavior: "instant" });
    window.scrollTo({ top: 0, behavior: "instant" });

    if (incoming) {
      incoming.style.opacity = "0";
      incoming.style.transform = "translateY(10px)";
      loadLazyMediaIn(incoming);
      // Force reflow then animate in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          incoming.style.transition = `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`;
          incoming.style.opacity = "1";
          incoming.style.transform = "translateY(0)";
        });
      });
    }

    document.dispatchEvent(new CustomEvent("tabular:change", { detail: { tab } }));
  };

  if (outgoing) {
    outgoing.style.transition = `opacity ${FADE_MS}ms ease`;
    outgoing.style.opacity = "0";
    setTimeout(doSwap, FADE_MS);
  } else {
    doSwap();
  }
}

export function initTabView(): void {
  if (bound || !document.querySelector("[data-tabular-view]")) return;
  bound = true;

  document.querySelectorAll<HTMLAnchorElement>("[data-nav-key]").forEach((link) => {
    if (link.dataset.tabBound === "true") return;
    link.dataset.tabBound = "true";

    link.addEventListener("click", (event) => {
      const tab = link.dataset.navKey;
      if (!tab || !isValidTab(tab)) return;

      event.preventDefault();
      activateTab(tab);
      closeMobileDrawer();
    });
  });

  const hash = window.location.hash.replace("#", "");
  activateTab(isValidTab(hash) ? hash : "about", { updateHash: isValidTab(hash) });

  window.addEventListener("hashchange", () => {
    const next = window.location.hash.replace("#", "");
    if (isValidTab(next)) activateTab(next, { updateHash: false });
  });
}

export function resetTabView(): void {
  document.querySelectorAll<HTMLElement>("[data-tab-bound]").forEach((el) => {
    delete el.dataset.tabBound;
  });
  bound = false;
}
