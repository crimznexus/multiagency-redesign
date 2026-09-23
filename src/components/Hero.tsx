import type { LedgerResult } from '~/server/ledger'
import { ProjectPipeline } from './console/ProjectPipeline'
import { HeroVideo } from './HeroVideo'
import { APPLY_LABEL, APPLY_URL, CONTACT_LABEL, CONTACT_URL } from './SiteHeader'
import { ArrowRight } from './ui/icons'

/**
 * Split hero: the headline, the value prop and the two CTAs take the left
 * seven columns, and the pipeline graph (a real, working piece of the
 * product) takes the right. Four text elements, nothing else (DESIGN.md §5).
 * Behind them, full bleed, a looping dot-matrix video (HeroVideo).
 */
export function Hero({ ledger }: { ledger: LedgerResult }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate -mt-18 pt-18">
      <HeroVideo />
      <div className="page grid12 pt-10 pb-[clamp(4rem,8vw,5.5rem)] sm:pt-14 items-center gap-y-12 md:grid-cols-12">
        <div className="flex flex-col gap-8 md:col-span-6 lg:col-span-7">
          <h1
            id="hero-title"
            className="type-display rise md:text-[clamp(2.5rem,0.2rem+5.2vw,4.5rem)] lg:text-[clamp(4rem,0.5rem+5.4vw,6.75rem)]"
          >
            Build agencies
            <br />
            together.
          </h1>
          <p className="rise max-w-[36ch] text-lede text-muted [animation-delay:80ms]">
            Human-led, AI-native agencies for hire. AI writes the first draft. Named people build, review and sign off
            the rest.
          </p>
          <div className="rise flex flex-wrap gap-3 [animation-delay:80ms]">
            <a href={CONTACT_URL} className="btn btn-signal btn-lit rounded-full px-6">
              {CONTACT_LABEL}
              <ArrowRight />
            </a>
            <a href={APPLY_URL} className="btn btn-ghost rounded-full border-ink/40 px-6 backdrop-blur-md">
              {APPLY_LABEL}
            </a>
          </div>
        </div>

        <div
          id="how-it-works"
          className="rise scroll-mt-20 [animation-delay:160ms] md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8"
        >
          <ProjectPipeline payments={ledger.payments} />
        </div>
      </div>
    </section>
  )
}
