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

**Signature:** the *pipeline graph* in the hero: pick a kind of project and the six-step pipeline re-routes, one step marked AI, the last one paid on-chain. Second moment: *Open books*, where the payout count and the monthly bars are read from the chain.

## 2. Color

One ink, one ground, one accent. **The page is dark only**: there is no light mode, so no frame can ever paint in light colours (a light-to-dark flash on load was the reason). Tokens in `src/styles/app.css` `@theme`; `color-scheme: dark`, a `color-scheme` meta, an inline `html` background and `theme-color` in the document head make the very first frame and the phone toolbar dark too.

| Role | Token | Value | Usage |
|---|---|---|---|
| Ground | `--color-bg` | #000000 | Page background, under a film grain (see §7) |
| Ink | `--color-ink` | #EEEDE6 | Headlines, body, 2px rules, the pipeline graph |
| Muted | `--color-muted` | #A9A69B | Secondary copy, labels (at least 6.5:1 on the ground) |
| Rule | `--color-rule` | ink at 14% | Hairlines between rows and sections |
| Surface | `--color-surface` | #1F1E19 | Hover fills, image frames, the active work row |
| Accent | `--color-signal` | #F3E11B | Primary CTA, the AI chip, the MultiAgency column, the logo square |
| On accent | `--color-on-signal` | #15140F | Text on yellow (15:1) |

Rules:
- The yellow never carries text on the ground; it is always a fill with on-accent text on top.
- Two rule weights only: 2px ink to open a block, 1px `rule` between rows.
- No shadows, no gradients, no glows. Depth comes from rules and fills. Exceptions: the header's soft shadow, the hero video's gradient, and frosted glass on the pipeline graph and the scrolled header.

## 3. Typography


**Geist Variable** for words; **Geist Mono Variable** for figures, IDs and labels. **(taste: replaces Inter + JetBrains Mono, which the skill flags as the default; Geist + Geist Mono is its recommended pairing.)** Both self-hosted and subset (12 KB + 9 KB, `npm run subset:font`); both are preloaded, since both are in the first screen.

| Level | Class | Size | Weight | Line height | Tracking | Usage |
|---|---|---|---|---|---|---|
| Display | `type-display` | clamp(2.75rem, 1.1rem + 7vw, 9.25rem) | 600 | 0.9 | -0.052em | Hero H1; at `lg` it drops to clamp(4rem, 0.5rem + 5.4vw, 6.75rem) to sit beside the pipeline graph |
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
| 1 | Hero + pipeline graph | Hook; show the model working | Split from `md`: headline, value prop and CTAs left, pipeline graph right (6/6 at `md`, 7/5 at `lg`); stacked on phones. Full bleed behind it, the loop |
| 2 | Open books | Proof, the strongest one, so it runs first | Split from `md` (5/7, then 5/6 at `lg`): argument left, compact figures, bars and three payouts right |
| 3 | Comparison | Why us | 4/8 split: argument beside a tight table; on phones the same table, marks only for the other two columns |
| 4 | Work | Proof | Ruled, numbered index (7 cols) beside one sticky preview frame (5 cols) |
| 5 | Agency template | Second audience (founders) | 5/6 split with a command line |
| 6 | FAQ | Remove doubt | Heading left, one-column list of questions that slide open |
| 7 | Footer | Navigate | Wordmark at poster scale, one row of links (desktop), two labelled link columns (phone) |

Section labels are rationed to two on the page **(taste: eyebrow rule)**: "Open books" and "Agency template". The hero has none, and no section is numbered.

## 5. Components

Shape rule (one documented system): **nothing is rounded**, except the header. Every control, chip, image frame and fill has square corners; the header's circles and pills and the hero's two buttons are the deliberate exceptions **(client request: header as in the motionsites.ai reference)**.

### Button (`.btn` + `.btn-signal` | `.btn-ghost`, `.btn-sm`)
- 48px min height (40 for `btn-sm`), padding-x 20px, 1px ink border, Geist 500 16px.
- Signal: yellow fill, ink text; hover inverts to an ink fill with paper text; active: translateY(1px).
- Ghost: no fill, ink border; hover inverts the same way.
- Focus-visible: 2px ink outline, 3px offset.
- **Hero pills (client request):** the hero's two buttons are fully rounded. "Hire us" keeps the yellow fill with a soft yellow glow (a 1px ring at 15% and a 22px glow at 18%); "Apply to join" is a ghost pill on a 40% ink border with a light backdrop blur. Hover still inverts. Buttons elsewhere stay square.
- **One label per intent (taste):** contact is always "Hire us" (`CONTACT_LABEL`), joining is always "Apply to join", the template is always "Register interest".

### Skip link (`.skip-link`)
- First focusable element; hidden above the viewport until focused. **(taste)**

### Header
- Floating and sticky, 72px, with no bar of its own: the hero pulls up behind it (`-mt-18 pt-18`), so the video runs to the top of the page.
- From `md`, one centred row: the mark in a light glass circle (40 to 46px), a white pill of links (Home, Work, Open books, Template, FAQ), and "Hire us" as a dark pill (#28282a, text #c8c8c8; lifts 1px on hover). All three carry one soft shadow, `0 4px 14px rgb(0 0 0/0.16)`.
- The current link is #2e2e2e with three 3px dots under it; the rest are #6b6b6b (the reference's 50% opacity fails contrast). On the home page the dots follow the section crossing the middle of the viewport, and sit under Home above the first one.
- **Glass, driven by scroll:** the header is never solid. At the top it is light frosted glass (white at 70%, 6px blur, dark text); as the page scrolls it deepens with the scroll itself, not on a timer, into the pipeline panel's dark glass (black at 35%, 24px blur, 1.5× saturation, a 15% ink hairline, light text) over the first 200px, and lightens again on the way back up. SiteHeader writes the progress as `--p` (0 to 1) once per frame; `.hdr*` in `app.css` mixes every colour, blur and shadow from it. Text flips from dark to light over the middle of the range (`--t`), so it only briefly crosses the mid-grey glass. The "Hire us" pill and the phone menu button start from dark glass (#28282a at 72%) instead of white.
- Phones: the mark left and a round dark menu button right, both 48px. The menu is a popover covering the screen (black at 60%, 6px blur) with the mark and a white close button above it, and a white sheet (28px radius) of the same links, then "Hire us" as a full-width dark pill and "Apply to join". Tapping the dimmed area, Esc or a link closes it.

### The loop (hero video and footer wordmark) **(client decision: final)**
- One piece of footage for the whole site: dark dunes under a violet sky, digits falling through it, with film grain (10 s, loops). It is the motionsites.ai reference clip, a Higgsfield generation. It is **self-hosted**, not hotlinked from the reference's CloudFront URL, so the site never depends on someone else's account.
- `public/hero/`: `loop.webm` (VP9, ~300 KB) and `loop.mp4` (H.264, ~380 KB), re-encoded at 720p from the 13.8 MB 1080p original, plus `loop-poster.webp` (the first frame, 52 KB). One component plays it everywhere: `LoopVideo`.
- The poster paints first (preloaded on `/`; it is the LCP element). The video loads only after hydration (`preload="none"`): at once in the hero, and on scroll into view in the footer. Each pauses out of view.
- Hero: full bleed behind the hero, under a gradient that keeps the copy on solid ground (the page colour under the text column from `md`, darkening downward on phones); the footage shows in full on the pipeline side and glows through its frosted glass.
- Footer: the wordmark is filled with it. White-on-black type set to `mix-blend-mode: multiply` sits over the video, so the footage shows only through the letters and the black around them is the page. It is cropped to the band of sky and digits (`object-position: 50% 22%`) and clipped by a pixel at the bottom so no hairline shows.
- It is the only thing that loops. Reduced motion and Save-Data keep the still poster. **Accepted debt:** there is no pause button (client request), so WCAG 2.2.2 (pause, stop, hide) is met only through reduced motion.

### Pipeline graph (signature, `ProjectPipeline`) **(client request: replaces the terminal)**
- A frosted-glass panel (black at 35%, 24px blur, 1.5× saturation, a 15% ink hairline) with light text, so the hero video glows through it blurred; square corners. The hero's fade uses `backwards` fill, because a held fill makes Chrome treat the wrapper as a backdrop root and the blur would show nothing.
- Top: a tab strip of four kinds of project (roving tabindex, arrows, Home/End, `aria-selected`), underlined when active, and "6 steps · 1 AI" in mono when there is room. Then the example brief in mono.
- The graph: the six steps (Brief, Draft, Build, Review, Accept, Paid) as nodes on one smooth curve (Catmull-Rom through fixed points in a 2:1 box), labels alternating below and above with the owner in mono under each name. Nodes are hollow ink rings; the AI node is the only yellow: a filled dot with a soft glow and a yellow AI chip. Under it, one line: "AI drafts <that service's first two drafts>. People do the rest."
- Motion, on load and on every tab change: the line draws itself in 2.2s at an even pace, a short yellow spark rides its tip and runs off the end, and each node pops in (opacity and scale, 450ms) as the spark reaches it, 0.4s apart; the note fades in last. It plays once, nothing loops. Styles are `.pg-*` in `app.css`: the final state is the default, so reduced motion shows the finished graph. Dashes use `pathLength=1`, without `non-scaling-stroke` (which makes Chrome measure dashes in pixels).
- The graph is `aria-hidden`; a visually hidden ordered list carries the six steps with full detail and owner, and the brief is real text.

### Comparison
- Five rows, two or three words per cell, so it reads at a glance. From `lg` the heading and one-line argument sit in 4 columns beside the table (8 columns); below `lg` they stack above it.
- One real `<table>` at every width, with a 2px ink head rule. The MultiAgency column is filled yellow, so the answer reads first; losing cells in the other two columns are struck through.
- Phones: the same table, compact. The other two columns shrink to 13% each and show only their ✓ or ✗ under short headers ("Agency", "AI"); their words stay in the markup for screen readers. Our column keeps its text, so each row is one line at 390px.

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
- Heading left; on the right, one ruled list of questions under a 2px ink rule, every answer closed. **(Client request: compact over all-open; supersedes the taste-skill "no accordion" call.)**
- Each question is a full-width button (`aria-expanded`, `aria-controls`) with a square toggle on the right: hairline when closed, ink-filled when open, the plus turning 45° into a close mark. Any number can be open at once.
- The answer slides: grid rows animate `0fr` → `1fr` with a fade, 300ms on `--ease-ui`, so height follows the content without measuring. Closed answers are `inert`, so their links can't be tabbed into. Reduced motion makes it instant.

### Form pages (`/contact`, `/apply`)
- Both share one layout (`FormPage`) and one form kit (`form-kit.tsx`), so they cannot drift apart. `/apply` asks what the applicant does best, name and email, an optional NEAR account and portfolio link, and a few sentences on their work, and keeps the live site's "browse open work on NEARN" link under its steps.

#### Contact page (`/contact`)
- Every "Hire us" link lands here, never on the old site. Split like the hero: label, H2-size heading and lede, then a three-row "what happens next" list on the left; the form on the right under a 2px ink rule.
- Fields: the kind of project as square chips (a radio group; the chosen one fills with ink), name and email side by side, company (optional), the brief with a hint line. Inputs are square, 1px ink at 40%, full ink on hover and focus.
- Errors: validated with the same rules as the server, shown in mono under each field, the field tinted yellow at 15%, focus moved to the first. A failed send keeps the text and says so in the status line.
- Success replaces the form with a yellow check square and "Brief received.", which takes focus. Without scripts the form posts natively and the result shows through `:target`.

### Footer
- The wordmark at `clamp(2.5rem, 13.5vw, 13.5rem)`, filled with the loop (see above).
- From `md`: one row, the links left and the treasury account in mono right.
- Phones: two labelled columns under a hairline, **Site** (Work, Open books, Template, FAQ) and **Elsewhere** (Open source, X), then the treasury account on its own ruled line with a "Treasury" label. The account never breaks mid-name; on a narrow phone it drops below its label. Group labels are visually hidden from `md`.

### Icons
- Phosphor (`@phosphor-icons/react/ssr`), weight "bold", one family. **(taste: hand-drawn SVG icons removed.)**

## 6. Motion & Interaction

`MOTION_INTENSITY 4`: one entrance, one scroll-driven chart, and state feedback. **Nothing loops** (enforced by an e2e test) except the loop (hero and footer wordmark), which stays still under reduced motion **(client request: more spice)**.

| Type | Duration | Easing | Usage |
|---|---|---|---|
| Micro | 150 to 200ms | cubic-bezier(0.4, 0, 0.2, 1) | Hover fill and colour, button press |
| Entrance | 500ms fade, staggered by 80ms | `--ease-ui` | Hero headline, value prop, pipeline graph (`.rise`). Opacity only: nothing moves on load, so a reload never reads as a layout jump |
| Scroll | scroll-driven | linear | Bars draw up as the chart enters (`animation-timeline: view()`, progressive enhancement) |

Rules: only `opacity` and `transform` animate. Layout never changes after first paint: both fonts are preloaded, and the font stacks are pinned in the base layer (see `app.css`) so no stylesheet order can swap them. Selection is a fill or an underline, never a coloured side border. `prefers-reduced-motion: reduce` disables all of it.

## 7. Depth & Surface

Almost no depth. Rules separate content inside a section and fills mark state; **sections have no dividers between them**, only space (client request). The whole page sits under a static film grain (`body::after`: fixed, 11% opacity, one 160px tile of SVG fractal noise, under the header at z-30) so the black sections share the loop's texture. The only elevation is frosted glass (pipeline graph, scrolled header).

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
