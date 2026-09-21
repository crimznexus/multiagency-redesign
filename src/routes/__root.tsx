import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { LazyMotion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import '~/styles/app.css'

const loadMotionFeatures = () => import('~/lib/motion-features').then((mod) => mod.default)

const title = 'MultiAgency — a human-led, AI-native agency'
const description =
  'We draft with AI and ship with people. Products, automations and content, reviewed by a person before they reach you — with every payment public.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title },
      { name: 'description', content: description },
      { name: 'theme-color', content: '#ECEAE4' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      {/* Only the animation features we use (no layout/drag); all honour "reduce motion". */}
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <Outlet />
        </MotionConfig>
      </LazyMotion>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
