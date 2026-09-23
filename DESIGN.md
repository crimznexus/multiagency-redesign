# MultiAgency Design System

## 0. Research Log

- **Concrete references (the contract):** the user named two sites by the same lead frontend developer, [try.getcultd.com](https://try.getcultd.com/) and [reply.cash](https://www.reply.cash/). Both were driven in real Chrome at 1440 and 390 wide and swept with `getComputedStyle`. We take their *design mentality*, not their brand: no copy, logos or layouts are cloned.
  - CULTD: body #0A0A0A; a heavy grotesk at 96px / -0.02em for the hero; a mono face for every figure and label; one accent used for the key phrase, CTAs and data; panels at white/2–5% with an inset top highlight and a soft drop shadow; motion limited to colour/transform transitions plus a ping on live dots.
  - reply.cash: one accent, calculator widget, live figures, FAQ, repeated final CTA.
  - Shared mentality: **show the product, not adjectives**; **live data flagged as live**; centred hero with a status pill, a tight headline with one accent line, two CTAs; proof early (comparison with the old way struck through, outcomes with hard numbers).
- **Brand source:** multiagency.ai: near-black, cream, electric yellow for primary actions; "Open books, open source, open doors".
- **Clean-up pass: taste-skill** (`npx skills add Leonxlnx/taste-skill`, installed locally, not committed). Ran `redesign-existing-projects` (scan, diagnose, targeted fixes) and the `design-taste-frontend` pre-flight check. Design read: *agency landing for NEAR-ecosystem teams, dark product-grade language after CULTD / reply.cash, redesign mode "preserve"*. Dials: `DESIGN_VARIANCE 6`, `MOTION_INTENSITY 4`, `VISUAL_DENSITY 4`. Changes it drove are marked **(taste)** below.
- **Rejected earlier directions:** paper + red pencil with an autoplaying hero; a banknote/security-print page. Both were editorial and descriptive; the brief wants product-grade and demonstrative.
- **Direction change (this revision):** the dark control-room page was replaced by a **modernist (Swiss International Style)** landing page, designed first in Claude Design and then implemented here. Mentality: a strict 12-column grid, flush-left grotesk type at poster scale, sharp corners, rules instead of cards, one accent. The brand yellow, the content and the live ledger plumbing were kept; the surface became an off-white paper, then (after a light-to-dark flash on load) dark only: the near-black ground the brand started from.
- Dials for the modernist revision: `DESIGN_VARIANCE 6`, `MOTION_INTENSITY 4`, `VISUAL_DENSITY 4`.

## 1. Atmosphere & Identity

A printed specimen sheet for an agency, not a dashboard. Everything sits on one grid: big type, big numbers, hairline rules, and a single yellow that only marks actions and the one AI step. Two differentiators are shown, never just claimed: **who does what** (AI drafts, a named person owns the result) and **where the money goes** (every payout is public on NEAR).

**Signature:** the *project console* in the hero: pick a kind of project and the six-step pipeline re-routes, one step marked AI, the last one paid on-chain. Second moment: *Open books*, where the payout count and the monthly bars are read from the chain.

## 2. Color

One ink, one ground, one accent. **The page is dark only**: there is no light mode, so no frame can ever paint in light colours (a light-to-dark flash on load was the reason). Tokens in `src/styles/app.css` `@theme`; `color-scheme: dark`, a `color-scheme` meta, an inline `html` background and `theme-color` in the document head make the very first frame and the phone toolbar dark too.

| Role | Token | Value | Usage |
|---|---|---|---|
| Ground | `--color-bg` | #13120E | Page background |
| Ink | `--color-ink` | #EEEDE6 | Headlines, body, 2px rules, the terminal panel |
| Muted | `--color-muted` | #A9A69B | Secondary copy, labels (at least 6.5:1 on the ground) |
| Rule | `--color-rule` | ink at 14% | Hairlines between rows and sections |
| Surface | `--color-surface` | #1F1E19 | Hover fills, image frames, the active work row |
| Accent | `--color-signal` | #F3E11B | Primary CTA, the AI chip, the MultiAgency column, the logo square |
| On accent | `--color-on-signal` | #15140F | Text on yellow (15:1) |

Rules:
- The yellow never carries text on the ground; it is always a fill with on-accent text on top.
- Two rule weights only: 2px ink to open a block, 1px `rule` between rows.
- No shadows, no gradients, no glows. Depth comes from rules and fills.

## 3. Typography


**Geist Variable** for words; **Geist Mono Variable** for figures, IDs and labels. **(taste: replaces Inter + JetBrains Mono, which the skill flags as the default; Geist + Geist Mono is its recommended pairing.)** Both self-hosted and subset (12 KB + 9 KB, `npm run subset:font`); both are preloaded, since both are in the first screen.

| Level | Class | Size | Weight | Line height | Tracking | Usage |
|---|---|---|---|---|---|---|
| Display | `type-display` | clamp(2.75rem, 1.1rem + 7vw, 9.25rem) | 600 | 0.9 | -0.052em | Hero H1; at `lg` it drops to clamp(4rem, 0.5rem + 5.4vw, 6.75rem) to sit beside the terminal |
| H2 | `type-h2` | clamp(2.125rem, 1.4rem + 2.9vw, 4rem) | 600 | 1.0 | -0.04em | Section heads |
| H3 | `type-h3` | 1.25rem | 500 | 1.25 | -0.02em | Project and card titles |
| Numeral | `type-num` | clamp(3.5rem, 1.9rem + 6.4vw, 8rem) | 600 | 0.95 | -0.055em | The books, the brief count |
| Lede | `text-lede` | clamp(1.0625rem, 1rem + 0.4vw, 1.25rem) | 400 | 1.45 | -0.005em | Hero value prop |
| Body | `text-base` / `text-[17px]` | 1rem / 1.0625rem | 400 | 1.5 to 1.6 | 0 | Default, section body |
| Label | `type-label` | 0.8125rem mono | 500 | 1.35 | 0.08em, uppercase | The two section labels, owner chips |
| Mono | `type-mono` | 0.8125rem mono | 400 | 1.4 | 0 | Figures, account IDs, proposal numbers, dates |

Rules:
- Sentence case for every heading and every piece of body copy. Uppercase is reserved for `type-label`: the two section labels and the owner chips.
- Headings are flush left and end in a full stop. No accent-coloured words: emphasis is size and position, not colour.
- Display and H2 carry a `padding-bottom` of 0.04em and 0.06em, so descenders in "agencies" and "payout" are never clipped.
- Figures always mono and `tabular-nums`.
- No em or en dashes in visible text. **(taste; enforced by an e2e test.)**
- In mono text, avoid commas before a clause: the comma takes a full cell and reads as a gap.

## 4. Spacing & Layout

4px base (Tailwind scale). `--container-page: 82.5rem` (1320px), gutter `clamp(1rem, 3.5vw, 2.5rem)`, section rhythm `py-section = clamp(4.5rem, 9vw, 7.5rem)`. Hero top padding is capped at 3.5rem **(taste)**.

`.grid12` is the page grid: 12 columns with a 24px gutter at `lg`, a single column below it. Every section places its content on it, and no section repeats another's layout family **(taste: section-layout-repetition rule)**:

| # | Section | Job | Layout family |
|---|---|---|---|
| 1 | Hero + project console | Hook; show the model working | Split from `md`: headline, value prop and CTAs left, pipeline terminal right (6/6 at `md`, 7/5 at `lg`); stacked on phones |
| 2 | Open books | Proof, the strongest one, so it runs first | Split from `md` (5/7, then 5/6 at `lg`): argument left, compact figures, bars and three payouts right |
| 3 | Comparison | Why us | Table (desktop) / one block per row (phone) |
| 4 | Work | Proof | Ruled, numbered index (7 cols) beside one sticky preview frame (5 cols) |
| 5 | Agency template | Second audience (founders) | 5/6 split with a command line |
| 6 | FAQ | Remove doubt | Heading left, two-column Q&A, all open |
| 7 | Footer | Navigate | Wordmark at poster scale, one row of links |

Section labels are rationed to two on the page **(taste: eyebrow rule)**: "Open books" and "Agency template". The hero has none, and no section is numbered.

## 5. Components

Shape rule (one documented system): **nothing is rounded.** Every control, chip, image frame and fill has square corners.

### Button (`.btn` + `.btn-signal` | `.btn-ghost`, `.btn-sm`)
- 48px min height (40 for `btn-sm`), padding-x 20px, 1px ink border, Geist 500 16px.
- Signal: yellow fill, ink text; hover inverts to an ink fill with paper text; active: translateY(1px).
- Ghost: no fill, ink border; hover inverts the same way.
- Focus-visible: 2px ink outline, 3px offset.
- **One label per intent (taste):** contact is always "Hire us" (`CONTACT_LABEL`), joining is always "Apply to join", the template is always "Register interest".

### Skip link (`.skip-link`)
- First focusable element; hidden above the viewport until focused. **(taste)**

### Header
- 64px, sticky, one hairline under it. Wordmark with a yellow square; four links at `md` and up; "Hire us"; a popover menu below `md`.

### Project console (signature)
- A terminal, adapted from Aceternity UI's Terminal: an ink panel (it inverts to paper in dark mode), square corners, no shadow, no sound. Its title bar holds three square window marks and a tab strip of four kinds of project (roving tabindex, arrows, Home/End, `aria-selected`), underlined when active.
- Picking a tab types out that project's pipeline in mono: `brief` (echoing the example brief), then `run`, with the six steps as one line each (step, owner chip, a terse note). The full step detail lives in the hidden list, so the panel stays shorter than the hero text. Every line is laid out from the first frame and revealed in place, so nothing shifts. The cursor is a steady block (nothing loops); reduced motion shows the finished transcript.
- The typed transcript is `aria-hidden`; a visually hidden ordered list carries the same six steps.
- The AI chip is the only yellow in the panel: one step of six, visible at a glance.

### Comparison
- Desktop: a real `<table>` with a 2px ink head rule. The MultiAgency column is filled yellow, so the answer reads first; losing cells in the other two columns are struck through.
- Phone: one block per row, our answer in a yellow chip, the other two below.

### Open books
- A status line in mono (live, or the last reading), two figures on a 2px ink rule (`type-num` capped at 4.5rem here, so they support the argument instead of outweighing it), monthly bars in ink at 112px (the current month is outlined, because it is partial), then the three most recent payouts with verify links.
- The bar chart is `aria-hidden` with a visually hidden table beside it.

### Work ("Our work.")
- The five projects multiagency.ai lists, in its order: Ping, City Nodes, NEAR Builders, NEAR Builders social, NEAR Builders Bot. A mono count sits opposite the heading.
- One ruled index on a 2px ink rule: a mono number, the name at `type-h3` with one muted line, then the kind label and the site link on the right. The active row takes the `surface` fill.
- From `md`, one sticky preview frame (16:10, 1px rule) follows the hovered or focused row; every image stays mounted and cross-fades. Phones get the list alone.
- Images come from `npm run capture:work`: live-site captures for Ping, City Nodes and NEAR Builders; for the two projects without a public site, an illustration rendered from `scripts/illustrations/` in the page's own tokens, with placeholder bars for copy and the word "Illustration" on it, so it never reads as a real post or chat.

### Agency template
- An ink command line with a copy button that reports "Copied" for 1.6s, then what the template ships as a 2 by 2 ruled list.

### FAQ
- Heading left, two-column definition list, every answer visible. **(taste: accordion removed.)**

### Contact page (`/contact`)
- Every "Hire us" link lands here, never on the old site. Split like the hero: label, H2-size heading and lede, then a three-row "what happens next" list on the left; the form on the right under a 2px ink rule.
- Fields: the kind of project as square chips (a radio group; the chosen one fills with ink), name and email side by side, company (optional), the brief with a hint line. Inputs are square, 1px ink at 40%, full ink on hover and focus.
- Errors: validated with the same rules as the server, shown in mono under each field, the field tinted yellow at 15%, focus moved to the first. A failed send keeps the text and says so in the status line.
- Success replaces the form with a yellow check square and "Brief received.", which takes focus. Without scripts the form posts natively and the result shows through `:target`.

### Footer
- The wordmark at `clamp(2.5rem, 13.5vw, 13.5rem)`, one row of links, the treasury account in mono.

### Icons
- Phosphor (`@phosphor-icons/react/ssr`), weight "bold", one family. **(taste: hand-drawn SVG icons removed.)**

## 6. Motion & Interaction

`MOTION_INTENSITY 4`: one entrance, one scroll-driven chart, and state feedback. **Nothing loops** (enforced by an e2e test).

| Type | Duration | Easing | Usage |
|---|---|---|---|
| Micro | 150 to 200ms | cubic-bezier(0.4, 0, 0.2, 1) | Hover fill and colour, button press |
| Entrance | 500ms fade, staggered by 80ms | `--ease-ui` | Hero headline, value prop, terminal (`.rise`). Opacity only: nothing moves on load, so a reload never reads as a layout jump |
| Scroll | scroll-driven | linear | Bars draw up as the chart enters (`animation-timeline: view()`, progressive enhancement) |

Rules: only `opacity` and `transform` animate. Layout never changes after first paint: both fonts are preloaded, and the font stacks are pinned in the base layer (see `app.css`) so no stylesheet order can swap them. Selection is a fill or an underline, never a coloured side border. `prefers-reduced-motion: reduce` disables all of it.

## 7. Depth & Surface

There is no depth. The page is flat paper: rules separate content, fills mark state, and the only elevation is the ink fill on an open pipeline row or the yellow on the column that matters.

## 8. Accessibility Constraints & Accepted Debt

### Constraints
- WCAG 2.2 AA in both modes (axe-core runs on desktop and mobile in e2e); ink at least 15:1 and muted at least 6.5:1 on paper and on the dark surface; ink on signal 15:1.
- Visible focus and ≥ 44px targets on every control; skip link; the console follows the ARIA tabs pattern.
- Charts and figures have text equivalents. No horizontal scroll at 320px.

### Accepted Debt
| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| Mode follows the system, with no toggle | whole page | Both modes are designed and tested; a toggle adds state for a decision the visitor does not need to make | Add a toggle if the brand wants one mode to dominate |
| No separate services section | page | The console's four tabs carry the same content, and a list repeated it | Bring it back if services need their own copy |
| No photography | whole page | No image generator available; stock placeholders would undercut an agency's credibility | Add real team or project imagery |
| "Hire us" and "Apply to join" leave for multiagency.ai | CTAs | No form backend | Build a form once there is an endpoint |
| No legal links or og:image | footer, head | None exist to link to | Add when the agency provides them |
| Mobile Lighthouse performance below 100 | framework JS | TanStack Start + React client bundle counts before LCP | Islands / partial hydration |
