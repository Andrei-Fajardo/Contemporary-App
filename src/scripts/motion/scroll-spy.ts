let spyBound = false;
let spyTicking = false;
let spyScrollHandler: (() => void) | null = null;
let spyObserver: IntersectionObserver | null = null;
const sectionRatios = new Map<string, number>();

function setActiveNav(sectionId: string): void {
  document.querySelectorAll<HTMLElement>("[data-nav-key]").forEach((link) => {
    const isActive = link.dataset.navKey === sectionId;
    link.classList.toggle("nav-link--active", isActive);
    link.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

/** Which section is at the viewport focus line (~38% from top). */
export function resolveActiveSection(): string {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id].scroll-section"));
  if (!sections.length) return "home";

  const focusLine = window.innerHeight * 0.38;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= focusLine && rect.bottom > focusLine) {
      return section.id;
    }
  }

  let best = sections[0].id;
  let bestDistance = Infinity;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const center = rect.top + rect.height * 0.5;
    const distance = Math.abs(center - focusLine);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = section.id;
    }
  }

  return best;
}

function updateScrollSpy(): void {
  const fromObserver = [...sectionRatios.entries()]
    .filter(([, ratio]) => ratio > 0)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  const sectionId = fromObserver ?? resolveActiveSection();
  setActiveNav(sectionId);
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

function observeSections(): void {
  const sections = document.querySelectorAll<HTMLElement>("section[id].scroll-section");
  sectionRatios.clear();
  spyObserver?.disconnect();

  if (!("IntersectionObserver" in window)) return;

  spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).id;
        sectionRatios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      updateScrollSpy();
    },
    { rootMargin: "-32% 0px -48% 0px", threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1] }
  );

  sections.forEach((section) => spyObserver?.observe(section));
}

export function initScrollSpy(): void {
  observeSections();

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
  spyObserver?.disconnect();
  spyObserver = null;
  sectionRatios.clear();
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
