import { prefersReducedMotion } from "./utils";

const VELOCITY_THRESHOLD = 1.35;
const POPUP_DURATION_MS = 1500;

let velocityBound = false;
let lastScrollY = 0;
let lastScrollTime = 0;
let velocityTimer: ReturnType<typeof setTimeout> | null = null;
let activeHost: HTMLElement | null = null;

function clearVelocityPopup(): void {
  if (velocityTimer) {
    clearTimeout(velocityTimer);
    velocityTimer = null;
  }
  if (activeHost) {
    activeHost.classList.remove("media-popup--open");
    activeHost = null;
  }
}

function openVelocityPopup(host: HTMLElement): void {
  clearVelocityPopup();
  activeHost = host;
  host.classList.add("media-popup--open");
  velocityTimer = setTimeout(clearVelocityPopup, POPUP_DURATION_MS);
}

function findPopupHostInView(): HTMLElement | null {
  const hosts = document.querySelectorAll<HTMLElement>(".media-popup-host");
  const midline = window.innerHeight * 0.5;

  for (const host of hosts) {
    const rect = host.getBoundingClientRect();
    if (rect.top < midline && rect.bottom > midline) return host;
  }

  return hosts[0] ?? null;
}

function onScroll(): void {
  const now = performance.now();
  const scrollY = window.scrollY;
  const deltaY = Math.abs(scrollY - lastScrollY);
  const deltaTime = Math.max(now - lastScrollTime, 16);
  const velocity = deltaY / deltaTime;

  lastScrollY = scrollY;
  lastScrollTime = now;

  if (velocity < VELOCITY_THRESHOLD) return;

  const host = findPopupHostInView();
  if (host) openVelocityPopup(host);
}

export function initScrollVelocity(): void {
  if (velocityBound || prefersReducedMotion()) return;
  velocityBound = true;

  lastScrollY = window.scrollY;
  lastScrollTime = performance.now();

  window.addEventListener("scroll", onScroll, { passive: true });
}

export function resetScrollVelocity(): void {
  velocityBound = false;
  clearVelocityPopup();
}
