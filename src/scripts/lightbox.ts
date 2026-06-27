let bound = false;
let keyHandler: ((e: KeyboardEvent) => void) | null = null;
let clickHandler: ((e: Event) => void) | null = null;

const CONTENT_ROOT_SELECTOR =
  ".site-shell, .site-main-column, main, .tabular-main, .hero-section, .exhibition-accordion";

const IMAGE_WRAPPER_SELECTOR = [
  ".lazy-media",
  ".media-card",
  ".exhibition-carousel__slide",
  ".exhibition-gallery-grid__item",
  ".interactive-image-container",
  ".hero-chaos__visual",
  ".cursor-tilt__surface",
  ".press-chaos__tilt",
  ".press-chaos__media",
  ".art-piece",
].join(", ");

const carouselDragBlock = new WeakSet<HTMLElement>();

export function getLightboxImageSrc(img: HTMLImageElement): string {
  return img.currentSrc || img.src || img.dataset.src || "";
}

function isExcluded(img: HTMLImageElement): boolean {
  if (img.closest("#global-lightbox")) return true;
  if (img.closest("#exhibition-gallery-overlay")) return true;
  if (img.closest(".lang-toggle")) return true;
  if (img.closest("button")) return true;
  if (img.closest("summary")) return true;
  if (img.closest(".about-panel-stack__art")) return true;
  if (img.closest(".research-panel__art")) return true;
  if (img.dataset.lightboxIgnore !== undefined) return true;
  if (img.width > 0 && img.width < 24 && img.height < 24) return true;
  const src = getLightboxImageSrc(img);
  if (!src || src.startsWith("data:")) return true;
  return false;
}

function isInContentRoot(el: Element): boolean {
  return Boolean(el.closest(CONTENT_ROOT_SELECTOR));
}

function isCarouselDragBlocked(img: HTMLImageElement): boolean {
  const viewport = img.closest<HTMLElement>(".exhibition-carousel__viewport");
  return viewport ? carouselDragBlock.has(viewport) : false;
}

/** Skip lightbox when the user just dragged a carousel strip. */
export function blockLightboxForCarouselDrag(viewport: HTMLElement): void {
  carouselDragBlock.add(viewport);
  window.setTimeout(() => carouselDragBlock.delete(viewport), 80);
}

function resolveImageFromEvent(target: EventTarget | null): HTMLImageElement | null {
  if (!(target instanceof Element)) return null;

  if (target instanceof HTMLImageElement) {
    if (isExcluded(target) || !isInContentRoot(target)) return null;
    return target;
  }

  const wrapper = target.closest(IMAGE_WRAPPER_SELECTOR);
  if (wrapper) {
    const img = wrapper.querySelector("img");
    if (img && !isExcluded(img) && isInContentRoot(img)) return img;
  }

  const img = target.closest("img");
  if (img && !isExcluded(img) && isInContentRoot(img)) return img;
  return null;
}

function openFromImage(img: HTMLImageElement, e: Event): void {
  if (isCarouselDragBlocked(img)) return;

  const src = getLightboxImageSrc(img);
  if (!src) return;

  e.preventDefault();
  e.stopPropagation();
  openLightbox(src, img.alt || "");
}

function ensureLightbox(): HTMLElement {
  let root = document.getElementById("global-lightbox");
  if (root) return root;

  root = document.createElement("div");
  root.id = "global-lightbox";
  root.className = "global-lightbox";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <div class="global-lightbox__backdrop" data-lightbox-close></div>
    <div class="global-lightbox__stage" role="dialog" aria-modal="true" aria-label="Image preview">
      <button type="button" class="global-lightbox__close" data-lightbox-close aria-label="Close">×</button>
      <img class="global-lightbox__img" alt="" />
      <p class="global-lightbox__caption"></p>
    </div>
  `;
  document.body.appendChild(root);

  root.querySelectorAll("[data-lightbox-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  return root;
}

export function openLightbox(src: string, alt: string): void {
  const root = ensureLightbox();
  const img = root.querySelector<HTMLImageElement>(".global-lightbox__img");
  const caption = root.querySelector<HTMLElement>(".global-lightbox__caption");
  if (!img) return;

  img.src = src;
  img.alt = alt;
  if (caption) caption.textContent = alt || "";

  root.classList.add("is-open");
  root.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (!keyHandler) {
    keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
  }
  document.addEventListener("keydown", keyHandler);
}

export function closeLightbox(): void {
  const root = document.getElementById("global-lightbox");
  if (!root) return;

  root.classList.remove("is-open");
  root.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  const img = root.querySelector<HTMLImageElement>(".global-lightbox__img");
  if (img) {
    img.removeAttribute("src");
    img.alt = "";
  }

  if (keyHandler) {
    document.removeEventListener("keydown", keyHandler);
  }
}

export function initGlobalLightbox(): void {
  if (bound) return;

  clickHandler = (e) => {
    const img = resolveImageFromEvent(e.target);
    if (!img) return;
    openFromImage(img, e);
  };

  document.addEventListener("click", clickHandler, true);
  bound = true;
}

export function resetGlobalLightbox(): void {
  if (clickHandler) {
    document.removeEventListener("click", clickHandler, true);
    clickHandler = null;
  }
  bound = false;
  closeLightbox();
}

document.addEventListener("astro:page-load", () => {
  resetGlobalLightbox();
  initGlobalLightbox();
});
