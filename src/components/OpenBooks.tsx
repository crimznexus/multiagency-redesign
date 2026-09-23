import { TREASURY_ACCOUNT } from '~/lib/ledger'
import type { LedgerResult } from '~/server/ledger'
import { ArrowRight, ArrowUpRight } from './ui/icons'
import { ExternalLink } from './ui/primitives'

const EXPLORER = 'https://nearblocks.io/address/'

const month = (m: string, style: 'short' | 'long' = 'short') =>
  new Date(`${m}-01T00:00:00Z`).toLocaleDateString('en-US', { month: style, timeZone: 'UTC' })
const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

/** Long account IDs (hex implicit accounts) shortened in the middle. */
const shortAccount = (id: string) => (id.length > 24 ? `${id.slice(0, 10)}…${id.slice(-8)}` : id)

/**
 * The proof section: two figures at poster scale, the monthly shape of the
 * record as bars, and the most recent payouts. Read from the chain, with the
 * status line saying which reading you are looking at.
 */
export function OpenBooks({ ledger }: { ledger: LedgerResult }) {
  const { payments, contributors, since, byMonth, latest, live, fetchedAt } = ledger
  const current = fetchedAt.slice(0, 7)
  const tallest = Math.max(1, ...byMonth.map((m) => m.count))
  const start = since ? `${month(since.slice(0, 7))} ${since.slice(0, 4)}` : null

  return (
    <section
      id="open-books"
      aria-labelledby="books-title"
      className="scroll-mt-16 [contain-intrinsic-size:auto_1100px] [content-visibility:auto]"
    >
      <div className="page grid12 py-section md:grid-cols-12">
        <div className="md:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <p className="type-label mb-5 text-muted">Open books</p>
          <h2 id="books-title" className="type-h2">
            Every payout is public.
          </h2>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-muted">
            Specialists are paid from a Sputnik DAO treasury on NEAR. Each payout is a voted proposal, read here
            straight from the chain.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 font-medium">
            <ExternalLink href={`${EXPLORER}${TREASURY_ACCOUNT}`} className="link">
              Verify on NearBlocks <ArrowUpRight />
            </ExternalLink>
            <a href="https://multiagency.ai/treasury" className="link">
              Open the treasury <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-10 md:col-span-7 md:mt-0 lg:col-span-6 lg:col-start-7">
          <p className="type-mono text-muted">
            {live
              ? `Live from ${TREASURY_ACCOUNT}`
              : `Live ledger unreachable. Showing the last reading, ${day(fetchedAt)}.`}
          </p>

          <dl className="mt-3 grid grid-cols-2 border-t-2 border-ink">
            <div className="flex flex-col-reverse pt-4 pr-5">
              <dt className="mt-2 text-sm text-muted">payouts approved{start ? ` since ${start}` : ''}</dt>
              <dd className="type-num text-[clamp(2.75rem,1.6rem+3vw,4.5rem)]">{payments}</dd>
            </div>
            <div className="flex flex-col-reverse border-l border-rule pt-4 pr-5 pl-5 sm:pl-6">
              <dt className="mt-2 text-sm text-muted">builders paid</dt>
              <dd className="type-num text-[clamp(2.75rem,1.6rem+3vw,4.5rem)]">{contributors}</dd>
            </div>
          </dl>

          <figure className="mt-9">
            <div aria-hidden="true" className="flex h-24 items-end gap-3 border-b-2 border-ink sm:h-28 sm:gap-4">
              {byMonth.map(({ month: m, count }) => (
                <div key={m} className="flex h-full flex-1 flex-col justify-end gap-1.5">
                  <span className="type-mono font-medium">{count}</span>
                  <span
                    className={`bar-grow w-full ${m === current ? 'border-t-2 border-ink bg-ink/25' : 'bg-ink'}`}
                    style={{ height: `${(count / tallest) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="flex gap-3 pt-2 sm:gap-4">
              {byMonth.map(({ month: m }) => (
                <span key={m} className="type-mono flex-1 text-muted">
                  {month(m)}
                </span>
              ))}
            </div>
            <figcaption className="mt-3 text-sm text-muted">
              Payouts per month{byMonth.length > 0 ? `, ${current.slice(0, 4)}` : ''}. This month to date.
            </figcaption>
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

          {latest.length > 0 && (
            <table className="mt-9 w-full border-collapse text-left">
              <caption className="type-label border-t-2 border-ink pt-3 pb-1 text-left text-muted">
                Latest payouts
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Proposal</th>
                  <th scope="col">Paid to</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {latest.slice(0, 3).map((p) => (
                  <tr key={p.id} className="border-t border-rule">
                    <td className="type-mono py-2 pr-4 text-muted">#{p.id}</td>
                    <td className="py-2 pr-4">
                      <ExternalLink
                        href={`${EXPLORER}${p.recipient}`}
                        className="type-mono underline decoration-rule underline-offset-4 hover:decoration-ink"
                      >
                        {shortAccount(p.recipient)}
                      </ExternalLink>
                    </td>
                    <td className="type-mono py-2 text-right whitespace-nowrap text-muted">{day(p.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  )
}
