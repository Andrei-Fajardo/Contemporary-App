/**
 * artwork-parallax.ts
 *
 * Gentle cursor-reactive parallax for all decorative panel artwork images.
 * Behaviour:
 *   - Each image with [data-artwork-parallax] tracks the mouse position
 *     relative to the viewport centre.
 *   - Translation is capped at ±maxPx (default 20px) and eased via lerp
 *     (linear interpolation) each rAF frame so the motion feels organic
 *     and never snappy or distracting.
 *   - The fixed research panel image uses the full viewport for its reference
 *     box; the others use their nearest positioned ancestor.
 *   - Motion is disabled via prefers-reduced-motion.
 */

interface ParallaxTarget {
  el: HTMLElement;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  /** How much the image moves relative to cursor offset. 0.04 = very subtle. */
  strength: number;
  /** Max pixels of displacement in any direction. */
  maxPx: number;
}

const LERP_FACTOR = 0.055; // lower = smoother / slower catch-up
/** Scales cursor displacement for all decorative artwork (0.5 ≈ half as sensitive). */
const GLOBAL_SENSITIVITY = 0.5;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function initArtworkParallax(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Touch / mobile — no cursor to track, and transform on position:fixed
  // elements causes scroll jank. Skip entirely on non-pointer devices.
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const targets: ParallaxTarget[] = [];

  // Gather all artwork images
  document.querySelectorAll<HTMLElement>('[data-artwork-parallax]').forEach((el) => {
    targets.push({
      el,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      strength: parseFloat(el.dataset.artworkStrength ?? '0.04'),
      maxPx: parseFloat(el.dataset.artworkMax ?? '20'),
    });
  });

  if (targets.length === 0) return;

  // Track mouse against viewport centre
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e: MouseEvent) => {
    // Offset from viewport centre: -1 → +1
    mouseX = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
    mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  }, { passive: true });

  let rafId: number;

  function tick(): void {
    rafId = requestAnimationFrame(tick);

    let anyMoving = false;

    for (const t of targets) {
      t.targetX = Math.max(-t.maxPx, Math.min(t.maxPx, mouseX * t.maxPx * (t.strength / 0.04) * GLOBAL_SENSITIVITY));
      t.targetY = Math.max(-t.maxPx, Math.min(t.maxPx, mouseY * t.maxPx * (t.strength / 0.04) * GLOBAL_SENSITIVITY));

      const newX = lerp(t.currentX, t.targetX, LERP_FACTOR);
      const newY = lerp(t.currentY, t.targetY, LERP_FACTOR);

      // Only update DOM if movement is perceptible (> 0.05px delta)
      if (Math.abs(newX - t.currentX) > 0.05 || Math.abs(newY - t.currentY) > 0.05) {
        t.currentX = newX;
        t.currentY = newY;
        t.el.style.transform = `translate(${newX.toFixed(2)}px, ${newY.toFixed(2)}px)`;
        anyMoving = true;
      }
    }

    // If nothing is moving (cursor idle for many frames) we could pause,
    // but rAF is cheap enough here to keep running.
    void anyMoving;
  }

  tick();

  // Clean up if the component is ever removed (SPA navigation)
  document.addEventListener('astro:before-swap', () => {
    cancelAnimationFrame(rafId);
  });
}
