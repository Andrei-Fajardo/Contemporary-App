/** Legacy hook — petal drift is inline rAF in Hero.astro */

export function initHeroLeaves(): void {
  document.documentElement.classList.add("petals-live");
}

export function pauseHeroLeaves(): void {}

export function resetHeroLeaves(): void {
  document.documentElement.classList.remove("petals-live");
}

export function bindHeroLeavesTabListener(): void {}
