import { updateDepthField } from "./depth-field";

let lazyObserver: IntersectionObserver | null = null;

export function loadImage(img: HTMLImageElement): void {
  const src = img.dataset.src;
  if (!src || img.src === src) return;

  img.src = src;
  img.removeAttribute("data-src");

  const onLoad = () => {
    const wrap = img.closest(".lazy-media");
    wrap?.classList.add("is-loaded");
    img.removeEventListener("load", onLoad);
    img.removeEventListener("error", onError);
    updateDepthField();
  };

  const onError = () => {
    img.removeEventListener("load", onLoad);
    img.removeEventListener("error", onError);
    img.closest(".lazy-media")?.classList.add("is-loaded", "is-error");
  };

  img.addEventListener("load", onLoad);
  img.addEventListener("error", onError);
  if (img.complete) onLoad();
}

/** Load images already visible or near the top of the viewport immediately. */
export function loadVisibleLazyMedia(root: ParentNode = document): void {
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  root.querySelectorAll<HTMLImageElement>(".lazy-media img[data-src]").forEach((img) => {
    const rect = img.getBoundingClientRect();
    if (rect.top < vh * 1.05 && rect.bottom > -vh * 0.1) {
      loadImage(img);
    }
  });
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

  loadVisibleLazyMedia();
}

/** Eagerly load lazy images inside a tab panel or other hidden container. */
export function loadLazyMediaIn(root: ParentNode = document): void {
  root.querySelectorAll<HTMLImageElement>(".lazy-media img[data-src]").forEach(loadImage);
  loadVisibleLazyMedia(root);
}
