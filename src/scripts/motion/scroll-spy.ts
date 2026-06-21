let spyObserver: IntersectionObserver | null = null;

function setActiveNav(sectionId: string): void {
  document.querySelectorAll<HTMLElement>("[data-nav-key]").forEach((link) => {
    const isActive = link.dataset.navKey === sectionId;
    link.classList.toggle("nav-link--active", isActive);
    link.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

export function initScrollSpy(): void {
  const sections = document.querySelectorAll<HTMLElement>("section[id].scroll-section");
  const navLinks = document.querySelectorAll<HTMLElement>("[data-nav-key]");
  if (!sections.length || !navLinks.length) return;

  if (!spyObserver) {
    spyObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveNav(visible[0].target.id);
        }
      },
      { threshold: [0.15, 0.35, 0.55], rootMargin: "-18% 0px -52% 0px" }
    );
  }

  sections.forEach((section) => spyObserver?.observe(section));

  const hash = window.location.hash.replace("#", "");
  if (hash && document.getElementById(hash)) {
    setActiveNav(hash);
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  } else {
    setActiveNav(sections[0].id);
  }
}

export function initAnchorNav(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((link) => {
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
}
