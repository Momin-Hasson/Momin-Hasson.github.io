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

## 1. Visual Design System

Direction: **editorial / warm** — feels like a well-designed personal site or
magazine rather than a tech dashboard or SaaS product.

- **Palette**: warm off-white background (`#FAF6F0`), near-black ink text
  (`#1F1B16`), one primary accent — muted terracotta/rust (`#C1502E`) — used for
  links, tags, highlights, and hover states. A secondary muted sage/olive accent
  may be used sparingly for variety (tags, dividers) but terracotta remains
  primary.
- **Type**: serif display face (Fraunces or Source Serif 4, self-hosted under
  `assets/fonts/`) for name/headings, paired with a clean sans (Inter, also
  self-hosted) for body copy and UI chrome (nav, buttons, captions).
- **Layout**: generous whitespace; text-heavy pages (research, reference) use a
  single reading column (~680–760px); gallery/list pages (projects, design,
  experience, education) use a wider responsive grid.
- **Motion**: subtle fade/slide-in on scroll via `IntersectionObserver`. No
  particle backgrounds, no preloader spinner, no animated typing effect unless
  reimplemented lightly in vanilla JS.
- **Icons**: small hand-picked inline SVGs (social links, arrows, tags) instead
  of Font Awesome/Iconify/academicons CDN dependencies.

## 2. Technical Approach

Stays plain static HTML/CSS/JS, no build step, deploys to GitHub Pages exactly as
today.

**Removed dependencies**: jQuery, Bootstrap 4, particles.js, particles config,
Iconify, Font Awesome CDN, academicons CDN, `hover-min.css`, the animated-text
plugin, the atom-spinner preloader.

**New shared files**:
- `assets/css/base.css` — design tokens (color/type/spacing custom properties),
  resets, base element styles.
- `assets/css/components.css` — shared nav, footer, buttons, cards, tags, social
  icons.
- `assets/css/<page>.css` — one per page, page-specific layout only (replaces
  the current per-page CSS files, same naming convention).
- `assets/js/nav.js` — mobile menu toggle, active-link highlighting.
- `assets/js/reveal.js` — scroll-triggered fade/slide-in animations.

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
