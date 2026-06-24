# ATFA Design System

**ATFA** — *A Thing For Art* — is a family office / art-distribution platform focused on the discovery, development, and distribution of African-based art and design. Its brand posture sits at the intersection of cultural curation, narrative-led commerce, and contemporary fine-art publishing.

> Their definitive objective, stated on the brand guidelines cover:
> **"Every Wall Should Hold A Work of Art."**

## Sub-brands

ATFA operates a **master brand + two sub-brands** structure. From the official Brand Guidelines:

1. **ATFA — A Thing For Art** — the parent family office. Primary "ATFA" wordmark with the red dot; full-color preferred.
2. **.art** — the digital/editorial imprint. Logo is a red dot followed by lowercase "art". Treated with more creative licence, peach surfaces, freer use of the swirl pattern.
3. **carsl.** — lowercase-wordmark sub-brand, ends in the signature red dot. Mentioned throughout as a named program.

Named ATFA program lines (used as wide-tracked labels, not sub-brands):
**RESIDENCIES · SALONS · EXHIBITIONS · INTERVIEWS · EDITIONS**

## Sources (reference, not shipped)

- **Figma** — `ATFA MEDIA.fig` (mounted, 3 pages, 338 frames). The Brand Guidelines section (`/Page-1/Brand-Guidelines`) is the canonical reference — colors, clear-space rules, distribution percentages, tone, patterns, typography all defined there.
- Additional frames used: `/Page-1/ATFA-Banner`, `/Page-1/Business-Card`, `/Page-1/Social-Media`, `/Page-1/Slide-16-9---1`, `/Page-1/Slide-4-3---1`.
- No codebase attached.

---

## Content Fundamentals

ATFA writes like a **curator**, not a marketer. Copy is first-person-plural ("we") when speaking as the organisation, third-person when speaking *about* art. Second-person "you" is rare and reserved for direct instruction.

**Tone:** quiet authority, composed, culturally literate. Avoids hype. Avoids emoji entirely. No exclamation points.

**Voice rules** (from the Brand Tone & Voice page):
- Frame valuation language as **contextual, not authoritative**. The narrator, not the appraiser.
- Think: *"Why this work sits where it does culturally and commercially."* Not: *"This is worth X."*
- Talking to galleries, artists, institutions — some of whom are *"allergic to the word arbitrage"* — so strategic framing matters.
- Sounds like: *"We make cultural value legible, trackable, and discussable."*

**Casing:**
- Program labels / section headers: **UPPERCASE with wide (0.5em) letter-spacing** — "RESIDENCIES", "A THING FOR ART", "BRAND GUIDELINES".
- Display headlines: **Title Case** with tight tracking (-0.04 to -0.06em). "Developing Masters" · "Distributing Culture" · "Every Wall Should Hold A Work of Art".
- Body copy: sentence case, conversational-formal.
- `.art` and `carsl` are always lowercase — never "Art", never "Carsl".

**Emoji:** never.
**Exclamation:** never in marketing copy.
**Punctuation:** curly quotes preferred (`"` `"`). Em dashes for asides.

**Example copy:**
- *"Discovery and Development of African based art and design, one step at a time"*
- *"A Thing For Art is obsessed with promoting the collection and distribution of African art through several non-conventional programs; leveraging residencies and salons by emerging artists, technology, collaborative art infused branding and marketing projects to facilitate the distribution of African art."*
- *"We make cultural value legible, trackable, and discussable."*

---

## Visual Foundations

### Colors
A **deliberately three-color** system, enforced in ratio.

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary | **ATFA Red** | `#DB522E` | 20% — accents, dot, CTAs, moments of emphasis |
| Black | **Pitch Black** | `#000000` / `#1A2229` | 10% — type, dark surfaces |
| Surface | **Off-White** | `#FBF8F8` | 70% — dominant page background |
| Sub-brand | Peach | `#FBC9B4` | `.art` accents only, not for master brand |

Distribution rule from the guidelines: **70% off-white, 20% red, 10% black**. When a viewport is fully covered by one primary color, the remaining two must still balance each other. Colors are never tinted or desaturated — block color or off.

### Typography
- **Raleway** is the only production typeface — display, body, and accents alike. Regular for body, Bold/Black for display and headlines. Italic for inline asides.
- Benchmark body size: **19.98px**. Scale forward/back by **φ (1.618)**.
- Minimum legible size: 12.35px.
- Body line-height: 29.97 / 19.98 ≈ **1.5**.
- Paragraph tracking: **-0.05em**. Heading tracking: **-0.04em to -0.06em**. Program labels: **+0.5em (uppercase only).**
- Paragraph weight 400; Headings 600–700.

*Brand-provided:* Raleway variable fonts (Roman + Italic) are shipped in `fonts/` and loaded via `@font-face` — no CDN required. Raleway is the complete brand type system; there is no secondary display face.

### Backgrounds
- Off-white dominates. Full-bleed red or pitch-black is used sparingly for hero/cover moments.
- **Radial gradients** used on covers (red center → black edge → deep-red stop). Example from Slide 4:3—1: `radial-gradient(#DB522E 6%, #000 69%, #AD4327 100%)`.
- **Conic gradients** on banner hero circles: `conic-gradient(#DB522E 0%, #752712 47%, #752C19 100%)`.
- Deep navy is used on one slide template (`#06111C → #1B4E82`) but is an outlier, likely from a specific event deck.

### Imagery
- Warm palette: terracotta, peach, bone, pitch. Imagery skews **warm, earthy, grainy**, often documentary of studio/gallery spaces. Full-bleed photography with no filter.
- Architectural/interior mockups (walls, galleries) appear frequently — art-in-context.
- Product/print mockups (totes, business cards, envelopes, certificate folders, brochures) are part of the system.

### Patterns & Textures
Two brand-owned pattern motifs:
1. **The Contour Swirl** — a hand-drawn topographic swirl, used as a low-presence background (target 5% opacity for parent brand). `.art` imprint may use full-color/freely.
2. **Pattern 12 / Pattern 122** — a dense repeating shape pattern, used for tote bags, brochures, printed surfaces.

### Layout
- **Corner-anchored logos**. Print: top-left or top-right preferred. Digital: top-left (desktop standard). Sub-brands may center.
- **77px** is the canonical corner inset (observed across slide/brochure templates).
- Clear-space rule: the logo's breathing room = the distance between the final "A" and the red dot (X); on the right side, add an olive-box width (X2).
- Generous whitespace. 70% air.

### Borders, Shadows, Radii
- Borders: hairline 0.5px dashed `#E98801` for guide markers; body 1px `rgba(0,0,0,0.1)`.
- Radii: **almost none**. 2px on major panels. The brand is sharp-cornered. The red dot is the only circle that matters.
- Shadows: used on print mockups and pattern grids. `0 4px 4px rgba(0,0,0,0.25)`, `0 4px 12px rgba(67,24,13,0.18)`. Warm (red-tinted) shadows preferred over neutral gray.

### Motion & Interaction
Print-first brand — Figma has no motion spec. Recommended defaults for digital:
- **Fades** (150–250ms, ease-out). No bouncing.
- **Hover**: 0.72 opacity, or darken red `#DB522E → #AD4327`.
- **Press**: slight scale-down (0.98) and `#752712`.
- **Transitions**: `cubic-bezier(0.2, 0, 0, 1)`.

### Transparency / blur
- Blur: not observed. Avoid.
- Transparency: primarily for the swirl pattern (5% opacity rule) and red-on-red stroke accents (`rgba(219,82,46,0.05)`).

---

## Iconography

ATFA is a **print-first / editorial brand** and the Figma file contains almost no UI iconography — the design language relies on **typography, the red dot, the wordmark, and the swirl pattern** instead of icon sets.

**Approach:**
- **No custom icon font** exists.
- **No emoji** — ever. Avoid.
- The **red dot** (`●` / `#DB522E`) functions as the brand's primary punctuation-icon: it ends wordmarks (`.art`, `carsl.`), it follows the ATFA letters, it's the bullet. When you need a "dot", use the ATFA dot.
- Unicode chars for marks: `—` em dash, `·` middle dot, `"` `"` curly quotes, `₦` (naira, used in typography spec).
- The **contour swirl** (`assets/patterns/swirl.svg`) functions as the brand's ornamental motif.

**For digital UI work** (where icons are needed — menus, inputs, etc.):
- **Substitute with Lucide** (hairline stroke, 1.5–2px) from CDN: `https://unpkg.com/lucide@latest`. Stroke weight tuned to match Raleway's geometric letterforms. **Flag this substitution** — no native ATFA icon set exists.
- Never use filled/duotone icon sets; they clash with Raleway's thin geometric serifs.

**Assets on hand** (`assets/`):
- `logos/atfa-primary-dot.png` — master wordmark with the red dot
- `logos/atfa-art-logo-fullcolor.png` — full ATFA lockup (primary + wordmark + subtitle)
- `logos/atfa-art-logo-06.png` — small ATFA + dot lockup
- `logos/atfa-art-secondary.png` — `.art` sub-brand wordmark
- `logos/carsl-logo.png` — `carsl.` sub-brand wordmark
- `patterns/swirl.svg` — the contour swirl (large)
- `patterns/swirl-small.svg` — smaller swirl variant

---

## Index

| File / Folder | What's in it |
|---|---|
| `colors_and_type.css` | Color + typography CSS vars. Import this first. |
| `assets/logos/` | Master + sub-brand logos (PNG) |
| `assets/patterns/` | Contour swirl and repeating patterns (SVG) |
| `preview/` | Individual cards that populate the Design System tab |
| `slides/` | Sample deck slides (Title, Quote, Program, Closing) — 16:9 |
| `ui_kits/marketing/` | Marketing-site UI kit (ATFA is print-first; website is the one digital surface) |
| `SKILL.md` | Agent SKILL manifest (cross-compatible with Claude Code skills) |

---

## Caveats

- No codebase attached; UI kit is synthesised from the visual language in Figma (corners, typography, color rules) rather than lifted from component code.
- No motion/animation spec in source — defaults above are editorial best-guess.
- Iconography uses Lucide via CDN as a substitute (none native).
