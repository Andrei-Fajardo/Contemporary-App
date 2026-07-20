/** Scale media into view on scroll — GPU-safe transform/opacity only. */

let scaleObserver: IntersectionObserver | null = null;

export function initScaleMedia(): void {
  const targets = document.querySelectorAll<HTMLElement>(".v2-scale-media");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-inview"));
    return;
  }

  if (!scaleObserver) {
    scaleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            scaleObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
  }

  targets.forEach((el) => {
    if (el.classList.contains("is-inview")) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      el.classList.add("is-inview");
      return;
    }
    scaleObserver?.observe(el);
  });
}

export function resetScaleMedia(): void {
  scaleObserver?.disconnect();
  scaleObserver = null;
  document.querySelectorAll(".v2-scale-media.is-inview").forEach((el) => {
    el.classList.remove("is-inview");
  });
}
