# MultiAgency Design System

## 0. Research Log

- **Concrete references (the contract):** the user named two sites by the same lead frontend developer, [try.getcultd.com](https://try.getcultd.com/) and [reply.cash](https://www.reply.cash/). Both were driven in real Chrome at 1440 and 390 wide and swept with `getComputedStyle`. We take their *design mentality*, not their brand: no copy, logos or layouts are cloned.
  - CULTD: body #0A0A0A; a heavy grotesk at 96px / -0.02em for the hero; a mono face for every figure and label; one accent used for the key phrase, CTAs and data; panels at white/2–5% with an inset top highlight and a soft drop shadow; motion limited to colour/transform transitions plus a ping on live dots.
  - reply.cash: one accent, calculator widget, live figures, FAQ, repeated final CTA.
  - Shared mentality: **show the product, not adjectives**; **live data flagged as live**; centred hero with a status pill, a tight headline with one accent line, two CTAs; proof early (comparison with the old way struck through, outcomes with hard numbers).
- **Brand source:** multiagency.ai: near-black, cream, electric yellow for primary actions; "Open books, open source, open doors".
- **Clean-up pass: taste-skill** (`npx skills add Leonxlnx/taste-skill`, installed locally, not committed). Ran `redesign-existing-projects` (scan, diagnose, targeted fixes) and the `design-taste-frontend` pre-flight check. Design read: *agency landing for NEAR-ecosystem teams, dark product-grade language after CULTD / reply.cash, redesign mode "preserve"*. Dials: `DESIGN_VARIANCE 6`, `MOTION_INTENSITY 4`, `VISUAL_DENSITY 4`. Changes it drove are marked **(taste)** below.
- **Rejected earlier directions:** paper + red pencil with an autoplaying hero; a banknote/security-print page. Both were editorial and descriptive; the brief wants product-grade and demonstrative.

## 1. Atmosphere & Identity

A control room for an agency. Dark, crisp and confident: everything on the page is either a working surface or a real number. Two differentiators are shown, never just claimed: **who does what** (AI drafts, a named person owns the result) and **where the money goes** (every payout is public on NEAR).

**Signature:** the *project console* under the hero: pick a service and the six-step pipeline re-routes, each step marked Human or AI, ending in the on-chain payout. Second moment: the *treasury dashboard* in Open books, reading the chain live.

## 2. Color

One cream ink at many alphas and **one accent**: the brand yellow. **(taste: the status green is gone; states use cream plus a glyph.)** Tokens in `src/styles/app.css` `@theme`.

| Role | Token | Value | Usage |
|---|---|---|---|
| Canvas | `--color-canvas` | #0B0B0A | Page background |
| Canvas/raised | `--color-canvas-2` | #111110 | Open books band |
| Panel | `--color-panel` | #171715 | Console, table, cases, dashboard |
| Panel/raised | `--color-panel-2` | #1F1F1C | Active tab |
| Cream | `--color-cream` | #F4F1E8 | Headlines, primary text (≥ 14.6:1). Base for alpha lines: `cream/8` rules, `cream/4` fills |
| Text/muted | `--color-muted` | #A8A499 | Body copy (≥ 6.6:1 on every surface) |
| Text/dim | `--color-dim` | #8A867C | Labels, captions (≥ 4.5:1 on every surface) |
| Accent | `--color-signal` | #F7EE1B | Primary CTA fill, the hero's accent line, live dot, chart bars, Human badges, check glyphs |
| Accent/hover | `--color-signal-hover` | #FFF45A | Primary CTA hover |
| On accent | `--color-on-signal` | #0B0B0A | Text on yellow (16:1) |

Rules:
- The yellow is the brand colour and stays at full strength (taste-skill preservation rule: don't desaturate the brand).
- At most one yellow CTA per viewport, plus data marks.
- No glows. **(taste: the button halo and the console's glowing top line are gone.)** The hero keeps one faint radial light; the decorative grid lines were removed.

## 3. Typography

**Geist Variable** for words; **Geist Mono Variable** for figures, IDs and labels. **(taste: replaces Inter + JetBrains Mono, which the skill flags as the default; Geist + Geist Mono is its recommended pairing.)** Both self-hosted and subset (12 KB + 9 KB, `npm run subset:font`); Geist is preloaded.

| Level | Class | Size | Weight | Line height | Tracking | Usage |
|---|---|---|---|---|---|---|
| Display | `type-display` | clamp(2.75rem, 1.4rem + 5.4vw, 6rem) | 700 | 1.0 | -0.035em | Hero H1 |
| H2 | `type-h2` | clamp(2rem, 1.35rem + 2.6vw, 3.5rem) | 700 | 1.05 | -0.03em | Section heads |
| H3 | `type-h3` | 1.25rem | 600 | 1.25 | -0.015em | Card titles |
| Lede | `text-lede` | clamp(1.0625rem, 1rem + 0.35vw, 1.25rem) | 400 | 1.55 | -0.005em | Intro paragraphs (muted) |
| Body | `text-base` | 1rem | 400 | 1.6 | 0 | Default |
| Small | `text-sm` | 0.875rem | 400/500 | 1.5 | 0 | Card copy, table cells |
| Figure | `type-figure` | clamp(2.25rem, 1.7rem + 2.2vw, 3.5rem) | 600 mono | 1 | -0.04em | Big numbers |
| Label | `type-label` | 0.75rem | 500 mono | 1.35 | 0 | Data labels, pills, badges |

Rules:
- **Sentence case everywhere, including mono labels.** **(taste: all-caps labels removed.)**
- An accent phrase appears only in the hero and the closing CTA.
- Figures always mono and `tabular-nums`.
- No em or en dashes in visible text. **(taste; enforced by an e2e test.)**
- In mono text, avoid commas before a clause: the comma takes a full cell and reads as a gap.

## 4. Spacing & Layout

4px base (Tailwind scale). `--container-page: 76rem`, gutter `clamp(1rem, 4vw, 2rem)`, section rhythm `py-section = clamp(5rem, 11vw, 9rem)`. Hero top padding is capped at 6rem **(taste)**.

Every section uses a different layout family **(taste: section-layout-repetition rule)**:

| # | Section | Job | Layout family |
|---|---|---|---|
| 1 | Hero + project console | Hook; show the model working | Centred manifesto + interactive panel |
| 2 | Comparison | Why us | Table (desktop) / one card per row (phone) |
| 3 | Services | What you can hire | Sticky heading + 2×2 list, no cards |
| 4 | Work | Proof | Bento: 7/5, full-width brief tiles, one list panel |
| 5 | Open books | Proof | Dashboard panel |
| 6 | FAQ | Remove doubt | Heading + two-column Q&A, all open |
| 7 | Closing CTA | Convert | Centred panel |
| 8 | Footer | Navigate | One row of links |

Section labels (pills) are rationed to one per three sections **(taste: eyebrow rule)**: the hero's live pill and "Open books" only. The "Built on" wordmark strip was removed **(taste: text wordmarks with captions are banned)**.

## 5. Components

Shape rule (one documented system): controls 10px, nested rows and tiles 12px, panels 20px, pills and badges full.

### Button (`.btn` + `.btn-signal` | `.btn-ghost`)
- 44px min height (48 in hero), padding-x 20px, radius 10px, Geist 600 15px.
- Signal: yellow fill, canvas text; hover: `signal-hover`; active: translateY(1px).
- Ghost: `cream/4` fill, `cream/12` border; hover: `cream/8` fill, `cream/20` border.
- Focus-visible: 2px signal outline, 3px offset.
- **One label per intent (taste):** contact is always "Start a project" (`CONTACT_LABEL`); joining is always "Join as a builder".

### Skip link (`.skip-link`)
- First focusable element; hidden above the viewport until focused. **(taste)**

### Pill (`.pill`)
- Mono sentence-case label in a rounded-full `cream/4` fill with a `cream/10` border. Rationed (see §4).

### Live dot (`LiveDot`)
- 6px yellow dot with a `ping` ring. **Only for real live data:** the hero pill and the treasury header. **(taste: decorative dots on cards, tabs and the console removed.)**

### Panel (`.panel`)
- `panel` fill, `cream/8` border, radius 20px, `inset 0 1px 0 rgb(255 255 255 / .05)` highlight and `0 30px 60px -30px rgb(0 0 0 / .7)` drop.

### Section head (`SectionHead`)
- Centred H2, optional lede below (stacked, never split). Optional pill, rationed.

### Project console (signature)
- Panel with a plain title row ("How a project runs" + a one-line instruction). **(taste: fake window chrome removed.)**
- Tablist of 4 services (roving tabindex, arrows, Home/End, `aria-selected`); active tab `panel-2` + `cream/12` border.
- Pipeline of 6 rows: mono number, step, service-specific detail, owner line, badge (Human: yellow; AI: dashed outline; On-chain: cream outline with a check).
- Summary line in plain sentences (no middle-dot chains) and a link to Open books.
- Rows cross-fade (opacity 200ms) only after the visitor changes tab; never on first paint.

### Comparison
- Desktop: a real `<table>`, MultiAgency column on `cream/4`, check/cross glyph tiles, legacy cells struck through.
- Phone: one card per row, our answer first, the other two below.

### Services list
- Top-ruled items (no cards, no mock-ups): H3, summary, and chips linking to the matching work on the page. **(taste: div-built fake UI removed; the console already shows the AI/people split.)**

### Case card
- Panel: real screenshot on top (URL in mono below it), tags, H3, headline, description, mono stat pair.
- Legion: nine brief tiles in a 3×3 grid, each with ID, "Accepted" check, title, format. **(taste: replaces a nine-row hairline table.)**
- Other projects: one list panel. **(taste: replaces three equal cards.)**

### Treasury dashboard
- Live header, three KPI tiles, monthly column chart (current month: dashed outline), latest payouts (≤ 5 rows) with verify links. The chart is `aria-hidden` with a visually hidden table.

### FAQ
- Two-column definition list, every answer visible. **(taste: accordion removed.)**

### Icons
- Phosphor (`@phosphor-icons/react/ssr`), weight "bold", one family. **(taste: hand-drawn SVG icons removed.)**

## 6. Motion & Interaction

`MOTION_INTENSITY 4`: hover/press/focus feedback, the tab cross-fade and the live ping. No scroll reveals, no marquees.

| Type | Duration | Easing | Usage |
|---|---|---|---|
| Micro | 150ms | cubic-bezier(0.4, 0, 0.2, 1) | Hover colour/fill, button press |
| Standard | 200ms | ease-out | Console cross-fade after a tab change |
| Live | 2.4s loop | cubic-bezier(0, 0, 0.2, 1) | `ping` on live dots only |

Rules: only `opacity`, `transform`, colour and background transition. Selection is fill + glyph, never a coloured side border. `prefers-reduced-motion` turns off the ping and transitions.

## 7. Depth & Surface

Layered panels on a flat dark canvas (from CULTD). Nested elements step up in fill (`panel` → `panel-2`), not in shadow.

## 8. Accessibility Constraints & Accepted Debt

### Constraints
- WCAG 2.2 AA; contrast verified: cream ≥ 14.6:1, muted ≥ 6.6:1, dim ≥ 4.5:1 on every surface; canvas on signal 16:1.
- Visible focus and ≥ 44px targets on every control; skip link; the console follows the ARIA tabs pattern.
- Charts and figures have text equivalents. No horizontal scroll at 320px.

### Accepted Debt
| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| Dark mode only | whole page | Brand and both references are dark; taste-skill allows one mode when the brand insists | Add a light theme if the brand asks |
| Centred hero | Hero | taste-skill discourages it above variance 4, but allows it for manifesto heroes, and both references use it | Revisit if the hero gets a real product visual |
| No photography | whole page | No image generator available; stock placeholders would undercut an agency's credibility | Add real team or project imagery |
| "Start a project" and "Join" leave for multiagency.ai | CTAs | No form backend | Build a form once there is an endpoint |
| No legal links or og:image | footer, head | None exist to link to | Add when the agency provides them |
| Mobile Lighthouse performance below 100 | framework JS | TanStack Start + React client bundle counts before LCP | Islands / partial hydration |
