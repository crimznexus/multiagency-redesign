import { m } from 'motion/react'
import type { LedgerResult } from '~/server/ledger'
import { ProofStrip } from '../ProofStrip'
import { ReviewWorkspace } from './ReviewWorkspace'

export function Hero({ ledger }: { ledger: LedgerResult }) {
  return (
    <section aria-labelledby="hero-title" className="pt-[clamp(2.5rem,6vw,5rem)]">
      <div className="page">
        <div className="grid items-start gap-[clamp(2rem,4vw,4rem)] xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="max-w-2xl xl:pt-[clamp(0rem,4vw,3.5rem)]">
            <p className="inline-flex items-center gap-2.5 font-mono text-[12.5px] leading-none font-medium text-graphite">
              <span aria-hidden="true" className="h-[1.5px] w-[18px] bg-pencil" />
              Human-led · AI-native agency
            </p>

            <h1 id="hero-title" className="mt-[22px] text-display font-semibold text-balance">
              We draft with AI and ship with{' '}
              <span className="relative whitespace-nowrap">
                people.
                {/* One hand-drawn pencil stroke under the human part. */}
                <svg
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute -bottom-[0.14em] -left-[2%] h-[0.22em] w-[104%] overflow-visible"
                >
                  <m.path
                    d="M3 8 C 40 3, 90 3, 130 6 S 185 9, 197 4"
                    className="fill-none stroke-pencil"
                    strokeWidth={3}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.2, 0.7, 0.1, 1] }}
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-lede text-graphite">
              We build <strong className="font-medium text-ink">products, automations and content</strong> with a
              network of vetted specialists. AI does the first draft; a named person reviews every piece of work before
              it reaches you.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center gap-2.5 rounded-sm bg-ink px-[18px] text-[15px] font-medium text-paper transition hover:bg-ink-soft active:translate-y-px"
              >
                Start a project <span aria-hidden="true">→</span>
              </a>
              <a
                href="#work"
                className="inline-flex min-h-11 items-center text-[15px] font-medium underline decoration-1 underline-offset-[5px]"
              >
                See the work <span aria-hidden="true">&nbsp;↓</span>
              </a>
            </div>
          </div>

          <ReviewWorkspace />
        </div>

        <ProofStrip ledger={ledger} />
      </div>
    </section>
  )
}
