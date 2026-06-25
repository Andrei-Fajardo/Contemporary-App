import { prefersReducedMotion } from "./utils";

let bound = false;
let parallaxBound = false;
let rafId = 0;

function markHeroReady(): void {
  const hero = document.querySelector<HTMLElement>("[data-hero-section]");
  if (!hero || hero.classList.contains("is-hero-ready")) return;

  requestAnimationFrame(() => {
    hero.classList.add("is-hero-ready");
    hero.querySelectorAll<HTMLElement>(".scroll-reveal").forEach((el, index) => {
      el.style.setProperty("--reveal-delay", `${Math.min(index, 10) * 70}ms`);
      el.classList.add("is-visible");
    });
  });
}

function bindHeroParallax(): void {
  if (parallaxBound || prefersReducedMotion()) return;
  const frame = document.querySelector<HTMLElement>("[data-hero-visual]");
  if (!frame) return;
  parallaxBound = true;

  const onMove = (event: PointerEvent) => {
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = frame.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateY = x * 5;
      const rotateX = -y * 4;
      const translateY = y * -6;

      frame.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, ${translateY.toFixed(2)}px, 0)`;
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(rafId);
    frame.style.transform = "";
  };

  frame.addEventListener("pointermove", onMove);
  frame.addEventListener("pointerleave", onLeave);
}

export function initHeroMotion(): void {
  if (bound) {
    markHeroReady();
    return;
  }
  bound = true;

  markHeroReady();
  bindHeroParallax();

  document.addEventListener("tabular:change", (event) => {
    const tab = (event as CustomEvent<{ tab: string }>).detail?.tab;
    if (tab === "about") markHeroReady();
  });
}

export function resetHeroMotion(): void {
  bound = false;
  parallaxBound = false;
}
