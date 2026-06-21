/**
 * Scroll motion engine — no dependencies.
 * Mirrors the React useParallax + FadeUpSection patterns from the tutorial,
 * adapted for Astro as vanilla TypeScript.
 */

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fade-up reveal via IntersectionObserver (tutorial FadeUpSection pattern) */
export function initFadeUp(): void {
  const targets = document.querySelectorAll<HTMLElement>(
    ".parallax-text, .art-parallax-text, .fade-up, .parallax-container, .art-parallax-container"
  );
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      el.classList.add("is-visible");
    } else {
      observer.observe(el);
    }
  });
}

/** Scroll-linked translateY (tutorial useParallax hook pattern) */
export function initScrollLayers(): void {
  const layers = document.querySelectorAll<HTMLElement>("[data-parallax-speed]");
  if (!layers.length || prefersReducedMotion()) return;

  let ticking = false;

  const update = () => {
    layers.forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed ?? "0.2");
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const distance = center - viewCenter;
      el.style.transform = `translateY(${distance * speed}px)`;
    });
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

/** Hero dissolves on scroll-out */
export function initHeroParallax(): void {
  const hero = document.querySelector<HTMLElement>(".hero-parallax");
  if (!hero || prefersReducedMotion()) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / (hero.offsetHeight * 0.8), 1);
    hero.style.opacity = String(1 - progress);
    hero.style.transform = `translateY(${-scrollY * 0.25}px)`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

export function initParallax(): void {
  initFadeUp();
  initScrollLayers();
  initHeroParallax();
}
