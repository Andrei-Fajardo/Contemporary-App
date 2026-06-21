let lazyObserver: IntersectionObserver | null = null;

function loadImage(img: HTMLImageElement): void {
  const src = img.dataset.src;
  if (!src || img.src === src) return;

  img.src = src;
  img.removeAttribute("data-src");

  const onLoad = () => {
    img.closest(".lazy-media")?.classList.add("is-loaded");
    img.removeEventListener("load", onLoad);
  };

  img.addEventListener("load", onLoad);
  if (img.complete) onLoad();
}

export function initLazyMedia(): void {
  const images = document.querySelectorAll<HTMLImageElement>(".lazy-media img[data-src]");
  if (!images.length) return;

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
            lazyObserver?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "240px 0px", threshold: 0.01 }
    );
  }

  images.forEach((img) => {
    if (!img.dataset.src) return;
    lazyObserver?.observe(img);
  });
}
