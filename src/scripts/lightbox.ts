let bound = false;
let keyHandler: ((e: KeyboardEvent) => void) | null = null;
let clickHandler: ((e: Event) => void) | null = null;

function getImageSrc(img: HTMLImageElement): string {
  return img.currentSrc || img.src || img.dataset.src || "";
}

function isExcluded(img: HTMLImageElement): boolean {
  if (img.closest("#global-lightbox")) return true;
  if (img.closest(".lang-toggle")) return true;
  if (img.closest("button")) return true;
  if (img.width > 0 && img.width < 24 && img.height < 24) return true;
  const src = getImageSrc(img);
  if (!src || src.startsWith("data:")) return true;
  return false;
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

  root.addEventListener("click", (e) => {
    if (!root.classList.contains("is-open")) return;
    const target = e.target as HTMLElement;
    if (target.closest(".global-lightbox__img")) return;
    closeLightbox();
  });

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
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (isExcluded(target)) return;
    if (!target.closest("main, .tabular-main, .site-main-column")) return;

    const src = getImageSrc(target);
    if (!src) return;

    e.preventDefault();
    e.stopPropagation();
    openLightbox(src, target.alt || "");
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
