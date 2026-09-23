import { createFileRoute } from '@tanstack/react-router'
import { AgencyTemplate } from '~/components/AgencyTemplate'
import { Compare } from '~/components/Compare'
import { Faq } from '~/components/Faq'
import { Hero } from '~/components/Hero'
import { LOOP_POSTER } from '~/components/LoopVideo'
import { OpenBooks } from '~/components/OpenBooks'
import { SiteFooter } from '~/components/SiteFooter'
import { SiteHeader } from '~/components/SiteHeader'
import { SelectedWork } from '~/components/work/SelectedWork'
import { useLedger } from '~/lib/use-ledger'
import { getLedger } from '~/server/functions'

export const Route = createFileRoute('/')({
  // Runs at prerender time, so the static HTML carries current ledger figures.
  loader: () => getLedger(),
  // The hero video's poster fills the first screen, so it is the LCP candidate: fetch it with the CSS.
  head: () => ({
    links: [{ rel: 'preload', href: LOOP_POSTER, as: 'image', type: 'image/webp', fetchPriority: 'high' }],
  }),
  component: Home,
})

function Home() {
  // One refresh after hydration, shared by the hero console and open books.
  const ledger = useLedger(Route.useLoaderData())
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero ledger={ledger} />
        <OpenBooks ledger={ledger} />
        <Compare />
        <SelectedWork />
        <AgencyTemplate />
        <Faq />
      </main>
      <SiteFooter />
    </>
  )
}
