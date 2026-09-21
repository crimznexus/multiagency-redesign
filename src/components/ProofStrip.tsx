import { useLedger } from '~/lib/use-ledger'
import type { LedgerResult } from '~/server/ledger'

export const ACTIVE_PROJECTS = 5

export function ProofStrip({ ledger }: { ledger: LedgerResult }) {
  const { payments, contributors, live } = useLedger(ledger)
  const items = [
    { value: ACTIVE_PROJECTS, label: ['active', 'projects'] },
    { value: contributors, label: ['contributors', 'paid'] },
    { value: payments, label: ['payments, all', 'on the public record'], live },
  ]

  return (
    <dl className="mt-12 grid border-t border-ink md:mt-[clamp(3rem,6vw,5.5rem)] md:grid-cols-3">
      {items.map((item, i) => (
        <div
          key={item.label.join(' ')}
          className={`flex items-baseline gap-3 border-b border-rule py-4 md:border-b-0 md:py-5 md:pr-6 ${
            i > 0 ? 'md:border-l md:pl-6' : ''
          }`}
        >
          <dt className="sr-only">{item.label.join(' ')}</dt>
          <dd className="text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-semibold tracking-[-0.03em] tabular-nums">
            {item.value}
          </dd>
          <dd aria-hidden="true" className="flex items-center gap-2 font-mono text-[13px] leading-snug text-graphite">
            {item.live && (
              <span className="relative size-[7px] shrink-0 rounded-full bg-ink" title="Live from the public ledger">
                <span className="absolute -inset-1 animate-ping rounded-full border border-ink [animation-duration:2.4s]" />
              </span>
            )}
            <span>
              {item.label[0]}
              <br />
              {item.label[1]}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
