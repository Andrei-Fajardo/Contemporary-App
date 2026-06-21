let spyBound = false;
let spyTicking = false;
let spyScrollHandler: (() => void) | null = null;

const THUMB_HEIGHT = 21;
const FOCUS_RATIO = 0.22;

function getSectionTop(section: HTMLElement): number {
  return section.getBoundingClientRect().top + window.scrollY;
}

function getSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("section[id].scroll-section"));
}

function getNavLinks(): HTMLElement[] {
  const nav = document.querySelector<HTMLElement>(".desktop-sidebar .sidebar-nav");
  if (!nav) return [];
  return Array.from(nav.querySelectorAll<HTMLElement>(".sidebar-nav-link[data-nav-key]"));
}

function linkCenterInNav(link: HTMLElement, nav: HTMLElement): number {
  const navRect = nav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  return linkRect.top - navRect.top + linkRect.height * 0.5 - THUMB_HEIGHT * 0.5;
}

function setActiveNav(sectionId: string): void {
  document.querySelectorAll<HTMLElement>("[data-nav-key]").forEach((link) => {
    const isActive = link.dataset.navKey === sectionId;
    link.classList.toggle("nav-link--active", isActive);
    link.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

/** Section under the viewport focus line. */
export function resolveActiveSection(): string {
  const sections = getSections();
  if (!sections.length) return "home";

  const focusLine = window.innerHeight * FOCUS_RATIO;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= focusLine && rect.bottom > focusLine) {
      return section.id;
    }
  }

  const marker = window.scrollY + focusLine;
  let active = sections[0].id;
  for (const section of sections) {
    if (getSectionTop(section) <= marker + 4) active = section.id;
  }
  return active;
}

function updateSidebarTrack(nav: HTMLElement, links: HTMLElement[]): void {
  const track = document.getElementById("sidebar-scroll-track");
  if (!track || links.length < 2) return;

  const navRect = nav.getBoundingClientRect();
  const firstRect = links[0].getBoundingClientRect();
  const lastRect = links[links.length - 1].getBoundingClientRect();
  const top = firstRect.top - navRect.top + firstRect.height * 0.5;
  const bottom = lastRect.top - navRect.top + lastRect.height * 0.5;

  track.style.top = `${top}px`;
  track.style.height = `${Math.max(0, bottom - top)}px`;
}

/** Slide thumb along nav track, aligned to section scroll ranges. */
export function updateSidebarProgressThumb(): void {
  const nav = document.querySelector<HTMLElement>(".desktop-sidebar .sidebar-nav");
  const thumb = document.getElementById("sidebar-scroll-progress");
  if (!nav || !thumb) return;

  const sections = getSections();
  const links = getNavLinks();
  if (!sections.length || !links.length) return;

  updateSidebarTrack(nav, links);

  const linkByKey = new Map(links.map((link) => [link.dataset.navKey ?? "", link]));
  const marker = window.scrollY + window.innerHeight * FOCUS_RATIO;

  let sectionIndex = 0;
  for (let i = 0; i < sections.length; i++) {
    if (getSectionTop(sections[i]) <= marker + 4) sectionIndex = i;
  }

  const currentSection = sections[sectionIndex];
  const nextSection = sections[sectionIndex + 1];
  const currentLink = linkByKey.get(currentSection.id);
  if (!currentLink) return;

  let y = linkCenterInNav(currentLink, nav);

  if (nextSection) {
    const nextLink = linkByKey.get(nextSection.id);
    if (nextLink) {
      const start = getSectionTop(currentSection);
      const end = getSectionTop(nextSection);
      const span = Math.max(1, end - start);
      const t = Math.min(1, Math.max(0, (marker - start) / span));
      const currentY = linkCenterInNav(currentLink, nav);
      const nextY = linkCenterInNav(nextLink, nav);
      y = currentY + (nextY - currentY) * t;
    }
  }

  thumb.style.transform = `translate3d(0, ${y}px, 0)`;
}

function updateScrollSpy(): void {
  const active = resolveActiveSection();
  setActiveNav(active);
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
