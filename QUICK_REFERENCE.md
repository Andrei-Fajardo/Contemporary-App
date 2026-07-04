---
# QUICK REFERENCE: Using the Refactored Framework
---

## 🎨 Global Interactive Images

**Wrap any image to get automatic hover effects:**

```astro
<div class="interactive-image-container aspect-[4/5]">
  <img src="/path/to/image.jpg" alt="Description" />
</div>
```

**Behavior:**
- Image: subtle scale(1.015) on hover
- Shadow: difference-blend afterimage at translate(6px, 4px)
- Timing: 900ms fluid cubic-bezier curve
- Aspect ratio: 100% preserved (object-fit: contain)

---

## 🖼️ ArtCard Component

**Import and use:**

```astro
---
import ArtCard from '../components/ArtCard.astro';
---

<ArtCard 
  imageUrl="/images/artwork.jpg"
  title="Artwork Title"
  artist="Artist Name"
  medium="Oil on Canvas"
  year="2026"
  dimensions="120 × 90 cm"
  description="Detailed description of the artwork..."
  slug="artwork-title"
  tags={['Contemporary', 'Abstract']}
/>
```

**Required Props:**
- `imageUrl`, `title`, `artist`, `medium`, `year`, `description`, `slug`

**Optional Props:**
- `dimensions`, `tags`

**Auto-features:**
- Responsive 2-column grid (45% / 1fr)
- Interactive image hover
- Scrollable tech specs ribbon
- CTA button with dynamic routing

---

## 🌾 Grain Overlay

**Already active in layouts** — just add the texture file:

1. Place `grain.gif` in `public/` folder
2. Recommended size: 512×512px or 1024×1024px
3. Must tile seamlessly (no visible seams)
4. Dual-layer blend: multiply (3%) + overlay (2%)

**Adjust intensity in global.css:**
```css
.grain-overlay::before { opacity: 0.03; }  /* Dark grit */
.grain-overlay::after  { opacity: 0.02; }  /* Highlights */
```

---

## 🎯 Design Tokens (Quick Copy)

```css
/* Colors */
--canvas:       #E3E2DA;
--text-primary: #171717;
--text-body:    #525252;
--border:       rgba(0,0,0,0.1);

/* Spacing */
--gap-sm:  0.5rem;  /* 8px */
--gap-md:  2rem;    /* 32px */
--gap-lg:  3rem;    /* 48px */

/* Typography */
--font-mono: ui-monospace, monospace;
--line-length: 65ch;

/* Timing */
--duration-fast:  300ms;
--duration-fluid: 900ms;
--ease-fluid: cubic-bezier(0.16, 1, 0.3, 1);
```

---

## 📦 File Locations

```
src/
├── styles/
│   └── global.css              ← Global architecture & interactions
├── components/
│   └── ArtCard.astro           ← Multi-media card component
├── layouts/
│   ├── Layout.astro            ← Base layout (with grain overlay)
│   └── PageLayout.astro        ← Page layout (with grain overlay)
└── pages/
    └── gallery.astro           ← Demo page with samples

public/
└── grain.gif                   ← Grain texture (ADD THIS)
```

---

## 🚦 Testing Checklist

- [ ] Add `grain.gif` to `public/` folder
- [ ] Run `npm run dev`
- [ ] Navigate to `/gallery` to see ArtCard demo
- [ ] Test image hover on desktop (should see subtle scale + shadow)
- [ ] Test responsive breakpoints (md: 768px)
- [ ] Verify no horizontal scroll on narrow viewports
- [ ] Check grain overlay visibility (should be barely perceptible)

---

## 🔧 Common Adjustments

**Too much grain?** Lower opacity in global.css  
**Hover too strong?** Reduce scale from 1.015 to 1.01  
**Text too narrow?** Increase max-w-[65ch] to max-w-[75ch]  
**Images clipping?** Verify object-fit: contain on img tags  
**Horizontal scroll?** Ensure overflow-x-hidden on containers

---

**Need help?** See full details in [`IMPLEMENTATION_SUMMARY.md`](IMPLEMENTATION_SUMMARY.md)
