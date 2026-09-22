import { TREASURY_ACCOUNT } from '~/lib/ledger'
import type { LedgerResult } from '~/server/ledger'
import { ArrowUpRight } from './ui/icons'
import { ExternalLink, LiveDot, SectionHead } from './ui/primitives'

const EXPLORER = 'https://nearblocks.io/address/'

const month = (m: string, style: 'short' | 'long' = 'short') =>
  new Date(`${m}-01T00:00:00Z`).toLocaleDateString('en-US', { month: style, timeZone: 'UTC' })
const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/** Long account IDs (hex implicit accounts) shortened in the middle. */
const shortAccount = (id: string) => (id.length > 24 ? `${id.slice(0, 10)}…${id.slice(-8)}` : id)

export function OpenBooks({ ledger }: { ledger: LedgerResult }) {
  const { payments, contributors, since, byMonth, latest, live, fetchedAt } = ledger
  const current = fetchedAt.slice(0, 7)
  const tallest = Math.max(1, ...byMonth.map((m) => m.count))

  const kpis = [
    { label: 'Payouts approved', value: String(payments) },
    { label: 'Builders paid', value: String(contributors) },
    { label: 'First payout', value: since ? `${month(since.slice(0, 7))} ${since.slice(0, 4)}` : 'Not yet' },
  ]

  return (
    <section
      id="open-books"
      aria-labelledby="books-title"
      className="scroll-mt-20 border-y border-cream/8 bg-canvas-2 [contain-intrinsic-size:auto_1300px] [content-visibility:auto]"
    >
      <div className="page py-section">
        <SectionHead id="books-title" pill="Open books" title="Every payout, on the public record">
          Builders are paid from a treasury on NEAR. Each payout is a proposal that people vote on, and it stays
          on-chain for anyone to check, including you.
        </SectionHead>

        <div className="panel mt-14 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-cream/8 px-5 py-3.5">
            <span className="type-label inline-flex items-center gap-2 text-muted">
              <LiveDot live={live} />
              {live ? 'Live' : 'Last reading'}
            </span>
            <span className="font-mono text-xs text-dim [overflow-wrap:anywhere]">{TREASURY_ACCOUNT}</span>
            <ExternalLink
              href={`${EXPLORER}${TREASURY_ACCOUNT}`}
              className="ml-auto inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-cream hover:text-signal"
            >
              Verify on NearBlocks <ArrowUpRight />
            </ExternalLink>
          </div>

          <dl className="grid grid-cols-1 gap-px border-b border-cream/8 bg-cream/8 sm:grid-cols-3">
            {kpis.map((k) => (
              <div key={k.label} className="flex flex-col-reverse bg-panel px-5 py-6 sm:px-7">
                <dt className="type-label mt-3 text-dim">{k.label}</dt>
                <dd className="type-figure">{k.value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid lg:grid-cols-12">
            <figure className="border-b border-cream/8 p-5 sm:p-7 lg:col-span-7 lg:border-r lg:border-b-0">
              <figcaption className="type-label text-dim">Payouts per month</figcaption>
              <div aria-hidden="true" className="mt-6 flex h-56 items-end gap-3 border-b border-cream/12 sm:gap-6">
                {byMonth.map(({ month: m, count }) => (
                  <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="font-mono text-sm font-semibold tabular-nums">{count}</span>
                    <span
                      className={`w-full max-w-16 rounded-t-md ${m === current ? 'border-2 border-b-0 border-dashed border-signal bg-signal/10' : 'bg-signal'}`}
                      style={{ height: `${(count / tallest) * 78}%` }}
                    />
                  </div>
                ))}
              </div>
              <div aria-hidden="true" className="flex gap-3 pt-2.5 sm:gap-6">
                {byMonth.map(({ month: m }) => (
                  <span key={m} className="flex-1 text-center font-mono text-xs text-dim">
                    {month(m)}
                    {m === current && <span className="block text-[10px]">so far</span>}
                  </span>
                ))}
              </div>
              <table className="sr-only">
                <caption>Approved payouts per month</caption>
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">Payouts</th>
                  </tr>
                </thead>
                <tbody>
                  {byMonth.map(({ month: m, count }) => (
                    <tr key={m}>
                      <th scope="row">
                        {month(m, 'long')} {m.slice(0, 4)}
                        {m === current ? ' (so far)' : ''}
                      </th>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>

            <div className="p-5 sm:p-7 lg:col-span-5">
              <h3 className="type-label text-dim">Latest payouts</h3>
              {latest.length > 0 ? (
                <table className="mt-4 w-full border-collapse text-left text-sm">
                  <caption className="sr-only">The most recent approved payouts</caption>
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">Proposal</th>
                      <th scope="col">Paid to</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latest.map((p) => (
                      <tr key={p.id} className="border-t border-cream/8 first:border-t-0">
                        <td className="py-3 pr-3 font-mono text-xs text-dim tabular-nums">#{p.id}</td>
                        <td className="py-3 pr-3">
                          <ExternalLink
                            href={`${EXPLORER}${p.recipient}`}
                            className="font-mono text-xs text-cream underline decoration-cream/20 underline-offset-4 hover:decoration-signal"
                          >
                            {shortAccount(p.recipient)}
                          </ExternalLink>
                        </td>
                        <td className="py-3 text-right font-mono text-xs whitespace-nowrap text-muted">
                          {day(p.paidAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-4 rounded-row border border-dashed border-cream/12 p-4 text-sm text-muted">
                  The live feed is unavailable right now. The full record is always on{' '}
                  <ExternalLink
                    href={`${EXPLORER}${TREASURY_ACCOUNT}`}
                    className="text-cream underline underline-offset-4"
                  >
                    NearBlocks
                  </ExternalLink>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
