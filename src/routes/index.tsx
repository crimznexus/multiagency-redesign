import { createFileRoute } from '@tanstack/react-router'
import { ClosingCta } from '~/components/ClosingCta'
import { Compare } from '~/components/Compare'
import { Faq } from '~/components/Faq'
import { Hero } from '~/components/Hero'
import { OpenBooks } from '~/components/OpenBooks'
import { SiteFooter } from '~/components/SiteFooter'
import { SiteHeader } from '~/components/SiteHeader'
import { Services } from '~/components/services/Services'
import { SelectedWork } from '~/components/work/SelectedWork'
import { useLedger } from '~/lib/use-ledger'
import { getLedger } from '~/server/functions'

export const Route = createFileRoute('/')({
  // Runs at prerender time, so the static HTML carries current ledger figures.
  loader: () => getLedger(),
  component: Home,
})

function Home() {
  // One refresh after hydration, shared by the hero, console and open books.
  const ledger = useLedger(Route.useLoaderData())
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero ledger={ledger} />
        <Compare />
        <Services />
        <SelectedWork />
        <OpenBooks ledger={ledger} />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  )
}
