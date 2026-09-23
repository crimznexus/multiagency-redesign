import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
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
      // Geist sets the headline; preloading lets it beat first paint. The mono face is small and can follow.
      { rel: 'preload', href: geistLatin, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
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
const firstPaint = 'html{background:#13120e}'

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#13120E" />
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
