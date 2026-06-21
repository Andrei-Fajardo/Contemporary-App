/**
 * Scroll motion — vanilla JS, no dependencies.
 * Must run after layout (including hash anchors like #art).
 */

let scrollBound = false;
let motionObserver: IntersectionObserver | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function revealInView(): void {
  const targets = document.querySelectorAll<HTMLElement>(
    ".parallax-text, .art-parallax-text, .fade-up, .parallax-container, .art-parallax-container"
  );
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (!motionObserver) {
    motionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
  }

  targets.forEach((el) => {
    if (el.classList.contains("is-visible")) return;
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
    if (inView) {
      el.classList.add("is-visible");
    }
    motionObserver!.observe(el);
  });
}

function bindScrollLayers(): void {
  if (scrollBound) return;
  scrollBound = true;

  const layers = document.querySelectorAll<HTMLElement>("[data-parallax-speed]");
  if (!layers.length || prefersReducedMotion()) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    layers.forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed ?? "0.35");
      const rect = el.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const y = (clamped - 0.5) * 120 * speed;
      const scale = 1 + (1 - clamped) * 0.08 * speed;
      el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    });

    const hero = document.querySelector<HTMLElement>(".hero-parallax");
    if (hero) {
      const progress = Math.min(scrollY / Math.max(hero.offsetHeight * 0.7, 1), 1);
      hero.style.opacity = String(Math.max(0.15, 1 - progress * 0.85));
      hero.style.transform = `translate3d(0, ${-scrollY * 0.2}px, 0)`;
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

export function initParallax(): void {
  document.documentElement.classList.add("js-motion");
  revealInView();
  bindScrollLayers();

  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      setTimeout(revealInView, 100);
    }
  }
}

export function bootParallax(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParallax, { once: true });
  } else {
    initParallax();
  }

  window.addEventListener("load", () => {
    setTimeout(initParallax, 50);
  }, { once: true });
}
