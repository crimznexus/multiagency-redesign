import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/hero/Hero'
import { SiteHeader } from '~/components/SiteHeader'
import { SelectedWork } from '~/components/work/SelectedWork'
import { getLedger } from '~/server/functions'

export const Route = createFileRoute('/')({
  // Runs at prerender time, so the static HTML carries current ledger figures.
  loader: () => getLedger(),
  component: Home,
})

function Home() {
  const ledger = Route.useLoaderData()
  return (
    <>
      <SiteHeader />
      <main>
        <Hero ledger={ledger} />
        <SelectedWork />
      </main>
    </>
  )
}
