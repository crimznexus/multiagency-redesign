import { APPLY_URL, CONTACT_LABEL, CONTACT_URL } from './SiteHeader'
import { ArrowRight } from './ui/icons'

export function ClosingCta() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="page scroll-mt-20 pb-section">
      <div className="panel relative isolate overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_50%_100%,rgb(247_238_27/0.09),transparent_70%)]"
        />
        <h2 id="cta-title" className="type-h2 mx-auto max-w-[18ch] sm:text-[clamp(2.5rem,1.5rem+3.5vw,4.25rem)]">
          Hire people. <span className="text-signal">Keep the AI speed.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-[34rem] text-lede text-muted">
          Tell us what you’re making, who it’s for and what done looks like. We’ll turn it into your first brief.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={CONTACT_URL} className="btn btn-signal min-h-12 px-6">
            {CONTACT_LABEL}
            <ArrowRight />
          </a>
          <a href={APPLY_URL} className="btn btn-ghost min-h-12 px-6">
            Join as a builder
          </a>
        </div>
      </div>
    </section>
  )
}
