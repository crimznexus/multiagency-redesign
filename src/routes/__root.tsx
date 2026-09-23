import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import geistMono from '~/assets/fonts/geist-mono-subset.woff2?url'
import geistLatin from '~/assets/fonts/geist-subset.woff2?url'
import '~/styles/app.css'

const title = 'MultiAgency: AI speed, human sign-off, open books'
const description =
  'Hire a human-led, AI-native agency on NEAR. AI drafts in hours, named specialists review and ship, and every payout is on the public record.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      // Both faces are in the first screen (the headline, and the terminal beside it). Preloading
      // lets them beat first paint, so text never re-wraps when a font swaps in.
      { rel: 'preload', href: geistLatin, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: geistMono, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

/**
 * First-paint colour, before any stylesheet arrives. The page is dark only:
 * the meta makes the browser's own canvas dark, and the inline rule paints
 * the exact background, so no frame is ever white, whatever serves the CSS.
 * theme-color tints the phone browser's toolbar to match.
 * Keep these in step with --color-bg in app.css.
 */
const firstPaint = 'html{background:#000}'

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#000000" />
        <style>{firstPaint}</style>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
