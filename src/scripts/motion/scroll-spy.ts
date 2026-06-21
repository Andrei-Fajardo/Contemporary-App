let spyBound = false;
let spyTicking = false;
let spyScrollHandler: (() => void) | null = null;

function setActiveNav(sectionId: string): void {
  document.querySelectorAll<HTMLElement>("[data-nav-key]").forEach((link) => {
    const isActive = link.dataset.navKey === sectionId;
    link.classList.toggle("nav-link--active", isActive);
    link.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

function resolveActiveSection(): string {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id].scroll-section"));
  if (!sections.length) return "home";

  const marker = window.scrollY + window.innerHeight * 0.33;
  let active = sections[0].id;

  for (const section of sections) {
    const top = section.getBoundingClientRect().top + window.scrollY;
    if (top <= marker + 4) active = section.id;
  }

  return active;
}

function updateScrollSpy(): void {
  setActiveNav(resolveActiveSection());
}

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
  if (spyBound) return;
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

      const drawer = document.getElementById("mobile-drawer");
      if (drawer && !drawer.classList.contains("translate-x-full")) {
        document.getElementById("hamburger-btn")?.click();
      }
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (hash && document.getElementById(hash)) {
    setActiveNav(hash);
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "auto", block: "start" });
      updateScrollSpy();
    });
  }
}
