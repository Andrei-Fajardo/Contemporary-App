/** Restart CSS petal animations (e.g. after tab panel becomes visible). */
const SPLASH_ANIM: Record<string, string> = {
  "chaos-splash--1": "leaf-drift-1 14s ease-in-out infinite",
  "chaos-splash--2": "leaf-drift-2 18s ease-in-out infinite",
  "chaos-splash--3": "leaf-drift-3 11s ease-in-out infinite",
};

function animationFor(el: HTMLElement): string {
  for (const cls of Object.keys(SPLASH_ANIM)) {
    if (el.classList.contains(cls)) return SPLASH_ANIM[cls];
  }
  return "";
}

function restartSplash(el: HTMLElement): void {
  const value = animationFor(el);
  if (!value) return;
  el.style.animation = "none";
  void el.offsetHeight;
  el.style.animation = value;
}

export function initHeroLeaves(): void {
  const hero = document.querySelector<HTMLElement>(".hero-chaos");
  if (!hero) return;

  hero.querySelectorAll<HTMLElement>(".chaos-splash").forEach((el) => {
    if (el.dataset.petalsReady === "true") {
      if (el.getAnimations().length === 0) restartSplash(el);
      return;
    }
    el.dataset.petalsReady = "true";
    document.documentElement.classList.add("petals-live");
    restartSplash(el);
  });
}

export function pauseHeroLeaves(): void {
  document.querySelectorAll<HTMLElement>(".hero-chaos .chaos-splash").forEach((el) => {
    el.getAnimations().forEach((a) => a.pause());
  });
}

export function resetHeroLeaves(): void {
  document.querySelectorAll<HTMLElement>(".hero-chaos .chaos-splash").forEach((el) => {
    delete el.dataset.petalsReady;
    el.style.animation = "";
    el.getAnimations().forEach((a) => a.cancel());
  });
  if (!document.querySelector(".hero-chaos .chaos-splash[data-petals-ready]")) {
    document.documentElement.classList.remove("petals-live");
  }
}

export function bindHeroLeavesTabListener(): void {
  if (document.documentElement.dataset.heroLeavesTab === "true") return;
  document.documentElement.dataset.heroLeavesTab = "true";

  document.addEventListener("tabular:change", (e) => {
    const tab = (e as CustomEvent<{ tab: string }>).detail?.tab;
    if (tab === "about") {
      requestAnimationFrame(() => initHeroLeaves());
    } else {
      pauseHeroLeaves();
    }
  });
}
