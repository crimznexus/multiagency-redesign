import type { LedgerResult } from '~/server/ledger'
import { ProjectConsole } from './console/ProjectConsole'
import { APPLY_LABEL, APPLY_URL, CONTACT_LABEL, CONTACT_URL } from './SiteHeader'
import { ArrowRight } from './ui/icons'

/**
 * Poster hero: the headline runs the full grid, the value prop and the two
 * CTAs sit in the left columns, and the pipeline (a real, working piece of the
 * product) takes the right. Four text elements, nothing else (DESIGN.md §5).
 */
export function Hero({ ledger }: { ledger: LedgerResult }) {
  return (
    <section aria-labelledby="hero-title" className="page pt-10 pb-[clamp(4rem,8vw,5.5rem)] sm:pt-14">
      <h1 id="hero-title" className="type-display rise">
        Build agencies
        <br />
        together.
      </h1>

      <div className="grid12 mt-8 items-start gap-y-10 lg:mt-12">
        <div className="rise flex flex-col gap-8 [animation-delay:80ms] lg:col-span-5">
          <p className="max-w-[36ch] text-lede text-muted">
            Human-led, AI-native agencies for hire. AI writes the first draft. Named people build, review and sign off
            the rest.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={CONTACT_URL} className="btn btn-signal">
              {CONTACT_LABEL}
              <ArrowRight />
            </a>
            <a href={APPLY_URL} className="btn btn-ghost">
              {APPLY_LABEL}
            </a>
          </div>
        </div>

        <div id="how-it-works" className="rise scroll-mt-20 [animation-delay:160ms] lg:col-span-6 lg:col-start-7">
          <ProjectConsole payments={ledger.payments} />
        </div>
      </div>
    </section>
  )
}
