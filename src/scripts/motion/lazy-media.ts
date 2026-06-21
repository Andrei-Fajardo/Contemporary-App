import { updateDepthField } from "./depth-field";

let lazyObserver: IntersectionObserver | null = null;

function loadImage(img: HTMLImageElement): void {
  const src = img.dataset.src;
  if (!src || img.src === src) return;

  img.src = src;
  img.removeAttribute("data-src");

  const onLoad = () => {
    const wrap = img.closest(".lazy-media");
    wrap?.classList.add("is-loaded");
    img.removeEventListener("load", onLoad);
    updateDepthField();
  };

  img.addEventListener("load", onLoad);
  if (img.complete) onLoad();
}

export function initLazyMedia(): void {
  document.querySelectorAll<HTMLImageElement>(".lazy-media img[src]:not([data-src])").forEach((img) => {
    const wrap = img.closest(".lazy-media");
    wrap?.classList.add("is-loaded", "is-visible");
  });

  const images = document.querySelectorAll<HTMLImageElement>(".lazy-media img[data-src]");
  if (!images.length) {
    updateDepthField();
    return;
  }

  if (!("IntersectionObserver" in window)) {
    images.forEach(loadImage);
    return;
  }

  if (!lazyObserver) {
    lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage(entry.target as HTMLImageElement);
            entry.target.closest(".lazy-media")?.classList.add("is-visible");
            lazyObserver?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "40% 0px", threshold: 0.01 }
    );
  }

  images.forEach((img) => {
    if (!img.dataset.src) return;
    lazyObserver?.observe(img);
  });
}
