# UX Guidelines — Contemporary App Design System API

> **Version:** 0.1 (draft — extracted from codebase)  
> **Status:** Proposed for approval  
> **Primary sources:** `src/styles/global.css`, `src/styles/motion.css`, `src/layouts/PageLayout.astro`, section components, `Hero.astro`, `SiteFooter.astro`

This document is the **Contextual API** for all UI generation in this project. When building or refactoring UI, use these tokens exclusively. Do not substitute generic Tailwind defaults or arbitrary values unless a token is added here first.

---

## 1. Design Principles (Implicit)

| Principle | Implementation |
|-----------|----------------|
| Editorial warmth | Warm off-white canvas, paper grain, serif + sans pairing |
| High contrast ink | Near-black `#111` on `#F0EEE9`; minimal color accents |
| Typographic hierarchy | Oversized display sans, Forum for editorial headings, mono for meta |
| Motion restraint | Native CSS + JS; `cubic-bezier(0.16, 1, 0.3, 1)` as default easing |
| Depth as scroll | Depth-of-field on images; sidebar thumb tracks scroll position |
| Progressive disclosure | Collapsed sidebar rail expands on hover; captions on image hover |

---

## 2. Color Tokens

### 2.1 Core Palette

| Token | Hex / Value | RGB | Usage | Source |
|-------|-------------|-----|-------|--------|
| `color.canvas` | `#F0EEE9` | `240, 238, 233` | Page background (Pantone 11-4201 TCX Cloud Dancer) | `global.css`, `PageLayout` |
| `color.ink` | `#111111` | `17, 17, 17` | Primary text, active states, scrollbar thumb | `global.css`, components |
| `color.ink-short` | `#111` | `17, 17, 17` | Tailwind shorthand — **prefer `color.ink` in new code** | `PageLayout`, footer |
| `color.ink-muted` | `#555555` | `85, 85, 85` | Secondary nav, footer labels, lang inactive | `PageLayout`, `SiteFooter` |
| `color.ink-tertiary` | `#888888` | `136, 136, 136` | Mobile drawer nav inactive | `PageLayout` |
| `color.ink-inverse` | `#FFFFFF` | `255, 255, 255` | Text on dark surfaces (mobile drawer) | `PageLayout` |
| `color.caption-on-dark` | `#F0EEE9` | `240, 238, 233` | Media card caption text on gradient | `motion.css` |

### 2.2 Neutral Scale (Tailwind — in active use)

| Token | Tailwind class | Usage |
|-------|----------------|-------|
| `neutral.900` | `text-neutral-900`, `border-neutral-900/20` | Display headings, section dividers |
| `neutral.800` | `text-neutral-800` | Hero intro serif |
| `neutral.700` | `text-neutral-700` | Press list body |
| `neutral.600` | `text-neutral-600` | Supporting mono copy |
| `neutral.500` | `text-neutral-500` | Section tags, indices |
| `neutral.400` | `text-neutral-400`, `border-neutral-400` | Painting metadata, year badges |
| `neutral.200` | `bg-neutral-200` | Image placeholders |

### 2.3 Semantic / Surface Colors

| Token | Value | Usage |
|-------|-------|-------|
| `surface.mobile-header` | `#F0EEE9` @ 95% + `backdrop-blur-md` | Mobile top bar |
| `surface.mobile-drawer` | `#111111` | Slide-out navigation |
| `surface.lang-toggle` | `rgba(255,255,255,0.82)` + `backdrop-blur(12px)` | Language selector pill |
| `surface.lang-overlay` | `rgba(240,238,233,0.92)` + `backdrop-blur(10px)` | Language transition screen |
| `surface.explore-card` | `bg-white/30` → hover `bg-white/60` | Exhibition explore links |
| `surface.image-placeholder` | `rgba(0,0,0,0.04)` | Lazy media, interactive image wrapper |
| `surface.hero-frame` | `rgba(0,0,0,0.03)` | Hero media frame background |

### 2.4 Border & Divider Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `border.subtle` | `border-black/10` | Section rules, footer, cards |
| `border.default` | `border-black/20` | Lang toggle, section outer borders |
| `border.sidebar` | `rgba(0,0,0,0.08)` | Desktop sidebar right edge |
| `border.section` | `border-neutral-900/20` | Between scroll sections |
| `border.lang` | `1.5px solid rgba(17,17,17,0.22)` | Language toggle container |
| `divider.meta` | `1px solid rgba(22,23,27,0.1)` | Meta label strip (`global.css`) |

### 2.5 Opacity Modifiers (Ink on Canvas)

| Token | Value | Usage |
|-------|-------|-------|
| `ink.50` | `#111111` @ 50% | Section tags `(ABOUT)`, `(EXHIBITIONS)` |
| `ink.70` | `#111111` @ 70% | Body copy, footer links |
| `ink.40` | `#111111` @ 40% | Biography labels, copyright |
| `muted.60` | `#555` @ 60% | Footer column headers |
| `muted.70` | `#555` @ 70% | Footer link text |
| `black.12` | `rgba(17,17,17,0.12)` | Lang overlay progress track |
| `black.14` | `rgba(17,17,17,0.14)` | Sidebar scroll track line |
| `black.22` | `rgba(17,17,17,0.22)` | Active lang button shadow |
| `black.08` | `rgba(17,17,17,0.08)` | Sidebar expand shadow, lang toggle shadow |

### 2.6 Grain Overlay

| Token | Value |
|-------|-------|
| `grain.asset` | `/grain.gif` (repeated) |
| `grain.dark-opacity` | `0.03` (`mix-blend-mode: multiply`) |
| `grain.light-opacity` | `0.02` (`mix-blend-mode: overlay`) |
| `grain.z-index` | `9999` |

---

## 3. Typography Tokens

### 3.1 Font Families

| Token | CSS Variable / Class | Stack | Role |
|-------|---------------------|-------|------|
| `font.display` | `font-forum` / `--font-forum` | `"Forum", serif` | Site name, exhibition/contact headings |
| `font.serif` | `font-serif` / `--font-serif` | `"Cormorant Garamond", Georgia, serif` | Body prose, italic intros |
| `font.ui` | `font-sans` / `--font-sans` | `"Inter", Helvetica, Arial, sans-serif` | Nav, labels, display sans headings |
| `font.mono` | `font-mono` | System monospace | Tags, indices, metadata, copyright |

**Google Fonts import (locked):** Forum, Cormorant Garamond (400/600/700 + italics), Inter (300–900).

### 3.2 Type Scale

| Token | Classes | Size | Weight | Tracking | Leading | Transform |
|-------|---------|------|--------|----------|---------|-----------|
| `type.hero-display` | `font-sans font-black uppercase` | `text-5xl md:text-7xl lg:text-[9rem]` | 900 | `tracking-tighter` | `leading-[0.85]` | uppercase |
| `type.hero-outline` | `text-outline` (custom) | same as hero | 900 | `tracking-tighter` | `leading-[0.85]` | stroke outline year |
| `type.section-display-sans` | `font-sans font-black uppercase` | `text-4xl md:text-6xl lg:text-[8rem]` | 900 | `tracking-tighter` | `leading-[0.85]` | uppercase |
| `type.section-display-forum` | `font-forum` | `text-4xl md:text-6xl lg:text-8xl` | bold | — | `leading-[0.9]` | — |
| `type.section-display-contact` | `font-forum` | `text-4xl md:text-6xl lg:text-[9rem]` | — | — | `leading-[0.9]` | — |
| `type.painting-title` | `font-sans font-black uppercase` | `text-3xl md:text-4xl` | 900 | `tracking-tighter` | `leading-[0.9]` | uppercase |
| `type.about-heading` | `font-forum` | `text-3xl md:text-4xl lg:text-5xl` | bold | — | `leading-[1.1]` | — |
| `type.intro-serif` | `font-serif italic` | `text-lg md:text-xl lg:text-2xl` | 400 | — | `leading-relaxed` | italic |
| `type.body-serif` | `font-serif` | `text-sm md:text-base` | 400 | — | `leading-relaxed` | — |
| `type.body-mono` | `font-mono` | `text-xs` | — | `tracking-wider` | `leading-relaxed` | uppercase (hero desc) |
| `type.tag-primary` | `font-mono` or `font-sans` | `text-[10px]` | — | `tracking-[0.3em]` | — | uppercase |
| `type.tag-secondary` | `font-sans` | `text-[9px]` | — | `tracking-widest` | — | uppercase |
| `type.tag-tertiary` | `font-sans` | `text-[8px]` | — | `tracking-[0.25em]` | — | uppercase |
| `type.footer-label` | `font-mono` | `text-[10px]` | — | `tracking-widest` | — | uppercase |
| `type.footer-body` | `font-sans` | `text-xs` / `text-sm` | — | — | — | — |
| `type.copyright` | `font-mono` | `text-[11px]` | — | `tracking-wider` | — | — |
| `type.sidebar-nav` | `font-sans` | `text-[11px]` | 500–700 | `tracking-wider` | — | uppercase |
| `type.sidebar-brand` | `font-forum` | `text-3xl` | bold | `tracking-tight` | `leading-[1.05]` | — |
| `type.lang-code` | `font-forum` | `text-6xl md:text-7xl` | — | — | `leading-none` | — |

### 3.3 Prose Width

| Token | Value | Usage |
|-------|-------|-------|
| `measure.narrow` | `max-w-[45ch]` | Hero desc, painting descriptions |
| `measure.body` | `max-w-[55ch]` | Intro, about body |
| `measure.section` | `max-w-4xl` | Exhibitions, publications lists |

### 3.4 Special Text Treatment

| Token | CSS | Usage |
|-------|-----|-------|
| `text.outline` | `-webkit-text-stroke: 1px #111111; color: transparent` | Hero year "2026" |
| `text.meta-strip` | `.meta-label-strip` — 11px mono, `letter-spacing: 0.2em`, `#9CA3AF` | Tech spec strips |

---

## 4. Spacing Tokens

### 4.1 Layout Spacing

| Token | Tailwind / CSS | Usage |
|-------|----------------|-------|
| `layout.section-x` | `px-4 sm:px-6 md:px-8` | All scroll sections |
| `layout.section-y-tight` | `py-10 md:py-14` | Art section blocks |
| `layout.section-y` | `py-12 md:py-20` | Standard sections |
| `layout.main-offset` | `lg:pl-[4.5rem]` | Main column (collapsed sidebar width) |
| `layout.mobile-header-h` | `h-16` + `pt-16` on main | Mobile header clearance |
| `layout.footer-x` | `px-6 sm:px-8` | Site footer |
| `layout.footer-y` | `pt-16 pb-24` | Site footer |
| `layout.hero-sticky-y` | `padding-block: 4rem` → `5rem` @768px container | Hero sticky area |

### 4.2 Component Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `gap.section-inner` | `gap-5 md:gap-8` | Art piece image + text |
| `gap.section-columns` | `gap-10 md:gap-12 lg:gap-16` | About two-column |
| `gap.divider-row` | `gap-4` | Tag + horizontal rule rows |
| `gap.explore-grid` | `gap-3` | Exhibition explore cards |
| `gap.footer-columns` | `gap-8` | Footer grid |
| `space.tag-to-heading` | `mb-4` – `mb-6` | Section tag → H2 |
| `space.heading-to-content` | `mb-10 md:mb-16` | H2 → body |
| `scroll-margin.mobile` | `6rem` | Anchor scroll offset |
| `scroll-margin.desktop` | `1.5rem` | Anchor scroll offset @lg |

### 4.3 Sidebar Dimensions

| Token | Value | Usage |
|-------|-------|-------|
| `sidebar.width.collapsed` | `4.5rem` (72px) | Desktop rail |
| `sidebar.width.expanded` | `22rem` (352px) | Desktop hover state |
| `sidebar.brand-min-h` | `5.5rem` | Brand block |
| `sidebar.nav-padding-x` | `px-5` | Nav area |
| `sidebar.footer-padding` | `px-5 py-8` | Footer block |
| `sidebar.scroll-track` | `2px` wide | Progress line |
| `sidebar.scroll-thumb` | `2px × 1.35rem` | Active thumb |

### 4.4 Z-Index Scale

| Token | Value | Element |
|-------|-------|---------|
| `z.grain` | `9999` | Film grain overlay |
| `z.lang-toggle` | `10060` | Language selector |
| `z.lang-overlay` | `10050` | Language transition |
| `z.mobile-header` | `50` | Mobile top bar |
| `z.mobile-drawer` | `50` | Mobile nav drawer |
| `z.drawer-backdrop` | `40` | Mobile drawer backdrop |
| `z.sidebar` | `45` | Desktop sidebar |

---

## 5. Border Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `radius.default` | `rounded` (0.25rem) | Cards, images, explore links |
| `radius.lang-toggle` | `0.35rem` | Language selector container |
| `radius.lang-btn` | `0.2rem` | Individual language buttons |
| `radius.nav-mobile` | `rounded-md` | Mobile drawer links |
| `radius.scroll-thumb` | `1px` | Sidebar progress thumb |

---

## 6. Shadow & Elevation Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `shadow.sidebar-expand` | `8px 0 32px rgba(17,17,17,0.08)` | Sidebar on hover |
| `shadow.lang-toggle` | `0 4px 18px rgba(17,17,17,0.08)` | Language pill |
| `shadow.lang-active` | `inset 0 0 0 1px rgba(240,238,233,0.12), 0 2px 8px rgba(17,17,17,0.22)` | Active lang button |

---

## 7. Motion & Transition Tokens

### 7.1 Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `ease.editorial` | `cubic-bezier(0.16, 1, 0.3, 1)` | **Primary** — reveals, sidebar, captions, depth |
| `ease.standard` | `ease` | Nav underline, grain-adjacent |
| `ease.lang-bar` | `cubic-bezier(0.4, 0, 0.2, 1)` | Language overlay progress bar |
| `ease.image` | `cubic-bezier(0.16, 1, 0.3, 1)` | Interactive image scale (900ms) |

### 7.2 Durations

| Token | Duration | Usage |
|-------|----------|-------|
| `duration.instant` | `0.18s` | Sidebar scroll thumb |
| `duration.fast` | `0.2s` | Lang button, monogram fade |
| `duration.nav` | `0.4s` | Sidebar width, nav color, captions |
| `duration.medium` | `0.45s` | Lang overlay fade |
| `duration.reveal` | `0.8s` | Scroll reveal (desktop) |
| `duration.reveal-mobile` | `0.3s` | Scroll reveal (mobile) |
| `duration.image` | `900ms` | Image hover scale |
| `duration.drawer` | `400ms` | Mobile drawer slide |
| `duration.lang-overlay` | `1.5s` | Language switch hold + bar fill |
| `duration.underline` | `500ms` | Nav underline scale |

### 7.3 Motion Behaviors

| Component | Behavior | Reduced motion |
|-----------|----------|----------------|
| `.scroll-reveal` | Fade up `1.75rem` → `0`, opacity `0` → `1` | Instant, no transform |
| `.lazy-media` | Depth blur up to `10px` desktop / `5px` mobile | Disabled |
| `.media-card-caption` | Bottom gradient fade on hover | No transition |
| `.desktop-sidebar` | `4.5rem` → `22rem` on hover/focus-within | Width transition kept |
| `.sidebar-scroll-progress` | Thumb slides along single track by section | JS-driven |
| `.interactive-image-container` | Scale `1.015` + difference overlay on hover | Disabled on `hover: none` |
| `.lang-transition-overlay` | Full-screen fade + panel scale | — |

### 7.4 Breakpoints

| Token | Value | Behavior change |
|-------|-------|-----------------|
| `bp.sm` | `640px` | Grid columns (explore cards) |
| `bp.md` | `768px` | Hero two-column, typography scale-up |
| `bp.lg` | `1024px` | Desktop sidebar visible, parallax off on mobile |
| `bp.touch` | `max-width: 1023px` | Mobile header, reduced motion paths |

---

## 8. Component Tokens

### 8.1 Desktop Sidebar (`.desktop-sidebar`)

| Property | Collapsed | Expanded (hover) |
|----------|-----------|------------------|
| Width | `4.5rem` | `22rem` |
| Background | `#F0EEE9` | same |
| Border | `1px solid rgba(0,0,0,0.08)` right | same |
| Nav labels | `opacity: 0` | `opacity: 1` |
| Monogram `A·R` | visible | hidden |
| Scroll track | Single `2px` line + dark thumb | hidden |

**Active nav link:** `color: #111`, `font-weight: 700`, underline `scaleX(1)` `bg: #111`.

**Inactive nav link:** `text-[#555]/70`, hover `text-[#111]`.

### 8.2 Language Toggle (`.lang-toggle`)

| Property | Desktop | Mobile |
|----------|---------|--------|
| Position | `fixed top: 1.35rem right: 1.35rem` | inline in header |
| Padding | `0.3rem` | `0.2rem` |
| Gap | `0.2rem` | `0.15rem` |
| Button min-width | `2.65rem` | `2.1rem` |
| Button padding | `0.65rem 0.85rem` | `0.5rem 0.55rem` |
| Font size | `0.72rem` | `0.62rem` |
| Active state | `bg: #111`, `color: #F0EEE9` | same |
| Inactive | `color: #555`, hover `bg rgba(17,17,17,0.07)` | same |

### 8.3 Mobile Drawer (`#mobile-drawer`)

| Property | Value |
|----------|-------|
| Width | `85vw`, max `320px` |
| Background | `#111` |
| Border | `border-white/10` left |
| Nav link | `text-[#888]`, active `bg-white/10 text-white` |
| Transition | `translate-x` `400ms ease-out` |

### 8.4 Section Shell (`.scroll-section`)

| Property | Value |
|----------|-------|
| Border bottom | `border-neutral-900/20` |
| Scroll margin | `6rem` mobile / `1.5rem` desktop |
| Inner padding | See `layout.section-x`, `layout.section-y` |

### 8.5 Exhibition Explore Card (`.exhibitions-explore-link`)

| State | Styles |
|-------|--------|
| Default | `min-h-[88px] p-4 border border-black/10 rounded bg-white/30` |
| Hover | `bg-white/60 border-black/20` |
| Label | `text-[10px] uppercase tracking-[0.2em] text-[#111]/50` |
| Action | `font-mono text-xs uppercase tracking-widest` + `→` shifts `translate-x-1` |

### 8.6 Media Card (`.media-card`)

| Element | Token |
|---------|-------|
| Caption gradient | `linear-gradient(to top, rgba(17,17,17,0.72), transparent)` |
| Caption padding | `1rem 1.25rem` |
| Title | `0.7rem` sans, `letter-spacing: 0.18em`, uppercase, weight 700 |
| Subtitle | `0.62rem` mono, `letter-spacing: 0.12em`, opacity 0.85 |
| Hover | Caption `opacity: 0 → 1`, `translateY(0.35rem → 0)` — **no image blur** |

### 8.7 Hero Media Frame (`.hero-media-frame`)

| Property | Value |
|----------|-------|
| Aspect ratio | `4 / 5` |
| Border | `1px solid rgba(17,17,17,0.1)` |
| Background | `rgba(0,0,0,0.03)` |
| Overflow | `clip` |

### 8.8 Footer (`.SiteFooter`)

| Property | Value |
|----------|-------|
| Top rule | `border-t border-black/10 pt-12` |
| Grid | `md:grid-cols-3` |
| Link hover | `group-hover:translate-x-px` + `duration-300 ease-out` |
| Underline | `underline-offset-4`, `decoration-black/30` |

---

## 9. Interactive States

| State | Pattern |
|-------|---------|
| Link hover (footer/nav) | `opacity-70`, `translate-x-px`, or `text-[#111]` |
| Button active scale | `active:scale-95` (hamburger) |
| Focus | Inherit hover paths; sidebar uses `:focus-within` |
| `aria-current` | Set by scroll-spy JS on `[data-nav-key]` |
| `aria-pressed` | Language toggle active button |
| Touch targets (mobile) | Min `44×44px` on `button, a` @max-lg |

---

## 10. Asset & Texture Tokens

| Token | Path / value |
|-------|--------------|
| `asset.grain` | `/grain.gif` |
| `asset.favicon` | `/favicon.svg` |
| `aspect.hero` | `4 / 5` |
| `aspect.about-portrait` | `3 / 4` |
| `aspect.artwork` | `4 / 5` (contain) or `3 / 2` (cover) |
| `max-height.artwork` | `72vh` |

---

## 11. Known Inconsistencies (To Resolve on Approval)

These exist in the codebase today. New UI should **not** add more variants — pick one canonical token per row when implementing.

| Area | Variant A | Variant B | **Recommended canonical** |
|------|-----------|-----------|---------------------------|
| Primary ink | `#111` | `#111111` | `color.ink` → `#111111` |
| Section tags | `text-neutral-500` + `font-mono` | `text-[#111111]/50` + `font-sans` | `type.tag-primary` + `ink.50` |
| Section headings | `font-sans font-black` (Art, Press) | `font-forum` (Exhibitions, Contact) | Keep both — document intent: **sans = bold editorial**, **forum = classical editorial** |
| Horizontal rules | `bg-neutral-900/20` | `bg-black/10` | `border.subtle` (`black/10`) for inner; `border.section` for section shells |
| Body text color | `text-neutral-*` | `text-[#111111]/70` | `ink.70` for new components |

---

## 12. Agent Operating Protocol

When requesting UI work, reference this file as `@ux-guidelines.md`.

1. **Use tokens by name** (e.g. `color.canvas`, `type.section-display-sans`) in comments or Tailwind mappings.
2. **Do not invent** new hex values, font sizes, or easings without proposing a token row here first.
3. **Prefer CSS classes** defined in `motion.css` / `global.css` over one-off inline styles.
4. **Respect motion flags:** `html.motion-live`, `prefers-reduced-motion`, `hover: none`.
5. **Sidebar & lang toggle** behaviors are specified in §8 — do not revert to persistent full-width sidebar or `<a>` lang links.

### Token addition proposal template

```markdown
### Proposed: `token.name`
- **Value:** …
- **Usage:** …
- **Rationale:** …
```

---

## 13. File Map (Implementation Reference)

| Concern | Primary file |
|---------|--------------|
| Global tokens, grain, image interaction | `src/styles/global.css` |
| Motion, sidebar, lang toggle, layout | `src/styles/motion.css` |
| Shell, nav, lang overlay markup | `src/layouts/PageLayout.astro` |
| Hero typography & structure | `src/components/Hero.astro` |
| Section patterns | `src/components/sections/*.astro` |
| Footer | `src/components/SiteFooter.astro` |
| Scroll spy / sidebar thumb | `src/scripts/motion/scroll-spy.ts` |
| i18n copy (not visual tokens) | `src/data/translations.ts` |

---

*Draft generated from codebase scan. Awaiting approval before enforcement as the sole UI generation API.*
