# MultiAgency — landing page redesign

A redesign of the [multiagency.ai](https://multiagency.ai) landing page: a human-led, AI-native agency, presented to the clients who hire it.

> Work in progress. A full write-up — audit, design decisions and trade-offs — lands with the finished page.

## Stack

- **TanStack Start** (React 19) on **Vite 8**, prerendered to static HTML and deployed through **Nitro** on Vercel
- **Tailwind CSS v4** with OKLCH design tokens defined in CSS (`src/styles/app.css`)
- **Motion** for the one signature animation; native View Transitions and CSS scroll-driven animations elsewhere
- Self-hosted variable fonts via **Fontsource** — Schibsted Grotesk, Newsreader, Geist Mono
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
