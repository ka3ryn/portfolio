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
