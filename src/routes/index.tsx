import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/hero/Hero'
import { SiteHeader } from '~/components/SiteHeader'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <div className="h-24" />
      </main>
    </>
  )
}
