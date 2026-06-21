(function () {
  "use strict";

  var scrollBound = false;
  var motionObserver = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function revealInView() {
    var targets = document.querySelectorAll(
      ".parallax-text, .art-parallax-text, .fade-up, .parallax-container, .art-parallax-container"
    );
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    if (!motionObserver) {
      motionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
      );
    }

    targets.forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      var rect = el.getBoundingClientRect();
      var inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
      if (inView) {
        el.classList.add("is-visible");
      }
      motionObserver.observe(el);
    });
  }

  function bindScrollLayers() {
    if (scrollBound) return;
    scrollBound = true;

    var layers = document.querySelectorAll("[data-parallax-speed]");
    if (!layers.length || prefersReducedMotion()) return;

    var ticking = false;

    function update() {
      var scrollY = window.scrollY;
      layers.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax-speed") || "0.35");
        var rect = el.getBoundingClientRect();
        var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        var clamped = Math.max(0, Math.min(1, progress));
        var y = (clamped - 0.5) * 120 * speed;
        var scale = 1 + (1 - clamped) * 0.08 * speed;
        el.style.transform = "translate3d(0, " + y + "px, 0) scale(" + scale + ")";
      });

      var hero = document.querySelector(".hero-parallax");
      if (hero) {
        var heroProgress = Math.min(scrollY / Math.max(hero.offsetHeight * 0.7, 1), 1);
        hero.style.opacity = String(Math.max(0.15, 1 - heroProgress * 0.85));
        hero.style.transform = "translate3d(0, " + -scrollY * 0.2 + "px, 0)";
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  function initParallax() {
    document.documentElement.classList.add("js-motion");
    revealInView();
    bindScrollLayers();

    var hash = window.location.hash;
    if (hash) {
      var target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        setTimeout(revealInView, 100);
      }
    }
  }

  function boot() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initParallax);
    } else {
      initParallax();
    }
    window.addEventListener("load", function () {
      setTimeout(initParallax, 50);
    });
  }

  boot();
  window.addEventListener("hashchange", function () {
    setTimeout(initParallax, 50);
  });
  document.addEventListener("astro:page-load", function () {
    setTimeout(initParallax, 50);
  });
})();
