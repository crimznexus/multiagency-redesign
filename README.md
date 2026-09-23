# MultiAgency — landing page redesign

A redesign of the [multiagency.ai](https://multiagency.ai) landing page: a human-led, AI-native agency, presented to the clients who hire it.

> Design decisions, tokens and components are documented in [`DESIGN.md`](DESIGN.md).

## Stack

- **TanStack Start** (React 19) on **Vite 8**, prerendered to static HTML and deployed through **Nitro** on Vercel
- **Tailwind CSS v4**, with every token defined in `DESIGN.md` and mirrored in `src/styles/app.css`
- No animation library: nothing plays on load except the live-status dot; the project console cross-fades only when you switch tabs
- **Geist** and **Geist Mono** variable fonts, self-hosted and subset to 12 KB and 9 KB (`npm run subset:font`)
- Design cleaned with [taste-skill](https://github.com/Leonxlnx/taste-skill) (installed locally with `npx skills add Leonxlnx/taste-skill`); decisions in `DESIGN.md`
- An interactive project console (which steps AI drafts, which people own) and a live treasury dashboard read from the chain
- Live figures read straight from the agency's public payment ledger (`src/lib/ledger.ts`)
- **TypeScript 7** (strict), **Biome**, **Vitest**, **Playwright + axe**, **Lighthouse CI**

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run build` | Production build + prerender |
| `npm run preview` | Serve the production build |
| `npm run check` | Typecheck, lint and unit tests |
| `npm run test:e2e` | Playwright end-to-end and accessibility tests (desktop + mobile) |

CI runs all of the above plus Lighthouse (≥ 0.95 in every category) on each push.

### Forms: hire us and apply to join

`/contact` posts to `/api/contact` and `/apply` posts to `/api/apply`. Both validate with the same rules as the form (`src/lib`) and forward the submission as JSON to `CONTACT_WEBHOOK_URL` (a Slack or Discord incoming webhook, Zapier, Make, n8n or a CRM; see `.env.example`), with `"type": "inquiry"` or `"application"`. Set `APPLY_WEBHOOK_URL` to send applications somewhere else. Without a webhook, development logs submissions to the console and production answers 503, so nothing is ever silently dropped.
