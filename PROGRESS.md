# Portfolio — Progress

Running log for kathryn-portfolio.com. **Newest session entry at the top.**
Read this and `CLAUDE.md` before starting work.

## Current state

| Page | Type | Status |
|---|---|---|
| `index.html` | Home | Live. Projects grid has 3 cards; Work section has 1 card (Rituals) |
| `collatch/` | Project | Live, in nav |
| `path-at-penn/` | Project | Live, in nav |
| `piggus-nimbus/` | Project | Live, in nav |
| `alienation/` | Project | **Built (2026-08-10), not yet committed.** In nav on all 7 pages, card on home, spliced into the next-project chain |
| `outside-of-work/` | Personal | Live, in nav |
| `rituals/` | Work | **Live.** Linked from the home page Work section and the Work nav dropdown on all 6 pages |

Last published commit: `0ca3333` (2026-05-18) — add outside-of-work page and
update nav across all pages.

## Next up

- [x] **Published Rituals as the first Work entry (2026-08-08)**
  - [x] Fix its nav — was listing itself under the *Projects* dropdown, ordering
        Work before Projects, and missing the Outside of Work link (page predates
        it). Now matches the standard nav. *(2026-08-05)*
  - [x] **Imagery done (2026-08-06).** 6 photos in place, no placeholders left.
        Originals were 22MB; web versions total 2.9MB. One was `.HEIC`, which
        browsers can't display — converted to JPEG. Full-resolution originals
        backed up outside the repo (scratchpad `rituals-originals/`); the store
        shots also still live in
        `~/Desktop/UPenn/Grad School Applications/Portfolio/Images for Portfolio/`.
  - [ ] Decide on remaining unused finds: SG launch EDM, Mother's Day campaign
        creative, the "Platforms influencing purchase decisions" research chart,
        and the GTM research slide. The Strategy and Digital sections currently
        have no imagery at all.
  - [x] Home page Work section now holds a `.project-card` for Rituals, with
        `images/home-rituals-thumbnail.png` (1095x451, matching the Collatch and
        Path@Penn thumbnails).
  - [x] Work is a real nav dropdown on all 6 pages, mirroring Projects. The home
        page's `javascript:void(0)` link, its "Updates in progress" tooltip, the
        tooltip JS, and the mobile rule that hid it are all removed.
  - [x] Work cards reuse `.project-card` — same component as Projects.
- [ ] Further portfolio updates with newer projects (scope TBD)

## Rituals imagery — as built

7 photos in `rituals/images/`, each used once:

| File | Shape | Where |
|---|---|---|
| `rituals-thumbnail.jpg` | landscape | Hero |
| `rituals-expansion-3.jpg` | square | Go-to-Market, beside 01–03 |
| `rituals-expansion-1.jpg` | portrait | Brand Expansion, left photo |
| `rituals-product.jpg` | portrait | Brand Expansion, right photo (hover shows 110%) |
| `rituals-expansion-4.jpg` | portrait | Digital, beside 01–03 |
| `rituals-expansion-2.jpg` | wide | Digital, below Approach |
| `rituals-footer.jpg` | wide | Impact card, bleeds into the closing text |

Plus `images/home-rituals-thumbnail.png` (1095x451) for the home-page card.

Unused finds from the 2026-08-06 search: SG launch EDMs, Mother's Day campaign
creative, the "Platforms influencing purchase decisions" research chart, and the
GTM research slide.

## Known issues / notes

- `rituals/images/` holds 7 photos, all used exactly once. EXIF rotation is baked
  into the pixels — do not re-import from the originals without doing that again,
  or stored and displayed dimensions will disagree and every layout will size the
  images from the wrong numbers.
- The nav is duplicated across all six pages, so nav edits are always a
  six-file change. Verify with grep afterwards.
- `.DS_Store` files are tracked and permanently dirty in `git status`. Ignore them.

## Sessions

### 2026-08-10 (later) — custom cursor switched OFF site-wide

Bisection step, at Kathryn's suggestion: strip the custom cursor entirely and
confirm the native one is visible, rather than keep guessing at the artwork.

Removed from **all seven pages**:

1. `style="cursor:none"` on the `<html>` tag
2. the `<style>*,…{cursor:none!important}</style>` block in `<head>`
3. `<script src="cursor.js"></script>` before `</body>`

Verified over CDP with the GPU enabled, every page: computed `cursor` is `auto` on
both `<html>` and `<body>`, and `#cur-arrow` no longer exists. Native semantics are
back too, links report `pointer` and `.screen-carousel` reports `grab`.

`cursor.js` is left in the repo untouched, so this is a three-line-per-page revert.
See CLAUDE.md for the exact snippets. `outside-of-work` still has
`setupBeholdCursorHide()`, which references `#cur-arrow`; it is null-safe and
no-ops while the cursor is off, and is needed again if it comes back.

**Result: with all of it gone, the native cursor is visible.** So the custom cursor
was the cause, and it had already been failing before any edit this session — her
first report came before `cursor.js` was touched. The early "it is just low
contrast" read was wrong; it was never faint, it was never painted.

Kathryn wants it investigated and restored rather than abandoned, so
**`cursor-test.html`** (repo root) bisects it in a single page load. Eight probes
trail the pointer at once, each built a different way, numbered so she can report
which ones she can see:

1. plain div, solid colour, `left`/`top`
2. CSS triangle (borders)
3. inline SVG, `left`/`top` (what cursor.js does now)
4. inline SVG + `will-change: transform`
5. inline SVG + `filter: drop-shadow()`
6. inline SVG + `translate3d`
7. `<img>` data-URI SVG
8. `<img>` data-URI PNG (raster, to test the SVG pipeline independently)

Plus a separate panel using **`cursor: url(<data-uri>) 5 5, auto`** — the likely
fix, since the OS draws the cursor and no compositor is involved at all. If that
one works, port `cursor.js`'s artwork to a CSS `cursor` property and drop the DOM
element entirely; the click-glitter can stay as JS.

**Bisection result: all nine variants VISIBLE on her machine, including #3, which is
exactly what the old cursor.js did.** So the compositing theory was wrong, the SVG
theory was wrong, and the artwork was never at fault. Every round of "fixing" the
drawing was chasing the wrong thing.

The real defect was structural: the page hid the native cursor with `cursor: none`
*before* anything drew a replacement. Three things had to succeed — the inline
`<html>` style, the global `!important` block, and the script — and if the last one
didn't, the result was **no cursor at all** instead of a normal one. A design with
no fallback.

**Rebuilt on the approach her own test proved works (#9).** `cursor.js` now injects
a CSS `cursor: url(<svg data-uri>) 5 5, auto` rule instead of creating a DOM element:

- macOS draws it, so no compositing, no per-frame JS, no positioning, no hotspot maths
- **every rule ends in `, auto` or `, pointer`**, so a rejected or undecodable image
  falls back to the system cursor automatically. The old failure mode is now
  impossible to reproduce.
- pages need one line instead of three; `cursor:none` is gone from the site entirely
- interactive elements get a lighter variant so hover still gives feedback
- inputs keep `auto` and the carousel keeps `grab`, since those cursors carry meaning
- the click sparkle is unchanged
- ~60 lines of rAF/positioning/watchdog code deleted

Verified over CDP on all 7 pages: the style element is present, `body` and `a`
resolve to the image, the `, auto` fallback is intact, and no page throws.

`cursor-debug.html` and `cursor-test.html` were both deleted once resolved.

**Resolved.** With the CSS inlined the cursor appeared, confirming the stale-cache
theory: `cursor.js` had not been re-fetched for several rounds, so fixes never
reached the browser. Kathryn then asked for her **original design** back, so the
shipped artwork is the pre-session arrow exactly: 32x34, `#FF9575` over `#D45A38`,
flat, no white halo, no dark outline, one cursor everywhere, hotspot `2 2`. The
halo/outline/larger size were all debugging artefacts from when the problem was
misread as low contrast. Verified byte-identical across all seven pages.

**Then it STILL showed the system cursor**, even with `image-set()` gone. A fourth
control page (A/B/C/D over selector specificity and JS-injected vs inline
stylesheets) came back **all four coral**, proving the technique was sound and that
the test itself was flawed: strip D was styled by the test page's own script, so it
never exercised `cursor.js`.

That left one unexamined variable: **`file://` subresources can survive a hard
reload**, so Chrome may have been running a stale `cursor.js` for several rounds,
meaning fixes never reached the browser at all.

**Resolved by removing the dependency.** The cursor CSS is now **inlined into all
seven pages** as `<style id="cursor-css">`, last in `<head>`. `cursor.js` is down to
3.5KB and only draws the click sparkle, loaded as `cursor.js?v=4`. Nothing about the
cursor can now be stale, unfetched, or dependent on script execution order. This
also matches the site's existing architecture, where every page repeats its own CSS.

**THE ACTUAL BUG: an `image-set()` declaration.** `cursor.js` wrote two
declarations per rule, a plain `url()` followed by an `image-set()` line for retina.
**Chrome accepts `cursor: image-set(...)` as valid syntax, so it wins the cascade
over the plain `url()` above it, and then renders no cursor at all** — you land on
the `, auto` fallback and see the system arrow. Removing that one line fixed it.

The diagnosis came from a control page (`cursor-check.html`) offering eight cursors
side by side: `crosshair`, `wait`, `none`, PNG at 46/32/24px, SVG, and no rule.
**Kathryn reported all eight working**, including the exact PNG in the shipped build.
That was the differential: the identical image worked in a plain `url()` rule and
failed via `cursor.js`, and the only difference left was the `image-set()` line.
`getComputedStyle(body).cursor` then confirmed it, returning `image-set(...)` rather
than `url(...)`.

**Everything before this was a misdiagnosis**, and each one "verified" green:
low contrast, GPU compositing, `will-change`/`filter`, and SVG-versus-PNG. The
computed style always looked right because the declaration *was* applied; it just
never painted. Lesson recorded at the top of `cursor.js`: if the computed value of
`cursor` starts with anything other than `url(`, that is the bug.

**A superseded theory, kept because it was wrong in an instructive way:** Worth
recording precisely, because every check passed: `getComputedStyle(body).cursor`
returned the `url(...)`, and the URI even decoded as an `Image()` at 46x49. Chrome
on macOS accepts an SVG cursor through the whole pipeline and then declines to draw
it, silently landing on the `, auto` fallback. **A computed style is not proof a
cursor renders.**

SVG was suspected and the artwork was rasterised to **PNG** (1x, 46x49, quantised
to 64 colours, ~650 bytes) using headless Chrome with a transparent background
override. That did not fix it on its own, because the real cause was the
`image-set()` line. PNG is kept since it is known-good on her machine, but SVG may
well have been fine all along. The 2x images were dropped with `image-set()`; on a
retina display macOS scales the 1x image, slightly soft but correct.

Throughout all of it the `, auto` fallback held: every "not working" report was the
safety net doing its job, never a page left with no cursor.

### 2026-08-10
- Built `alienation/` — first version of the Alienation case study (IPD 5520 group
  project with Sonali Chandy and Eve Fan). Page cloned from the Piggus Nimbus
  skeleton (head + full CSS block), with a new body.
- Sections: overview / research / concept / prototype / iteration / reflection.
- Source material: `~/Desktop/School/Spring 2026/IPD 5520/Alienation/` — copy came
  from the final pitch deck and `Alienation - PRD and Summary.docx`.
- **Imagery**: all 32 screens were extracted from `Group9_Alienation_Presentation.pptx`
  (`ppt/media/*.png`), which holds the cleanest exports — better than the loose PNGs
  in `Submissions-Refined Pages/`. The mockups are RGBA with a transparent purple
  glow, so each was cropped to `alpha > 200` (device bounds) before resizing.
  Raw PNGs were 7.8MB total; quantized to 192 colours (FASTOCTREE + dither) →
  0.9MB with no visible loss at display size. Do this for any future dark screens.
- `hero.png` (2400x1000) and `images/home-alienation-thumbnail.png` (1200x500) are
  **generated composites**, not exports — deep-space gradient + stars + 4 devices,
  built in PIL. The script is not kept; regenerate from the pptx media if needed.
- Added a `.screen-carousel` (copied from collatch) and three new components in a
  second `<style>` block: `.phone-shot` (unframed — the exports carry their own
  device frame), `.assumption-row` (assumption → reality), and `.ba-row` (before/after).
- Nav updated on all 7 pages; next-project chain is now
  **collatch → path-at-penn → piggus-nimbus → alienation → collatch**.
- Copy carries two assumptions worth confirming: timeline is stated as
  "Spring 2026" (no dates in the source), and tools as "Figma, Claude Code,
  HTML/CSS/JS".
- **Galaxy theme (Alienation only).** Turned the page dark to match the app —
  a fixed `#1A0A2E → #2D1248 → #3A1540` gradient, 150 twinkling/drifting stars,
  4 nebulae and 5 shooting stars. The star, nebula and shooting-star CSS is copied
  from `alienation_challenge_prototype1.html` in the project folder rather than
  reinvented, so it matches the prototype exactly. The sky markup lives inside the
  existing `.floating-elements` fixed layer, so it holds still while the page
  scrolls, and `.cloud-shape` (the pastel blobs) is hidden. All of it sits in one
  override `<style>` block at the end of `<head>` — see CLAUDE.md for the catch
  about adding new components to that page.
- **Legibility pass, tried and then reverted at Kathryn's request.** The soft
  values measure low: cards sit at **1.14:1** against the page and body copy at
  about **4.8:1**, only just over the AA floor. A pass lifting `--surface` to
  `rgba(74,36,112,0.80)`, `--text-light` to 0.80 alpha, the hairline to 0.22 plus
  a card shadow took that to card/page 1.30:1 and body text 8.2:1, but it made the
  page look heavier and lost the atmosphere. **Kathryn preferred the softer
  original, so the theme is back to the low-contrast values on purpose.** Don't
  "fix" the contrast again without asking. If it ever needs to move, the least
  intrusive lever is `--text-light` alone (0.58 to about 0.68) while leaving the
  card surfaces translucent.
- **Voice pass.** Rewrote every description and caption on the page in first person,
  as Kathryn narrating the process ("We went looking for people who…", "Our first
  version just stacked every component in a list") instead of the flat analytical
  register it was drafted in. **Zero em dashes on this page** — colons, full stops
  and commas do the work instead. The numbered prototype steps are now
  "01. Making your alien" style, not "01 — Customizing your character".
  The home-page card blurb was rewritten to match.
  Interview quotes were left exactly as spoken.
  Note the other six pages still contain em dashes (rituals 16, path-at-penn 13,
  collatch 7, piggus 5, outside-of-work 3, home 2) — untouched, since that copy
  predates this preference. Worth a sweep if the no-dash rule is site-wide.
- **`cursor.js` (shared, affects all 7 pages):** the custom arrow was peach-on-cream
  and nearly invisible. It was rendering correctly the whole time — the problem was
  contrast, not a broken script. Added a white halo stroke plus a dark outline over
  the full silhouette, deepened both fills, and strengthened the shadow, so it reads
  on the cream background *and* on the dark app screenshots. The viewBox is now
  inset by 2 to fit the halo, with `transform: translate(-2px,-2px)` on `#cur-arrow`
  keeping the tip exactly on the pointer — **change those two together or the
  hotspot drifts.** Also bound `pointermove`/`mouseover` alongside `mousemove` so
  the arrow appears on the first pointer event instead of staying at `opacity: 0`.
- **Cursor, round two (reported missing again on the galaxy page).** Verified over
  CDP with real dispatched mouse events: the arrow tracks the pointer to **(0,0)
  px offset**, stays at `opacity: 1` over nav links, the logo, the back link, the
  hero image, the `cursor: grab` carousel, phone screenshots and the floating
  section nav, at a steady 60fps. **The disappearance could not be reproduced
  headlessly.** Changed anyway, all strictly-better and low risk:
  - `cursor.js` now positions the arrow with `translate3d` inside a single
    `requestAnimationFrame`, instead of writing `left`/`top` on every mousemove
    (which invalidated layout per pointer move). Listeners are `passive`.
  - Removed `filter: blur(60px)` from `.nebula` on the Alienation page. A moving
    blurred layer is re-rasterised every frame, four times over. **An A/B in
    headless showed no frame-time difference (16.7ms both ways), so this is not a
    proven cause** — headless uses software raster and may not be sensitive to it.
    The multi-stop radial gradients replacing it look the same.
  - Added a real guarantee: if the drawn cursor lags >250ms for 4 straight frames,
    `cursor.js` adds `.cursor-fallback` to `<html>`, which restores the native OS
    cursor and hides the custom one for the rest of that page load. So a cursor is
    always on screen even if the cause is something local (GPU, extension).
  - Added `prefers-reduced-motion` handling for the whole sky.
- **Cursor, round three, and this was the actual problem.** Kathryn clarified it as
  "almost hidden" rather than gone, which ruled out tracking and pointed at
  presence. Two real faults:
  1. **The drop shadow had never rendered.** The shadow path was drawn with
     `opacity="0.001"` so that only its `feDropShadow` output would show, but
     element opacity multiplies the filter output too, so the shadow was invisible.
     The arrow had no depth, only a thin white ring, on a busy starfield.
     Replaced with a CSS `filter: drop-shadow()` on `#cur-arrow`, which follows the
     alpha silhouette and actually works.
  2. **It was too small** at 36x38. Now **46x49**.
  `SIZE` in cursor.js is the single knob: `HEIGHT` and `HOTSPOT` are both derived
  from it, so the tip stays on the real pointer at any size (verified over CDP,
  error 0.0px). Previously the hotspot was a hardcoded `-2px` that silently
  disagreed with the artwork by ~2px.
- **Cursor, round four. Backed out every GPU-sensitive property.** Kathryn's reports
  got *worse* in step with what I added: faint → `will-change: transform` +
  `translate3d` → "almost hidden" → CSS `filter: drop-shadow()` → gone entirely.
  `filter` stacked on `will-change: transform` on a `position: fixed` element is a
  known way to get a layer that paints nothing on some Mac GPUs. **Headless Chrome
  runs `--disable-gpu` software rendering, so it structurally cannot reproduce
  this** — every green test I ran was on the one configuration immune to the bug.
  `#cur-arrow` is now deliberately boring: no `will-change`, no CSS `filter`, no 3D
  transform, plain `left`/`top` (still batched to one write per frame by the rAF,
  so there is no per-event layout cost). The shadow is baked in as plain geometry,
  a fattened silhouette nudged down-right and drawn underneath, so no filter
  primitive is involved anywhere.
  **Do not reintroduce `will-change`, `filter`, or `translate3d` on `#cur-arrow`
  and then "verify" it in headless. That test is blind to this failure.**
- **`cursor-debug.html`** (repo root) is a diagnostic that runs in the real browser:
  it reports whether `#cur-arrow` exists, its computed opacity/display/size, whether
  it is on screen, how far it is from the pointer, what element is on top of it,
  DPR, forced-colors, reduced-motion, touch-capability (cursor.js exits early on
  touch devices) and the GPU renderer string. It draws the same SVG as an inert 3x
  image to separate "artwork does not paint" from "element is not composited", and
  has toggles to switch `will-change` / `filter` / `translate3d` back on one at a
  time to isolate which one breaks it. Delete it before publishing if unwanted.
  - First report back was missing the whole `#live` table, because it only
    populated on a 250ms tick and Copy was pressed before the first tick. Now
    `update()` runs once immediately, prints a plain-English **verdict line** at
    the top, and the copied report leads with it.
  - Added two buttons for the one thing code cannot measure: whether the pixels
    reach her eyes. Those answers are stamped into the report.
  - **Confirmed environment: `ANGLE (Apple, ANGLE Metal Renderer: Apple M4)`,
    DPR 1, 1920x929, no forced-colors, no reduced-motion, not touch-capable.**
    Nothing anomalous, and the Metal backend on Apple Silicon fits the compositing
    theory. It does rule out the cheap explanations: the touch early-return,
    forced-colors mode, and reduced-motion.

### 2026-08-05
- Audited the site and found `rituals/` finished but never committed or linked.
- Wrote `CLAUDE.md` documenting the design tokens, case-study page template,
  nav conventions, and the full checklist for adding a new entry — so future
  pages reference the established pattern instead of drifting.
- Started this tracker.
- Found the real reason Rituals was never published: 12 unfilled image
  placeholders, not an oversight. Copy is done.
- Fixed the Rituals nav to match the other five pages. Verified consistency with
  a grep across all six.
- Hero copy: "Regional GM" → "Regional General Manager".
- Replaced the overview image collage with a full-bleed **horizontal gallery**
  (`.gallery-carousel-wrapper` / `.gallery-carousel` / `.gallery-track` /
  `.gallery-slide`) — one image per column, scrolls left to right. Mirrors
  `.screen-carousel` in collatch / path-at-penn.
  - First attempt broke the layout: `.reveal` and the full-bleed class were on
    the *same* element, and `.reveal`'s `transform: translateY()` overrode
    `translateX(-50%)`, so the 100vw block never shifted left and ran off the
    right edge. Fixed by moving `.reveal` to an outer div. Documented in
    CLAUDE.md.
- Added a `.phase-badge` component (Internship / Full-time) to every section
  label, so the page reads as two chapters. Internship = Go-to-Market Strategy;
  Full-time = Brand Expansion onward.
- Renamed "Retail Expansion" → "Brand Expansion", and the section id
  `sec-retail` → `sec-expansion` (updated in all three places: section id,
  section-nav href, and the scrollspy array). Nav pill now reads "Expansion".
- Rewrote "What I Did" (Brand Expansion) from plain bullets into the numbered
  `.key-insights-list` component, 5 items. Set the surrounding grid to
  `align-items: start` so the Results card no longer stretches to match.
- Rewrote "What I Did as an Intern" from plain bullets into the numbered
  `.key-insights-list` component (bold scannable lead + supporting line). Added a
  `cols-1` modifier following the existing `.gallery-row.cols-2/3` convention.
  The component was already defined in rituals but unused.

**Design-system note:** `.content` and `.content-wide` are defined identically
(`max-width: 960px`) on every case study page — `content-wide` is currently a
no-op. Worth either making it genuinely wider or removing it.
