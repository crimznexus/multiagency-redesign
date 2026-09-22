import { Check, Cross } from './ui/icons'

type Cell = { text: string; good: boolean }

const columns = ['A typical agency', 'AI tools alone', 'MultiAgency'] as const

const rows: { label: string; cells: [Cell, Cell, Cell] }[] = [
  {
    label: 'First draft',
    cells: [
      { text: 'Weeks, after scoping calls', good: false },
      { text: 'Minutes', good: true },
      { text: 'Hours', good: true },
    ],
  },
  {
    label: 'Who is accountable',
    cells: [
      { text: 'An account manager', good: false },
      { text: 'No one', good: false },
      { text: 'A named specialist and reviewer', good: true },
    ],
  },
  {
    label: 'Quality check',
    cells: [
      { text: 'Internal and unseen', good: false },
      { text: 'Whatever you catch', good: false },
      { text: 'Reviewed against your written brief', good: true },
    ],
  },
  {
    label: 'Where your money goes',
    cells: [
      { text: 'Margins you never see', good: false },
      { text: 'A subscription', good: false },
      { text: 'Every payout public on NEAR', good: true },
    ],
  },
  {
    label: 'Ships without your yes',
    cells: [
      { text: 'Sometimes', good: false },
      { text: 'You are the reviewer', good: false },
      { text: 'Never', good: true },
    ],
  },
]

/** Our column is the only filled one: the answer you are meant to read. */
export function Compare() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-16 border-t border-rule">
      <div className="page py-section">
        <h2 id="compare-title" className="type-h2 max-w-[18ch]">
          AI speed, without the black box.
        </h2>
        <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-muted">
          Agencies are slow and opaque. AI tools answer to no one. We kept the speed and put people in charge.
        </p>

        <table className="mt-14 hidden w-full border-collapse text-left md:table">
          <caption className="sr-only">How MultiAgency compares with a typical agency and AI tools alone</caption>
          <thead>
            <tr className="border-b-2 border-ink">
              <td className="w-[22%] px-4 py-4" />
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`px-4 py-4 text-[15px] font-medium ${i === 2 ? 'bg-signal text-on-signal' : 'text-muted'}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-rule">
                <th scope="row" className="px-4 py-4.5 align-top font-medium">
                  {r.label}
                </th>
                {r.cells.map((cell, i) => {
                  const ours = i === 2
                  return (
                    <td
                      key={cell.text}
                      className={`px-4 py-4.5 align-top ${ours ? 'bg-signal font-medium text-on-signal' : ''}`}
                    >
                      <span className="flex items-start gap-2.5">
                        <span className={`mt-1 shrink-0 ${ours || cell.good ? '' : 'text-muted'}`}>
                          {cell.good ? <Check /> : <Cross />}
                          <span className="sr-only">{cell.good ? 'Yes: ' : 'No: '}</span>
                        </span>
                        <span className={ours ? '' : cell.good ? '' : 'text-muted line-through decoration-rule'}>
                          {cell.text}
                        </span>
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phones: one block per row, our answer first (a sideways table reads badly here). */}
        <ul className="mt-10 border-t-2 border-ink md:hidden">
          {rows.map((r) => {
            const [agency, tools, ours] = r.cells
            return (
              <li key={r.label} className="border-b border-rule py-5">
                <p className="text-sm text-muted">{r.label}</p>
                <p className="mt-2 inline-flex items-center gap-2 bg-signal px-2 py-1 font-medium text-on-signal">
                  <Check />
                  <span>
                    <span className="sr-only">MultiAgency: </span>
                    {ours.text}
                  </span>
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-muted">
                  {[
                    { who: columns[0], cell: agency },
                    { who: columns[1], cell: tools },
                  ].map(({ who, cell }) => (
                    <div key={who}>
                      <dt className="text-xs">{who}</dt>
                      <dd className={`mt-1 ${cell.good ? '' : 'line-through decoration-rule'}`}>{cell.text}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
