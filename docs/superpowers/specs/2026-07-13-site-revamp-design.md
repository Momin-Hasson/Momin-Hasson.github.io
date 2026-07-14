# Personal Website Revamp — Design Spec

Date: 2026-07-13

## Purpose

Modernize the visual design and underlying code of momin-hasson.github.io. The site
is currently a customized fork of an open-source portfolio template built on
jQuery, Bootstrap 4, particles.js, and per-page CSS/JS files with no shared design
system. Content and page structure stay the same — this is a visual and technical
rebuild, not a content rewrite.

## Scope

All 10 existing HTML pages are rebuilt on the new design system:

- `index.html` (Home)
- `education.html`
- `experience.html`
- `projects.html`
- `design.html`
- `research.html`
- `reference.html`
- `event.html`
- `sem_temp.html`
- `travel_temp.html`
- `404.html` (restyled to match)

`sem_temp.html` and `travel_temp.html` are rebuilt like the rest but left as
currently linked (unlinked/temp) — no new nav entries are added for them unless
requested later.

Out of scope: rewriting bio/project/experience copy, adding new sections, backend
or CMS integration, moving to a framework/build step.

**Note on real content found while reviewing the pages**: two project cards in
`projects.html` have mismatched descriptions from an old template edit
("Candy Crush" is described as a chess engine; "Chicago Tourism Website" is
described as a Flappy Bird clone). Since content edits are out of scope, these
are carried over as-is — flag if you'd like them fixed as a quick aside.

## 1. Visual Design System

Direction: **editorial / warm**, grounded in what the content actually is —
Momin's real work is backend/API and cloud engineering (responsive APIs,
microservices, VM migration, distributed systems coursework), not generic
"portfolio" filler. The signature element below is built from that, not from a
stock hero formula.

- **Palette**: warm paper background (`#F6F1E7`), near-black warm ink
  (`#211B14`) for text, one primary accent — a deep rust/terracotta
  (`#B8471F`) — used for links, tags, and highlights. A second accent, an
  ink-blue (`#2B4257`), is pulled specifically from the "blueprint/schematic"
  signature concept below and used only in the hero's line art and section
  dividers, so it reads as intentional rather than decorative variety.
- **Type**: serif display face (Fraunces, self-hosted) for name/headings,
  paired with Inter for body copy and UI chrome. A monospace face (e.g. JetBrains
  Mono, self-hosted) is used sparingly for labels tied to technical content —
  API names, stack tags, dates — reinforcing the engineering subject matter
  instead of decorating randomly.
- **Layout**: generous whitespace; text-heavy pages (research, reference) use a
  single reading column (~680–760px); gallery/list pages (projects, design,
  experience, education) use a wider responsive grid.
- **Signature element (hero, Home page)**: a Three.js scene rendering a thin
  wireframe "network" — nodes and arcing connector lines drawn in the ink-blue
  accent against the paper background — evoking the distributed systems/API
  work described on the Experience and Education pages. It rotates slowly and
  drifts subtly with cursor position; GSAP drives the page-load entrance
  (nodes/lines draw themselves in) rather than just appearing. This is the one
  bold risk on the page — everything else stays quiet so it lands.
- **Motion (GSAP)**: GSAP + ScrollTrigger replace vanilla scroll handling
  everywhere — orchestrated hero load sequence on Home, scroll-triggered
  reveals for section entrances, and a timeline-draw animation for the
  Experience/Education chronological lists (a line that extends as you scroll,
  since those pages are genuinely sequential — this is the one place numbered/
  ordered structure is actually justified by the content).
- **Icons**: small hand-picked inline SVGs (social links, arrows, tags) instead
  of Font Awesome/Iconify/academicons CDN dependencies.

## 2. Technical Approach

Stays plain static HTML/CSS/JS, no build step, deploys to GitHub Pages exactly as
today. GSAP and Three.js are added via CDN `<script>` tags (same pattern as the
current jQuery/Bootstrap CDN includes) — no bundler introduced.

**Removed dependencies**: jQuery, Bootstrap 4, particles.js, particles config,
Iconify, Font Awesome CDN, academicons CDN, `hover-min.css`, the animated-text
plugin, the atom-spinner preloader.

**Added dependencies**: GSAP core + ScrollTrigger plugin (CDN), Three.js (CDN),
used only where listed above — not applied indiscriminately across every page.

**New shared files**:
- `assets/css/base.css` — design tokens (color/type/spacing custom properties),
  resets, base element styles.
- `assets/css/components.css` — shared nav, footer, buttons, cards, tags, social
  icons.
- `assets/css/<page>.css` — one per page, page-specific layout only (replaces
  the current per-page CSS files, same naming convention).
- `assets/js/nav.js` — mobile menu toggle, active-link highlighting.
- `assets/js/motion.js` — GSAP/ScrollTrigger setup: reveals, timeline-draw,
  hero entrance sequencing.
- `assets/js/hero-scene.js` — Three.js wireframe network scene (Home only).

**Performance & accessibility guardrails for the Three.js/GSAP additions**:
- The Three.js scene loads only on Home, is paused via `IntersectionObserver`
  when scrolled out of view, caps `devicePixelRatio` at 2, and uses simple line/
  point geometry (no textures, no heavy models) to stay light on low-end
  devices.
- `prefers-reduced-motion` is respected: the Three.js scene falls back to a
  static SVG rendering of the same line art, and GSAP scroll reveals fall back
  to an instant, non-animated state.
- On narrow/mobile viewports the hero scene renders at reduced complexity
  (fewer nodes) rather than being disabled outright, so mobile still gets the
  signature look, just cheaper to render.

Existing per-page JS files (`education.js`, `experience.js`, `project.js`,
`references.js`, `research.js`, `event.js`, `sem_temp.js`, `travel_temp.js`)
are rewritten in vanilla JS where they currently depend on jQuery/Bootstrap, kept
where logic is already framework-independent (e.g. simple DOM toggles).

Nav and footer markup is duplicated as static HTML across the 10 pages (no
includes/build step) — kept short enough to update by hand across files when it
changes.

Google Analytics tag, favicon, `robots.txt`, and `.gitattributes` behavior are
preserved unchanged.

## 3. Content Cleanup

- `README.md` rewritten to describe this as Momin Hasson's personal site (not a
  "free portfolio template for everyone" boilerplate description left over from
  the fork).
- `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` removed — these are open-source
  project artifacts that don't apply to a personal site repo.
- `LICENSE` kept as-is.
- Stale/broken references in page `<meta>` tags (e.g. `og:site_name` and
  `twitter:site` currently pointing at `portfolio.smaranjitghose.codes`, the
  original template author's domain) corrected to point at
  `momin-hasson.github.io`.

## 4. Rollout / Migration

Pages are rebuilt one at a time (home first, since it's the entry point and
establishes the design system in practice), each fully replacing its old
HTML/CSS/JS trio before moving to the next page. This keeps the site in a
working, deployable state after every step rather than a single big-bang commit.

Order: Home → Experience → Projects → Education → Design → Research → Reference
→ Event → sem_temp → travel_temp → 404.

## 5. Testing / Verification

No test suite (static site). Verification per page:
- Open in browser, visually confirm layout at mobile (~375px), tablet (~768px),
  and desktop (~1440px) widths.
- Confirm no console errors after removing jQuery/Bootstrap (watch for other
  scripts silently depending on them).
- Confirm nav links and footer social links resolve correctly across all pages.
- Confirm Google Analytics tag still fires (network tab check).
- On Home: confirm the Three.js hero scene renders, pauses when scrolled out of
  view, and degrades to the static SVG fallback under `prefers-reduced-motion`.
- Confirm GSAP ScrollTrigger reveals and the Experience/Education timeline-draw
  animation fire correctly on scroll and don't jank on mid-range mobile.

## Note on process

This spec was shaped using the frontend-design skill's approach: choices above
(palette, type pairing, and especially the wireframe-network signature element)
are derived from Momin's actual content — API/backend/cloud work — rather than
a generic portfolio template, to avoid landing on the generic "warm cream +
serif + terracotta" look this exact palette could otherwise default to.
