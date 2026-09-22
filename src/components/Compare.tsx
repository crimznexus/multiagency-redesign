import { Check, Cross } from './ui/icons'
import { SectionHead } from './ui/primitives'

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

export function Compare() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="page scroll-mt-20 py-section">
      <SectionHead id="compare-title" title="AI speed, without the black box">
        Agencies are slow and opaque. AI tools answer to no one. We kept the speed and put people in charge.
      </SectionHead>

      <div className="panel mt-14 hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">How MultiAgency compares with a typical agency and AI tools alone</caption>
          <thead>
            <tr className="border-b border-cream/8">
              <td className="w-[22%] px-5 py-4" />
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`type-label px-5 py-4 font-medium ${i === 2 ? 'bg-cream/4 text-signal' : 'text-dim'}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-cream/8 last:border-b-0">
                <th scope="row" className="type-label px-5 py-4 align-top font-medium text-dim">
                  {r.label}
                </th>
                {r.cells.map((cell, i) => {
                  const ours = i === 2
                  return (
                    <td key={cell.text} className={`px-5 py-4 align-top ${ours ? 'bg-cream/4' : ''}`}>
                      <span className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md ${
                            cell.good
                              ? ours
                                ? 'bg-signal text-on-signal'
                                : 'bg-cream/8 text-cream'
                              : 'bg-cream/4 text-dim'
                          }`}
                        >
                          {cell.good ? <Check /> : <Cross />}
                          <span className="sr-only">{cell.good ? 'Yes: ' : 'No: '}</span>
                        </span>
                        <span
                          className={
                            ours
                              ? 'font-medium text-cream'
                              : cell.good
                                ? 'text-muted'
                                : 'text-dim line-through decoration-cream/25'
                          }
                        >
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
      </div>

      {/* Phones: one card per row, our answer first (a sideways-scrolling table reads badly here). */}
      <ul className="mt-12 grid gap-3 md:hidden">
        {rows.map((r) => {
          const [agency, tools, ours] = r.cells
          return (
            <li key={r.label} className="panel p-5">
              <p className="type-label text-dim">{r.label}</p>
              <p className="mt-3 flex items-start gap-2.5 font-medium">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-signal text-on-signal">
                  <Check />
                </span>
                <span>
                  <span className="sr-only">MultiAgency: </span>
                  {ours.text}
                </span>
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-cream/8 pt-4 text-sm">
                {[
                  { who: columns[0], cell: agency },
                  { who: columns[1], cell: tools },
                ].map(({ who, cell }) => (
                  <div key={who}>
                    <dt className="text-xs text-dim">{who}</dt>
                    <dd className={`mt-1 ${cell.good ? 'text-muted' : 'text-dim line-through decoration-cream/25'}`}>
                      {cell.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
