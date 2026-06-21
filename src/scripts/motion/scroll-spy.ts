let spyBound = false;
let spyTicking = false;
let spyScrollHandler: (() => void) | null = null;

function getSectionTop(section: HTMLElement): number {
  return section.getBoundingClientRect().top + window.scrollY;
}

function setActiveNav(sectionId: string): void {
  document.querySelectorAll<HTMLElement>("[data-nav-key]").forEach((link) => {
    const isActive = link.dataset.navKey === sectionId;
    link.classList.toggle("nav-link--active", isActive);
    link.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

/** Section passed by scroll depth (~30% viewport from top). */
export function resolveActiveSection(): string {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id].scroll-section"));
  if (!sections.length) return "home";

  const marker = window.scrollY + window.innerHeight * 0.3;
  let active = sections[0].id;

  for (const section of sections) {
    if (getSectionTop(section) <= marker + 4) active = section.id;
  }

  return active;
}

function getScrollProgress(): number {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(1, Math.max(0, window.scrollY / maxScroll));
}

/** Move the dark rail thumb based on overall page scroll (top → bottom). */
export function updateSidebarProgressThumb(): void {
  const nav = document.querySelector<HTMLElement>(".desktop-sidebar .sidebar-nav");
  const thumb = document.getElementById("sidebar-scroll-progress");
  if (!nav || !thumb) return;

  const links = Array.from(nav.querySelectorAll<HTMLElement>(".sidebar-nav-link[data-nav-key]"));
  if (!links.length) return;

  const progress = getScrollProgress();
  const navRect = nav.getBoundingClientRect();
  const firstRect = links[0].getBoundingClientRect();
  const lastRect = links[links.length - 1].getBoundingClientRect();

  const startY = firstRect.top - navRect.top + firstRect.height * 0.5;
  const endY = lastRect.top - navRect.top + lastRect.height * 0.5;
  const thumbHeight = 21;
  const y = startY + (endY - startY) * progress - thumbHeight * 0.5;

  thumb.style.transform = `translate3d(0, ${y}px, 0)`;
}

function updateScrollSpy(): void {
  setActiveNav(resolveActiveSection());
  updateSidebarProgressThumb();
}

export { updateScrollSpy };

function onSpyScroll(): void {
  if (!spyTicking) {
    spyTicking = true;
    requestAnimationFrame(() => {
      updateScrollSpy();
      spyTicking = false;
    });
  }
}

export function initScrollSpy(): void {
  if (spyBound) {
    updateScrollSpy();
    return;
  }
  spyBound = true;

  spyScrollHandler = onSpyScroll;
  window.addEventListener("scroll", spyScrollHandler, { passive: true });
  window.addEventListener("resize", spyScrollHandler, { passive: true });
  updateScrollSpy();
}

export function resetScrollSpy(): void {
  if (spyScrollHandler) {
    window.removeEventListener("scroll", spyScrollHandler);
    window.removeEventListener("resize", spyScrollHandler);
    spyScrollHandler = null;
  }
  spyBound = false;
}

export function initAnchorNav(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((link) => {
    if (link.dataset.anchorBound === "true") return;
    link.dataset.anchorBound = "true";

    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.includes("#")) return;

      const hash = href.split("#")[1];
      if (!hash) return;

      const target = document.getElementById(hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${hash}`);
      setActiveNav(hash);
      updateSidebarProgressThumb();

      const drawer = document.getElementById("mobile-drawer");
      if (drawer && !drawer.classList.contains("translate-x-full")) {
        document.getElementById("hamburger-btn")?.click();
      }
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (hash && document.getElementById(hash)) {
    setActiveNav(hash);
    updateScrollSpy();

    if (
      sessionStorage.getItem("lang-preserve-scroll") === null &&
      sessionStorage.getItem("lang-switching") === null
    ) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "auto", block: "start" });
        updateScrollSpy();
      });
    }
  } else {
    updateScrollSpy();
  }
}
