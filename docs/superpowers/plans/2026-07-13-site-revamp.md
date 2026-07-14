# Personal Website Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all 10 pages of momin-hasson.github.io on a new editorial/warm
design system, replacing jQuery/Bootstrap/particles.js with plain CSS + vanilla
JS + GSAP + a Three.js signature hero scene, per
`docs/superpowers/specs/2026-07-13-site-revamp-design.md`.

**Architecture:** Static HTML/CSS/JS, no build step. Shared `base.css` (design
tokens) + `components.css` (nav/footer/cards/buttons) underpin all pages;
each page keeps its own `<page>.css` for layout and its own `<page>.js` for
page-specific data/behavior. `motion.js` (GSAP/ScrollTrigger) and
`hero-scene.js` (Three.js, Home only) are the only new shared behavior files.

**Tech Stack:** Plain HTML5, CSS custom properties, vanilla JS, GSAP 3 +
ScrollTrigger (CDN), Three.js (CDN), self-hosted Fraunces / Inter / JetBrains
Mono fonts.

## Global Constraints (from spec — apply to every task)

- No build step; deploys to GitHub Pages as static files exactly like today.
- Content (bios, project/experience/education data) is preserved unchanged —
  this is a visual/technical rebuild only. Existing data arrays in the
  `assets/js/*.js` files are reused, not rewritten, except to remove
  jQuery/Bootstrap API calls.
- `prefers-reduced-motion` must be respected everywhere GSAP or the Three.js
  scene is used (instant/static fallback, not just "shorter" animation).
- Every removed dependency (jQuery, Bootstrap 4, particles.js, Iconify, Font
  Awesome CDN, academicons CDN, `hover-min.css`, animated-text plugin,
  atom-spinner preloader) must have zero remaining `<script>`/`<link>`
  references anywhere in the 10 HTML files by the end of the plan.
- Design tokens (exact values, locked in below) are defined once in
  `assets/css/base.css` and must not be redefined or overridden with
  different literal values in any page CSS file.
- Every CDN `<script>` tag (GSAP, ScrollTrigger, Three.js) must include
  `integrity="sha384-..."` and `crossorigin="anonymous"` attributes using the
  exact hashes pinned in Task 3 — never load these scripts without SRI.
- No automated test framework exists or is being introduced. "Testing" per
  task means: (a) an automated sanity check (local HTTP server + `curl` for
  200 status, `grep` for absence of removed dependencies / presence of
  required elements), plus (b) a manual visual check in a real browser at
  mobile/tablet/desktop widths, done at minimum once at the end of the whole
  plan (Task 15) and spot-checked per page during that page's task.

## Design Tokens (locked in `assets/css/base.css`, Task 1)

```css
:root {
  /* color */
  --color-bg: #F6F1E7;
  --color-bg-alt: #EFE8D8;
  --color-ink: #211B14;
  --color-ink-soft: #55493C;
  --color-accent: #B8471F;
  --color-accent-soft: #E8C9B8;
  --color-blueprint: #2B4257; /* hero scene + dividers only */
  --color-line: #DCD3C0;

  /* type */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.75rem;
  --text-2xl: 2.5rem;
  --text-3xl: 3.5rem;

  /* space (4px base scale) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;
  --space-10: 8rem;

  /* layout */
  --content-width-narrow: 720px; /* research, reference */
  --content-width-wide: 1120px;  /* projects, design, experience, education */
  --radius: 4px;
}
```

Breakpoints used throughout: mobile `< 640px`, tablet `640px–1023px`, desktop
`>= 1024px`.

---

### Task 1: Foundation — fonts, design tokens, shared components, nav behavior

**Files:**
- Create: `assets/fonts/` (Fraunces, Inter, JetBrains Mono `.woff2` files)
- Create: `assets/css/base.css`
- Create: `assets/css/components.css`
- Create: `assets/js/nav.js`

**Interfaces:**
- Produces: CSS custom properties listed in "Design Tokens" above (consumed by
  every later CSS file). Shared classes consumed by every page: `.nav`,
  `.nav__link`, `.nav__link--active`, `.nav__toggle` (mobile menu button),
  `.footer`, `.footer__social`, `.btn`, `.btn--primary`, `.btn--ghost`,
  `.card`, `.tag`. `nav.js` exposes no globals; it self-initializes on
  `DOMContentLoaded` by querying `.nav__toggle` and `.nav__link`.

- [ ] **Step 1: Download and place fonts**

```bash
mkdir -p assets/fonts
curl -sL -o assets/fonts/fraunces.woff2 "https://fonts.gstatic.com/s/fraunces/v31/6NUM8FKuBmMdNJVSLwtP1e1nAfGWaXxxOX0.woff2"
curl -sL -o assets/fonts/inter.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2"
curl -sL -o assets/fonts/jetbrains-mono.woff2 "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff2"
ls -la assets/fonts/
```
Expected: three non-empty `.woff2` files listed. If any URL 404s (Google Fonts
versions do move), resolve the current URL from `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap`
by fetching that CSS and extracting the `src: url(...)` inside it before
retrying the `curl`.

- [ ] **Step 2: Write `assets/css/base.css`**

Contents: `@font-face` declarations for all three fonts pointing at
`../fonts/*.woff2` with `font-display: swap`, the `:root` token block from
"Design Tokens" above verbatim, a minimal CSS reset (`box-sizing: border-box`
on `*`, margin/padding reset on `body`/headings/lists), and base element
styles: `body { background: var(--color-bg); color: var(--color-ink);
font-family: var(--font-body); }`, `h1,h2,h3 { font-family:
var(--font-display); }`, `a { color: var(--color-accent); }`.

- [ ] **Step 3: Write `assets/css/components.css`**

Contents: `.nav` (sticky top bar, flex row, `background: var(--color-bg)`,
bottom hairline `1px solid var(--color-line)`), `.nav__link` (uses
`--font-body`, `--color-ink-soft`, underline-on-hover via
`text-decoration-color` transition, no JS needed for hover), `.nav__link--active`
(`color: var(--color-accent)`), `.nav__toggle` (hidden `>= 640px`, hamburger
button `< 640px`), `.footer` (top hairline, `--color-ink-soft` text, flex row
of `.footer__social` SVG links), `.btn`/`.btn--primary`/`.btn--ghost` (pill or
`var(--radius)` corners, `--color-accent` background/border), `.card`
(`background: var(--color-bg-alt)`, `var(--radius)`, padding `var(--space-5)`),
`.tag` (`--font-mono`, `--text-xs`, `--color-blueprint` text on
`--color-accent-soft`... — actually use a neutral `--color-line` background so
blueprint blue stays reserved for the hero/dividers per the spec).

- [ ] **Step 4: Write `assets/js/nav.js`**

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('nav__links--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.classList.add('nav__link--active');
      link.setAttribute('aria-current', 'page');
    }
  });
});
```

- [ ] **Step 5: Verify**

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/assets/css/base.css
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/assets/css/components.css
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/assets/js/nav.js
kill $SERVER_PID
```
Expected: three `200` lines.

- [ ] **Step 6: Commit**

```bash
git add assets/fonts assets/css/base.css assets/css/components.css assets/js/nav.js
git commit -m "Add design token foundation, shared components, nav behavior"
```

---

### Task 2: Motion system — GSAP setup

**Files:**
- Create: `assets/js/motion.js`

**Interfaces:**
- Consumes: GSAP + ScrollTrigger loaded globally via CDN `<script>` tags in
  each page's `<head>` (added per-page in Tasks 3–13, not here).
- Produces: `window.initReveals()` (call after DOM ready on any page — applies
  fade/slide-in to every `[data-reveal]` element via ScrollTrigger, or
  instantly shows them with no animation if
  `matchMedia('(prefers-reduced-motion: reduce)').matches`), and
  `window.initTimelineDraw(selector)` (used only on Experience/Education —
  animates a `.timeline__line` element's `scaleY` from 0 to 1 as the user
  scrolls the container matching `selector`, again instant under reduced
  motion).

- [ ] **Step 1: Write `assets/js/motion.js`**

```javascript
function initReveals() {
  const items = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  items.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
    });
  });
}

function initTimelineDraw(selector) {
  const container = document.querySelector(selector);
  const line = container ? container.querySelector('.timeline__line') : null;
  if (!container || !line) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) {
    line.style.transform = 'scaleY(1)';
    return;
  }
  gsap.set(line, { scaleY: 0, transformOrigin: 'top' });
  gsap.to(line, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top 70%',
      end: 'bottom 90%',
      scrub: true,
    },
  });
}

window.initReveals = initReveals;
window.initTimelineDraw = initTimelineDraw;
```

- [ ] **Step 2: Verify**

```bash
node --check assets/js/motion.js && echo "syntax OK"
```
Expected: `syntax OK` (catches typos before it ever loads in a page).

- [ ] **Step 3: Commit**

```bash
git add assets/js/motion.js
git commit -m "Add GSAP-based reveal and timeline-draw motion helpers"
```

---

### Task 3: Home page (`index.html`) + Three.js hero scene

**Files:**
- Modify: `index.html` (full rewrite of `<head>` and `<body>`)
- Create: `assets/css/home.css` (replaces old `assets/css/home.css` content)
- Create: `assets/js/hero-scene.js`
- Delete (now unused, confirmed at end of Task 3): `assets/css/preloader.css`,
  `assets/js/particle.js`, `assets/js/particles.min.js`,
  `assets/js/dynamicTitle.js` (superseded by `nav.js`/static title)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`).
- Produces: nothing consumed by later page tasks (Home is self-contained
  aside from the shared nav/footer markup block, which Tasks 4–13 copy from
  this task's `<body>` nav/footer HTML).

- [ ] **Step 1: Write `assets/js/hero-scene.js`**

```javascript
function initHeroScene() {
  const canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.THREE) {
    canvas.style.display = 'none';
    document.querySelector('#hero-fallback').style.display = 'block';
    return;
  }

  const isMobile = window.innerWidth < 640;
  const nodeCount = isMobile ? 14 : 28;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const nodes = [];
  const nodeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x2b4257 });
  for (let i = 0; i < nodeCount; i += 1) {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 4
    );
    nodes.push(node);
    scene.add(node);
  }

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2b4257, transparent: true, opacity: 0.35 });
  const lineGroup = new THREE.Group();
  nodes.forEach((node, i) => {
    const next = nodes[(i + 1) % nodes.length];
    const geometry = new THREE.BufferGeometry().setFromPoints([node.position, next.position]);
    lineGroup.add(new THREE.Line(geometry, lineMaterial));
  });
  scene.add(lineGroup);

  const group = new THREE.Group();
  nodes.forEach((n) => group.add(n));
  group.add(lineGroup);
  scene.add(group);

  let mouseX = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  });

  let visible = true;
  const observer = new IntersectionObserver(
    ([entry]) => { visible = entry.isIntersecting; },
    { threshold: 0 }
  );
  observer.observe(canvas);

  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    group.rotation.y += 0.0015;
    group.rotation.y += (mouseX * 0.05 - group.rotation.y) * 0.01;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  if (window.gsap) {
    gsap.from(group.scale, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'power3.out' });
  }
}

window.initHeroScene = initHeroScene;
```

- [ ] **Step 2: Write `assets/css/home.css`**

Layout for `.hero` (two-column on desktop: text left, `#hero-canvas`
right at fixed `480x480` box; single column stacked on mobile with canvas
below the text), `#hero-fallback` (hidden by default via inline
`display:none`, shown only by JS — contains a static SVG line-art version of
the same node/line motif, `<img>` from
`assets/images/home/hero-fallback.svg`), `.hero__title` (`--font-display`,
`--text-3xl`), `.hero__lede` (`--font-body`, `--text-lg`,
`--color-ink-soft`), `.hero__socials` reusing `.footer__social` link styles.

- [ ] **Step 3: Create the static fallback SVG**

Create `assets/images/home/hero-fallback.svg` — a simple hand-authored SVG
(28 small circles connected by thin lines in `#2B4257` at 35% opacity,
matching the Three.js scene's visual language) sized `480x480` viewBox.

- [ ] **Step 4: Rewrite `index.html`**

`<head>`: keep `<meta charset>`, viewport, favicon, robots meta, and the
existing Google Analytics `gtag.js` snippet unchanged. Replace
`og:site_name`/`twitter:site` values with `https://momin-hasson.github.io/`.
Remove the Bootstrap/Iconify/Font Awesome/academicons `<link>`/`<script>`
tags and `preloader.css`/`home.css`(old)/`style.css` links. Add: `<link
rel="stylesheet" href="assets/css/base.css">`, `<link rel="stylesheet"
href="assets/css/components.css">`, `<link rel="stylesheet"
href="assets/css/home.css">`.

`<body>`: `<nav class="nav">` with links to all page hrefs (`index.html`,
`education.html`, `experience.html`, `projects.html`, `design.html`,
`research.html`, `reference.html`, `event.html`) — this exact nav block is
what Tasks 4–13 copy verbatim into their own pages, only swapping the
`nav__link--active` page. Then `<main>` with `.hero` containing the existing
name/greeting copy, the "Designing, UI/UX, Cloud Computing, Web Development,
Open Source" line (kept, but replace the old canvas-text plugin with plain
static text — animated cycling text isn't part of this plan's scope), the
existing LinkedIn/GitHub social SVGs (kept as-is, just restyled via
`.footer__social`), `<canvas id="hero-canvas">`, and
`<div id="hero-fallback" style="display:none"><img src="assets/images/home/hero-fallback.svg" alt=""></div>`.
Then `<footer class="footer">` with the same social links.

Before `</body>`: GSAP core + ScrollTrigger CDN scripts, Three.js CDN script,
then in order: `assets/js/nav.js`, `assets/js/motion.js`,
`assets/js/hero-scene.js`, and a final inline
`<script>document.addEventListener('DOMContentLoaded', () => { initReveals(); initHeroScene(); });</script>`.
Keep the existing Google Analytics `gtag.js` script tag.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" integrity="sha384-g4NTh/Iv5PPU4xPyhEWqPcwtNXOvdaDI8LLnyYfyNZOjKJeYQyjzQ9X5275eBjpt" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" integrity="sha384-Z3REaz79l2IaAZqJsSABtTbhjgOUYyV3p90XNnAPCSHg3EMTz1fouunq9WZRtj3d" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" integrity="sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu" crossorigin="anonymous"></script>
```

These exact hashes (pinned against GSAP 3.12.5 and Three.js r128 as fetched
when this plan was written) must be reused verbatim in every later task that
includes these same CDN scripts (Tasks 4–13, wherever GSAP is loaded) — do
not regenerate or omit them.

- [ ] **Step 5: Delete now-unused legacy files**

```bash
rm -f assets/css/preloader.css assets/js/particle.js assets/js/particles.min.js assets/js/dynamicTitle.js
```

- [ ] **Step 6: Verify**

```bash
grep -rl "jquery\|bootstrap\|particles\|iconify\|font-awesome\|academicons" index.html
echo "exit code: $?"
```
Expected: no matches, exit code `1`.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/index.html
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/assets/css/home.css
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/assets/js/hero-scene.js
kill $SERVER_PID
```
Expected: three `200` lines. Then manually open `http://localhost:8000/index.html`
in a browser: confirm the wireframe hero scene renders and rotates, nav
links work, and toggling OS "reduce motion" shows the static SVG instead.

- [ ] **Step 7: Commit**

```bash
git add index.html assets/css/home.css assets/js/hero-scene.js assets/images/home/hero-fallback.svg
git add -u assets/css/preloader.css assets/js/particle.js assets/js/particles.min.js assets/js/dynamicTitle.js
git commit -m "Rebuild Home page with new design system and Three.js hero scene"
```

---

### Task 4: Experience page (`experience.html`)

**Files:**
- Modify: `experience.html`
- Create: `assets/css/experience.css` (replaces old content)
- Modify: `assets/js/experience.js` (remove jQuery/Bootstrap calls, keep the
  `jobs`/`volunteer` data arrays exactly as-is)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`, `initTimelineDraw('.timeline')`), the nav/footer HTML
  block from Task 3 (swap `experience.html`'s link to
  `nav__link--active`).
- Produces: `.timeline`, `.timeline__line`, `.timeline__item` classes,
  reused identically by Task 6 (Education).

- [ ] **Step 1: Inspect current `experience.js` for jQuery/Bootstrap usage**

```bash
grep -n "\$(\|jQuery\|\.modal(\|\.collapse(\|data-toggle" assets/js/experience.js
```
Note every match — these are the lines Step 2 must replace with vanilla DOM
APIs (`document.querySelector`, `classList.toggle`, etc.) while leaving the
`jobs`/`volunteer` data arrays untouched.

- [ ] **Step 2: Rewrite `assets/js/experience.js` rendering logic**

Keep the existing `jobs` and `volunteer` array literals verbatim (title,
cardImage, place, time, desp / title, subtitle, etc.). Replace the jQuery-based
render calls with vanilla template-literal rendering into
`document.querySelector('.timeline')`, one `.timeline__item` per job with a
`data-reveal` attribute, containing `.timeline__marker`, `.timeline__title`
(`title`), `.timeline__meta` (`place` + `time` in `--font-mono` `--text-xs`),
and the existing `desp` HTML (already contains `<li>` markup — insert via
`innerHTML` on a `.timeline__desc` element since it's the same trusted,
author-authored content already in the repo).

- [ ] **Step 3: Write `assets/css/experience.css`**

`.timeline` (relative-positioned column, `--content-width-wide`),
`.timeline__line` (absolute 2px-wide vertical bar, `background:
var(--color-blueprint)`, left-aligned), `.timeline__item` (padding-left
`var(--space-6)`, margin-bottom `var(--space-7)`), `.timeline__marker`
(small circle on the line, `--color-accent`), `.timeline__title`
(`--font-display`, `--text-xl`), `.timeline__meta` (`--font-mono`,
`--text-xs`, `--color-ink-soft`).

- [ ] **Step 4: Rewrite `experience.html`**

Same `<head>` pattern as Task 3 (base.css, components.css,
experience.css, corrected og/twitter meta, GA tag kept, legacy CDN links
removed). `<body>`: nav/footer block from Task 3 with `experience.html`
active, `<main>` containing `<h1>` page title, `<div class="timeline">` (JS
renders into it), same GSAP/Three-less script order as Task 3 minus
`hero-scene.js`, ending with
`<script>document.addEventListener('DOMContentLoaded', () => { initReveals(); initTimelineDraw('.timeline'); });</script>`.

- [ ] **Step 5: Verify**

```bash
grep -c "jquery\|bootstrap" experience.html assets/js/experience.js
```
Expected: `0` for both files.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/experience.html
kill $SERVER_PID
```
Expected: `200`. Manually open in browser: confirm every job from the
original `jobs` array still renders with correct title/place/time, and the
timeline line draws in on scroll.

- [ ] **Step 6: Commit**

```bash
git add experience.html assets/css/experience.css assets/js/experience.js
git commit -m "Rebuild Experience page with timeline-draw motion"
```

---

### Task 5: Projects page (`projects.html`)

**Files:**
- Modify: `projects.html`
- Create: `assets/css/project.css` (replaces old content)
- Modify: `assets/js/project.js` (remove jQuery/Bootstrap calls, keep the
  `projects` array exactly as-is, including the two known-mismatched
  descriptions flagged in the spec — not fixed per out-of-scope content rule)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`), nav/footer block from Task 3.
- Produces: `.project-grid`, `.project-card` classes (not reused elsewhere,
  but follow the same naming pattern as `.card` in components.css).

- [ ] **Step 1: Inspect current `project.js` for jQuery/Bootstrap usage**

```bash
grep -n "\$(\|jQuery\|\.modal(\|data-toggle" assets/js/project.js
```

- [ ] **Step 2: Rewrite `assets/js/project.js` rendering logic**

Keep the `projects` array verbatim. Replace jQuery rendering with vanilla
template-literal rendering into `document.querySelector('.project-grid')`,
one `.project-card` (extends `.card`) per project with `data-reveal`, showing
`cardImage` (`<img loading="lazy">`), `title` (`--font-display`, `--text-lg`),
`description`, and `Previewlink`/`Githublink` as `.btn--ghost` links (each
rendered only if the corresponding field is a non-empty string).

- [ ] **Step 3: Write `assets/css/project.css`**

`.project-grid` (CSS grid, `repeat(auto-fill, minmax(280px, 1fr))`, gap
`var(--space-6)`, max-width `var(--content-width-wide)`), `.project-card`
image styling (full-width, `var(--radius)` top corners, `aspect-ratio: 16/10;
object-fit: cover`).

- [ ] **Step 4: Rewrite `projects.html`**

Same pattern as Task 4: head links swapped to `project.css`, nav/footer block
with `projects.html` active, `<main>` with `<h1>` and `<div
class="project-grid">`, scripts ending in
`<script>document.addEventListener('DOMContentLoaded', () => { initReveals(); });</script>`.

- [ ] **Step 5: Verify**

```bash
grep -c "jquery\|bootstrap" projects.html assets/js/project.js
```
Expected: `0` for both.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/projects.html
kill $SERVER_PID
```
Expected: `200`. Manually open in browser: confirm all 6 known projects
(Biometric Panic Box, Candy Crush, Chicago Tourism Website, Recipe Ingredient
Parser, Tic Tac Toe Game, Personal Book Library) render with working
Github/Preview links where present.

- [ ] **Step 6: Commit**

```bash
git add projects.html assets/css/project.css assets/js/project.js
git commit -m "Rebuild Projects page with new card grid"
```

---

### Task 6: Education page (`education.html`)

**Files:**
- Modify: `education.html`
- Create: `assets/css/education.css` (replaces old content)
- Modify: `assets/js/education.js` (remove jQuery/Bootstrap calls, keep all
  data arrays — formal education, MOOCs, certifications — exactly as-is)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`, `initTimelineDraw('.timeline')` for the formal-education
  section only — reuses the `.timeline`/`.timeline__line` classes from Task
  4's `experience.css`, imported by reference, not redefined), nav/footer
  block from Task 3.
- Produces: `.mooc-grid`, `.cert-grid` classes for the non-chronological
  sections.

- [ ] **Step 1: Inspect current `education.js` for jQuery/Bootstrap usage**

```bash
grep -n "\$(\|jQuery\|\.modal(\|data-toggle" assets/js/education.js
```

- [ ] **Step 2: Rewrite `assets/js/education.js` rendering logic**

Keep every data array (formal education incl. College of Dupage / University
of Illinois Chicago entries, MOOCs incl. Data Science/Cryptography/Machine
Learning/etc., certifications incl. Google Developer Essentials/VM
Migration/G Suite Essentials) verbatim. Render formal education into
`.timeline` using the same `.timeline__item` structure as Task 4. Render
MOOCs into `.mooc-grid` (small `.card`s with `moocLink`). Render
certifications into `.cert-grid` (small `.card`s, image + title).

- [ ] **Step 3: Write `assets/css/education.css`**

`@import url("experience.css");` at the top (reuses `.timeline` rules
without duplication), plus `.mooc-grid`/`.cert-grid` (grid,
`repeat(auto-fill, minmax(200px, 1fr))`, gap `var(--space-5)`).

- [ ] **Step 4: Rewrite `education.html`**

Same pattern as Task 4/5: head links swapped to `education.css`, nav/footer
block with `education.html` active, `<main>` with three `<section>`s (Formal
Education, MOOCs, Certifications) each with an `<h2>`, script order ending in
`initReveals(); initTimelineDraw('.timeline');`.

- [ ] **Step 5: Verify**

```bash
grep -c "jquery\|bootstrap" education.html assets/js/education.js
```
Expected: `0` for both.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/education.html
kill $SERVER_PID
```
Expected: `200`. Manually open in browser: confirm all three sections render
with their original entries.

- [ ] **Step 6: Commit**

```bash
git add education.html assets/css/education.css assets/js/education.js
git commit -m "Rebuild Education page reusing timeline component"
```

---

### Task 7: Design page (`design.html`)

**Files:**
- Modify: `design.html`
- Create: `assets/css/design.css` (replaces old content)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`), `.project-grid`/`.project-card` classes from Task 5's
  `project.css` (imported by reference for the mockup gallery, since it's the
  same "image + title + description" shape).
- Produces: none consumed later.

- [ ] **Step 1: Confirm current mockup data source**

```bash
grep -n "mockup\|Mockups\|const " design.html assets/js/*.js | grep -i design
```
Identify whether design.html's mockup list is inline HTML or JS-driven, so
Step 2 knows whether to add a `design.js` or just restructure static markup.

- [ ] **Step 2: Rewrite `design.html`**

Preserve every existing mockup image/title/description found in Step 1,
re-marked-up using `.project-grid`/`.project-card` (via `design.css`
importing `project.css`). Head links: `base.css`, `components.css`,
`design.css`. Nav/footer block with `design.html` active. Scripts end in
`initReveals();`.

- [ ] **Step 3: Write `assets/css/design.css`**

`@import url("project.css");` plus any design-page-specific overrides (e.g.
taller aspect ratio for UI mockup screenshots vs. project thumbnails).

- [ ] **Step 4: Verify**

```bash
grep -c "jquery\|bootstrap" design.html
```
Expected: `0`.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/design.html
kill $SERVER_PID
```
Expected: `200`. Manually open in browser: confirm every mockup that existed
before the rewrite is still present.

- [ ] **Step 5: Commit**

```bash
git add design.html assets/css/design.css
git commit -m "Rebuild Design page reusing project-card component"
```

---

### Task 8: Research page (`research.html`)

**Files:**
- Modify: `research.html`
- Create: `assets/css/research.css` (replaces old content)
- Modify: `assets/js/research.js` (remove jQuery/Bootstrap calls, keep data)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`), nav/footer block from Task 3.
- Produces: `.research-list`, `.research-item` classes (single reading
  column, `--content-width-narrow`, per the spec's layout rule for
  text-heavy pages).

- [ ] **Step 1: Inspect current `research.js` for jQuery/Bootstrap usage and data shape**

```bash
grep -n "\$(\|jQuery\|\.modal(\|const \|title" assets/js/research.js | head -30
```

- [ ] **Step 2: Rewrite `assets/js/research.js` rendering logic**

Keep the existing data array verbatim. Render into
`document.querySelector('.research-list')`, one `.research-item` per entry
with `data-reveal`, using the narrow single-column reading layout.

- [ ] **Step 3: Write `assets/css/research.css`**

`.research-list` (`max-width: var(--content-width-narrow); margin: 0 auto;`),
`.research-item` (`padding-bottom: var(--space-7); border-bottom: 1px solid
var(--color-line);`), title in `--font-display`, body text in `--font-body`
`--text-base` with `line-height: 1.7` for readability.

- [ ] **Step 4: Rewrite `research.html`**

Same pattern as prior page tasks. Head links: `base.css`, `components.css`,
`research.css`. Nav/footer with `research.html` active. Scripts end in
`initReveals();`.

- [ ] **Step 5: Verify**

```bash
grep -c "jquery\|bootstrap" research.html assets/js/research.js
```
Expected: `0` for both.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/research.html
kill $SERVER_PID
```
Expected: `200`. Manually open in browser: confirm all research entries
render and the reading column is comfortably narrow on desktop.

- [ ] **Step 6: Commit**

```bash
git add research.html assets/css/research.css assets/js/research.js
git commit -m "Rebuild Research page with narrow reading-column layout"
```

---

### Task 9: Reference page (`reference.html`)

**Files:**
- Modify: `reference.html`
- Create: `assets/css/references.css` (replaces old content)
- Modify: `assets/js/references.js` (remove jQuery/Bootstrap calls, keep data)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`), `.research-list`/`.research-item` classes from Task 8
  (imported by reference — references are also a narrow text list).
- Produces: none consumed later.

- [ ] **Step 1: Inspect current `references.js` for jQuery/Bootstrap usage and data shape**

```bash
grep -n "\$(\|jQuery\|\.modal(\|const \|name\|quote" assets/js/references.js | head -30
```

- [ ] **Step 2: Rewrite `assets/js/references.js` rendering logic**

Keep the existing data array verbatim. Render into a `.research-list`
container (reused class) with `.research-item` entries (name, title/company,
quote/description — whatever fields Step 1 found), each with `data-reveal`.

- [ ] **Step 3: Write `assets/css/references.css`**

`@import url("research.css");` plus any reference-specific override (e.g. a
`.research-item__quote` style in italic `--font-display` if references
include testimonial-style quotes).

- [ ] **Step 4: Rewrite `reference.html`**

Same pattern as prior tasks. Head links: `base.css`, `components.css`,
`references.css`. Nav/footer with `reference.html` active. Scripts end in
`initReveals();`.

- [ ] **Step 5: Verify**

```bash
grep -c "jquery\|bootstrap" reference.html assets/js/references.js
```
Expected: `0` for both.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/reference.html
kill $SERVER_PID
```
Expected: `200`. Manually open in browser: confirm all references render.

- [ ] **Step 6: Commit**

```bash
git add reference.html assets/css/references.css assets/js/references.js
git commit -m "Rebuild Reference page reusing research list component"
```

---

### Task 10: Event page (`event.html`)

**Files:**
- Modify: `event.html`
- Create: `assets/css/event.css` (replaces old content)
- Modify: `assets/js/event.js` (remove jQuery/Bootstrap calls, keep data)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`), `.project-grid`/`.project-card` classes from Task 5
  (events are card-shaped: image + title + date, same as a project card).
- Produces: none consumed later.

- [ ] **Step 1: Inspect current `event.js` for jQuery/Bootstrap usage and data shape**

```bash
grep -n "\$(\|jQuery\|\.modal(\|const " assets/js/event.js
```

- [ ] **Step 2: Rewrite `assets/js/event.js` rendering logic**

Keep the existing data verbatim. Render into `.project-grid` using
`.project-card` markup (reused), each with `data-reveal`.

- [ ] **Step 3: Write `assets/css/event.css`**

`@import url("project.css");` plus event-specific overrides only if Step 1's
data shape needs a field `.project-card` doesn't already support (e.g. a
date badge — add `.project-card__date` in that case).

- [ ] **Step 4: Rewrite `event.html`**

Same pattern as prior tasks. Head links: `base.css`, `components.css`,
`event.css`. Nav/footer — note `event.html` is not in the main nav list from
Task 3 (per spec, only 8 pages are in nav); link to it only from wherever it
was linked before (check `grep -rn "event.html" *.html` before removing any
existing entry point).

- [ ] **Step 5: Verify**

```bash
grep -c "jquery\|bootstrap" event.html assets/js/event.js
```
Expected: `0` for both.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/event.html
kill $SERVER_PID
```
Expected: `200`. Manually open in browser: confirm events render.

- [ ] **Step 6: Commit**

```bash
git add event.html assets/css/event.css assets/js/event.js
git commit -m "Rebuild Event page reusing project-card component"
```

---

### Task 11: `sem_temp.html` page

**Files:**
- Modify: `sem_temp.html`
- Create: `assets/css/sem_temp.css` (replaces old content)
- Modify: `assets/js/sem_temp.js` (remove jQuery/Bootstrap calls, keep data)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`), reuses whichever prior component (`.research-list` or
  `.project-grid`) matches the page's actual content shape — determine in
  Step 1.
- Produces: none consumed later.

- [ ] **Step 1: Determine current content shape**

```bash
grep -n "const \|title\|<h" sem_temp.html assets/js/sem_temp.js | head -30
```
Confirm whether this is list-shaped (use `.research-list`) or card-shaped
(use `.project-grid`) content, and note any jQuery/Bootstrap calls to remove.

- [ ] **Step 2: Rewrite `assets/js/sem_temp.js` rendering logic**

Keep existing data verbatim, render using whichever shared component Step 1
identified, each item with `data-reveal`.

- [ ] **Step 3: Write `assets/css/sem_temp.css`**

`@import` the matching shared page CSS (`research.css` or `project.css`)
plus only page-specific overrides.

- [ ] **Step 4: Rewrite `sem_temp.html`**

Same pattern as prior tasks. Head links: `base.css`, `components.css`,
`sem_temp.css`. Since this page isn't in the main nav (per spec, unlinked
temp page), keep nav/footer block but without a `nav__link--active` match —
that's expected and correct.

- [ ] **Step 5: Verify**

```bash
grep -c "jquery\|bootstrap" sem_temp.html assets/js/sem_temp.js
```
Expected: `0` for both.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/sem_temp.html
kill $SERVER_PID
```
Expected: `200`.

- [ ] **Step 6: Commit**

```bash
git add sem_temp.html assets/css/sem_temp.css assets/js/sem_temp.js
git commit -m "Rebuild sem_temp page on new design system"
```

---

### Task 12: `travel_temp.html` page

**Files:**
- Modify: `travel_temp.html`
- Create: `assets/css/travel_temp.css` (replaces old content)
- Modify: `assets/js/travel_temp.js` (remove jQuery/Bootstrap calls, keep data)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`, `motion.js`
  (`initReveals()`), reuses `.project-grid`/`.project-card` (travel photos are
  card-shaped: image + place + description, per the existing "Trip to New
  Delhi" heading found during spec research).
- Produces: none consumed later.

- [ ] **Step 1: Inspect current `travel_temp.js` for jQuery/Bootstrap usage and data shape**

```bash
grep -n "\$(\|jQuery\|\.modal(\|const " assets/js/travel_temp.js
```

- [ ] **Step 2: Rewrite `assets/js/travel_temp.js` rendering logic**

Keep existing data verbatim, render into `.project-grid` using
`.project-card` markup, each with `data-reveal`.

- [ ] **Step 3: Write `assets/css/travel_temp.css`**

`@import url("project.css");` plus travel-specific overrides only if needed.

- [ ] **Step 4: Rewrite `travel_temp.html`**

Same pattern as Task 11 — unlinked temp page, nav/footer block present but
no active nav match expected.

- [ ] **Step 5: Verify**

```bash
grep -c "jquery\|bootstrap" travel_temp.html assets/js/travel_temp.js
```
Expected: `0` for both.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/travel_temp.html
kill $SERVER_PID
```
Expected: `200`.

- [ ] **Step 6: Commit**

```bash
git add travel_temp.html assets/css/travel_temp.css assets/js/travel_temp.js
git commit -m "Rebuild travel_temp page on new design system"
```

---

### Task 13: 404 page

**Files:**
- Modify: `404.html`
- Create: `assets/css/404.css` (replaces old content)
- Modify: `assets/js/404.js` (remove jQuery/Bootstrap calls if any)

**Interfaces:**
- Consumes: `base.css`, `components.css`, `nav.js`.
- Produces: none.

- [ ] **Step 1: Inspect current `404.html`/`404.js`**

```bash
grep -n "\$(\|jQuery\|\.modal(" 404.html assets/js/404.js
```

- [ ] **Step 2: Rewrite `404.html`**

Simple centered layout: `.hero__title`-style "404" in `--font-display`
`--text-3xl`, a short message, and a `.btn--primary` link back to
`index.html`. Head links: `base.css`, `components.css`, `404.css`. Include
nav/footer block for consistency.

- [ ] **Step 3: Write `assets/css/404.css`**

Centered flex column, full viewport height, generous vertical spacing using
`--space-9`.

- [ ] **Step 4: Verify**

```bash
grep -c "jquery\|bootstrap" 404.html
```
Expected: `0`.

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/404.html
kill $SERVER_PID
```
Expected: `200`.

- [ ] **Step 5: Commit**

```bash
git add 404.html assets/css/404.css assets/js/404.js
git commit -m "Restyle 404 page on new design system"
```

---

### Task 14: Repo cleanup

**Files:**
- Modify: `README.md`
- Delete: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- Modify: any remaining `<meta property="og:*">`/`<meta name="twitter:*">`
  tags across the 10 HTML files not already fixed in their page task

**Interfaces:** none — this task only touches docs/meta, not shared code.

- [ ] **Step 1: Rewrite `README.md`**

Describe this as Momin Hasson's personal portfolio site (name, what it
showcases: education/experience/projects/design/research), tech stack
(plain HTML/CSS/JS, GSAP, Three.js), and how to run locally (`python3 -m
http.server` from the repo root). Remove "free portfolio template for
everyone" open-source-template framing.

- [ ] **Step 2: Remove template artifacts**

```bash
git rm CONTRIBUTING.md CODE_OF_CONDUCT.md
```

- [ ] **Step 3: Sweep for any remaining stale meta references**

```bash
grep -rn "smaranjitghose" *.html
```
Expected after this step: no matches. Fix any found by replacing with
`https://momin-hasson.github.io/`.

- [ ] **Step 4: Verify**

```bash
grep -rln "jquery\|bootstrap\|particles\|iconify\|font-awesome\|academicons\|smaranjitghose" *.html assets/js/*.js assets/css/*.css
```
Expected: no output (empty).

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "Clean up repo docs and stale template metadata"
```

---

### Task 15: Full local run and final verification

**Files:** none created/modified — verification only.

- [ ] **Step 1: Serve the whole site locally**

```bash
cd /Users/typhoon/Documents/Momin-Hasson.github.io
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
```

- [ ] **Step 2: Automated smoke check of every page**

```bash
for page in index.html education.html experience.html projects.html design.html research.html reference.html event.html sem_temp.html travel_temp.html 404.html; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/$page")
  echo "$page -> $code"
done
```
Expected: `200` for every page.

- [ ] **Step 3: Repo-wide dependency sweep**

```bash
grep -rln "jquery\|bootstrap\|particles.js\|iconify\|font-awesome\|academicons" *.html assets/css/*.css assets/js/*.js
```
Expected: no output.

- [ ] **Step 4: Manual visual pass in a real browser**

Open `http://localhost:8000/index.html` and click through the nav to every
page. At each page, resize to ~375px (mobile), ~768px (tablet), and
~1440px (desktop) and confirm: no horizontal scroll, nav collapses to the
mobile toggle below 640px and expands correctly, text is legible, images
load, and (Home only) the Three.js hero scene renders and responds to mouse
movement, then confirm it falls back to the static SVG when the OS
"reduce motion" setting is enabled.

- [ ] **Step 5: Check console for errors**

While the manual pass is happening, check the browser devtools console on
each page for JS errors (in particular: confirm nothing still references
`jQuery`, `$`, or `bootstrap` as globals).

- [ ] **Step 6: Stop the local server**

```bash
kill $SERVER_PID
```

- [ ] **Step 7: Final commit (only if Step 4/5 turned up fixes)**

If the manual pass found issues, fix them in the relevant page's files, then:

```bash
git add -u
git commit -m "Fix issues found during full-site local verification pass"
```

If no issues were found, this task requires no commit — the plan is complete.
