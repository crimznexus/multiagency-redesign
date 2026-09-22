import type { LedgerResult } from '~/server/ledger'
import { ProjectConsole } from './console/ProjectConsole'
import { CONTACT_LABEL, CONTACT_URL } from './SiteHeader'
import { ArrowRight } from './ui/icons'
import { LiveDot } from './ui/primitives'

export function Hero({ ledger }: { ledger: LedgerResult }) {
  const { payments, contributors, live } = ledger
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Atmosphere: one soft light from above, nothing else (DESIGN.md §7). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgb(247_238_27/0.06),transparent_70%)]"
      />

      <div className="page flex flex-col items-center pt-[clamp(3rem,8vw,6rem)] text-center">
        {/* The one live indicator above the fold: real data, links to the record. */}
        <a href="#open-books" className="pill transition-colors hover:border-cream/20 hover:text-cream">
          <LiveDot live={live} />
          {payments} public payouts to {contributors} builders
        </a>

        <h1 id="hero-title" className="type-display mt-7 max-w-[15ch]">
          The AI-native agency <span className="text-signal">that shows its work.</span>
        </h1>

        <p className="mt-6 max-w-[34rem] text-lede text-muted">
          Products, bots, video and social for teams on NEAR. AI drafts fast, named specialists ship, every payout is
          public.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={CONTACT_URL} className="btn btn-signal min-h-12 px-6">
            {CONTACT_LABEL}
            <ArrowRight />
          </a>
          <a href="#how-it-works" className="btn btn-ghost min-h-12 px-6">
            See how it works
          </a>
        </div>
      </div>

      <div id="how-it-works" className="page mt-[clamp(3.5rem,7vw,5rem)] scroll-mt-24">
        <div className="mx-auto max-w-[64rem]">
          <ProjectConsole payments={payments} />
        </div>
      </div>
    </section>
  )
}
