# Kathryn's Portfolio — Project Guide

Personal portfolio site. Static HTML/CSS/JS, no build step, no framework, no
dependencies. Deployed via GitHub Pages from `main` to **kathryn-portfolio.com**
(see `CNAME`). Remote: `git@github.com:ka3ryn/portfolio.git`.

**Read `PROGRESS.md` before starting work** — it holds current state and the
running "Next up" list.

## Ground rules

- **No frameworks, no build tooling, no npm.** Every page is a single
  self-contained `.html` file with its CSS in an inline `<style>` block.
  Don't introduce React, Tailwind, a bundler, or a CSS file per page.
- **Each page repeats the shared CSS.** There is no shared stylesheet. When a
  token or shared component changes, it must be updated in *every* page. This is
  the site's main maintenance hazard — see "Cross-page consistency" below.
- **`cursor.js` is the only shared script**, loaded by every page. It draws the
  click sparkle only; the cursor artwork is inlined per page (see Cursor below).
- Open the file in a browser to check work. There's nothing to compile or serve.

## Structure

```
index.html            Home: hero → Projects grid → Work → Contact → Footer
collatch/             Project case study
path-at-penn/         Project case study
piggus-nimbus/        Project case study
rituals/              Work case study (Valiram → Rituals Cosmetics)
outside-of-work/      Personal page (foodieforthebelly)
images/               Home-page images only (thumbnails, logos, headshot)
<page>/images/        That page's own images
cursor.js             Click sparkle, shared by all pages
favicon.svg           Shared favicon
CNAME                 Custom domain
```

Subpages live one level deep and link back with `../`. Keep that depth — deeper
nesting would break every relative path in the shared nav.

**Image naming** — each page owns a flat `images/` folder. Files are lowercase
kebab-case, grouped by section: a bare `hero`, then `<group>-<n>`
(`fftb-1`, `dc1-screen-3`) or `<group>-<descriptor>` (`gallery-build`,
`process-wiring`). Each page also carries `<slug>-thumbnail` for its home-page
card. Use `.png` for screens, UI, and graphics; `.jpg` for photography.

## Design tokens

Defined in `:root` at the top of every page's `<style>`. Use the variables, never
raw hex, for anything that maps to a token:

```css
--bg: #FAFAF8;        --text: #1a1a1a;      --text-light: #6b6b6b;
--accent: #E8735A;    --accent-soft: #F4D1CB;
--lavender: #C8B6E2;  --sky: #A8D8EA;       --peach: #FFDAB9;
--sage: #C5D5CB;      --cream: #FFF8F0;     --cloud: rgba(200,182,226,0.08);
```

**Alienation is the one dark page.** `alienation/` carries the shared light CSS
block like every other page, then overrides it with a **galaxy theme** in a final
`<style>` block that must stay last in `<head>` — it redefines the `:root` tokens
(`--bg: #0D0620`, `--text: #FFD4E0`, `--accent: #FF8FA8`, …) plus every hardcoded
light surface (`background: white` on `.insight-card`, `.feedback-card`,
`.conclusion-block`, `.hmw-block`, `.user-story`, `.gallery-item`, `.learning-item`,
`.dropdown`, `.skill-pill-sm`, and `#f4f4f2` on `.ba-row`). If you add a component
to that page, give it a dark override there too, or it will render as a white card
on a purple background. The star field, nebulae and shooting stars come from the
Alienation prototype and live inside the existing `.floating-elements` fixed layer,
so they stay put while the page scrolls.

**Fonts** — Playfair Display (headings, and italic for emphasis) + DM Sans (body),
both from Google Fonts via one `<link>` in the `<head>`. Copy the existing link
tag verbatim; it carries the specific weights and optical sizes the pages use.

**Breakpoints** — only two, `@media (max-width: 768px)` and
`@media (max-width: 480px)`. Don't add a third.

**Width containers** — body copy sits in `.content`, `padding: 0 48px`.
`max-width` is 960px everywhere except rituals, which uses 1200px. To break an element out to full width, use the established
escape trick rather than inventing one:

```css
width: 100vw; position: relative; left: 50%; transform: translateX(-50%);
```

Used by `.screen-carousel-wrapper` (collatch, path-at-penn). **Use it sparingly.**
`100vw` includes the vertical scrollbar, so a full-bleed element is wider than the
real content area and pushes the whole page off centre — this happened on rituals
and took a while to find. `body` sets `overflow-x: hidden`, which hides the
scrollbar but not the off-centring. If a section doesn't truly need to touch the
screen edge, lay it out inside `.content` instead.
Note `.content-wide` is currently defined identically to `.content` and does
nothing; don't reach for it expecting extra width.

**Never put `.reveal` on a full-bleed element.** `.reveal` animates `transform`
(`translateY(30px)` → `translateY(0)`), which silently overrides the
`translateX(-50%)` the escape trick depends on — the element stays full width but
never shifts left, so it runs off the right edge. Put `.reveal` on an outer
wrapper and the full-bleed class on a child, the way collatch does.

**Horizontal galleries** — for a row of images that scrolls left to right, one
per column, follow the carousel pattern: full-bleed wrapper → scroll container
(`overflow-x: auto`, `scroll-snap-type: x proximity`) → `display: flex;
width: max-content` track → fixed-width slides with `scroll-snap-align: start`.
Scrolling is native (trackpad / shift+wheel / scrollbar); there is no drag-to-
scroll JS anywhere on the site, and `cursor: grab` is decorative.

**Visual character** — soft pastel butterfly/sparkle motif. Recurring devices:
inline butterfly SVGs (`viewBox="0 0 48 40"`), `.section-aura` radial-gradient
blobs positioned absolutely behind sections, `.reveal` scroll-in animation driven
by an IntersectionObserver at the bottom of each page. New sections should use
`.reveal` so they animate in like everything else.

**Cursor** — Kathryn's original arrow: 32x34, `#FF9575` light face over `#D45A38`
dark face, flat, no outline, **one cursor everywhere**. Shipped as a single CSS rule
`html, body, * { cursor: url(<png data-uri>) 2 2, auto; }`, **inlined into every
page** as `<style id="cursor-css">`, kept last in `<head>` so it wins ties on source
order. Hotspot `2 2` is the arrow tip. `cursor.js` no longer owns the cursor at all;
it only draws the click sparkle, and pages load it as
`<script src="../cursor.js?v=4"></script>` (no `../` on the home page).

The PNG is the original SVG rasterised through headless Chrome with a transparent
background override. Keep the design as-is unless Kathryn asks: a white halo and a
heavier outline were tried during debugging and she wanted the original back.

It is inline rather than in the shared script for a reason: `file://` subresources
can survive a hard reload, so a stale cached `cursor.js` made it impossible to tell
whether a fix had reached the browser. Inline CSS always ships with the page.
Changing the artwork means editing all seven pages, which matches how the rest of
this site already works.

Three rules, learned expensively in Aug 2026:

1. **Never hide the native cursor first.** The original design put `cursor: none`
   on `<html>` plus a global `!important` block and drew a `<div>` arrow from JS.
   Any failure in that chain left *no cursor at all*. Every rule now ends in
   `, auto` or `, pointer`, so a rejected image degrades to the system cursor.
2. **One plain `url()` per rule, never `image-set()`.** Chrome accepts
   `cursor: image-set(...)` as valid syntax, so it beats a plain `url()` before it
   and then paints nothing.
3. **A computed `cursor` of `url(...)` does not prove the cursor renders.** It only
   proves the declaration won. Confirm with a human looking at the screen; headless
   Chrome cannot show you a cursor at all.

`outside-of-work` still has a `setupBeholdCursorHide()` helper that looks for
`#cur-arrow`; that element no longer exists, so it null-checks and no-ops.

## Case study page template

Every case study follows the same skeleton. Match it rather than inventing a new
layout:

```
<section class="project-hero">          title, subtitle, meta (role/timeline/tools)
<section class="case-section" id="sec-overview">
<section class="case-section" id="sec-...">   as many as the story needs
<section class="next-project">          link to the next case study
```

Section ids are `sec-<name>` and vary by project — Collatch uses overview /
solution / research / ideation / wireframes / final / appendix; Piggus Nimbus
uses overview / problem / process / challenges / reflection. Pick ids that fit
the actual story; don't force one project's outline onto another.

`next-project` chains the Projects pages in a loop:
**collatch → path-at-penn → piggus-nimbus → collatch**. When adding a project,
splice it into the loop and fix the neighbour that used to point past it.

## Adding a new entry

A new case study is **not** done when the page exists. All of these are required:

1. Create `<slug>/index.html` from the template above, plus `<slug>/images/`.
2. Add a card to the home page grid — the `.project-card` markup (thumbnail,
   `.project-type-badge`, title, `.project-desc`, `.skill-pill-sm` pills,
   `.project-arrow`). Copy an existing card and edit it.
3. Add a `~1200px`-wide thumbnail to `images/` named
   `home-<slug>-thumbnail.png`, referenced by the card.
4. Add it to the nav on **every** page (see below).
5. Splice it into the `next-project` chain.

## Cross-page consistency

The nav is duplicated in all six pages. The current correct order is:

**Projects** (dropdown: Collatch, Path@Penn, Piggus Nimbus) → **Work** → **Outside of Work**

Projects entries are design/build case studies. Work entries are professional
roles. Put a new page under the heading that matches what it actually is — a
Work case study does not belong in the Projects dropdown.

The Work dropdown currently holds Rituals Cosmetics. Both Projects and Work are
`.has-dropdown` list items with a nested `<ul class="dropdown">`; the current page
marks itself with `class="dropdown-active"` on its own entry.

**Any nav change means editing all six pages.** Same for token changes and shared
component tweaks. After such a change, verify with a grep across pages rather
than assuming, e.g.:

```
grep -c 'outside-of-work/' */index.html index.html
```

## Committing

Small, descriptive, lowercase commit messages in the existing style
("add outside-of-work page and update nav across all pages"). Pushing to `main`
publishes to the live domain, so only push when the change is meant to be public.

`.DS_Store` files are tracked and show up as noise in `git status`. Leave them
alone; don't sweep them into unrelated commits.
