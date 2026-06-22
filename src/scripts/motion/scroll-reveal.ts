let revealObserver: IntersectionObserver | null = null;
let staggerCounter = 0;

function resetStagger(): void {
  staggerCounter = 0;
}

function applyStaggerDelay(el: HTMLElement): void {
  const group = el.closest(".scroll-reveal-group, .hero-sticky, .section-shell, .editorial-magazine-grid");
  if (!group) return;
  const siblings = group.querySelectorAll<HTMLElement>(".scroll-reveal");
  const index = Array.from(siblings).indexOf(el);
  if (index >= 0) {
    el.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 90}ms`);
  }
}

export function initScrollReveal(): void {
  resetStagger();
  const targets = document.querySelectorAll<HTMLElement>(".scroll-reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            applyStaggerDelay(el);
            el.classList.add("is-visible");
            revealObserver?.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
  }

  targets.forEach((el) => {
    if (el.classList.contains("is-visible")) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
      applyStaggerDelay(el);
      el.classList.add("is-visible");
      return;
    }
    revealObserver?.observe(el);
  });
}
