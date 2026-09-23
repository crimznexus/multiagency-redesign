import { Check, Cross } from './ui/icons'

type Cell = { text: string; good: boolean }

const columns = ['A typical agency', 'AI tools alone', 'MultiAgency'] as const

const rows: { label: string; cells: [Cell, Cell, Cell] }[] = [
  {
    label: 'First draft',
    cells: [
      { text: 'Weeks', good: false },
      { text: 'Minutes', good: true },
      { text: 'Hours', good: true },
    ],
  },
  {
    label: 'Accountable',
    cells: [
      { text: 'Account manager', good: false },
      { text: 'No one', good: false },
      { text: 'Named specialist', good: true },
    ],
  },
  {
    label: 'Quality check',
    cells: [
      { text: 'Unseen', good: false },
      { text: 'Up to you', good: false },
      { text: 'Against your brief', good: true },
    ],
  },
  {
    label: 'Your money',
    cells: [
      { text: 'Hidden margins', good: false },
      { text: 'A subscription', good: false },
      { text: 'Public on NEAR', good: true },
    ],
  },
  {
    label: 'Ships without you',
    cells: [
      { text: 'Sometimes', good: false },
      { text: 'You check it all', good: false },
      { text: 'Never', good: true },
    ],
  },
]

/**
 * Why us, in five short rows. From `lg` the argument sits beside the table
 * rather than above it, so the section is about half as tall. Our column is
 * the only filled one: the answer you are meant to read.
 */
export function Compare() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-16 border-t border-rule">
      <div className="page grid12 items-start py-section">
        <div className="lg:col-span-4">
          <h2 id="compare-title" className="type-h2 max-w-[14ch]">
            AI speed, without the black box.
          </h2>
          <p className="mt-5 max-w-[36ch] text-[17px] leading-relaxed text-muted">
            Agencies are slow. AI answers to no one. We kept the speed and put people in charge.
          </p>
        </div>

        <table className="mt-10 hidden w-full border-collapse text-left md:table lg:col-span-8 lg:mt-0">
          <caption className="sr-only">How MultiAgency compares with a typical agency and AI tools alone</caption>
          <thead>
            <tr className="border-b-2 border-ink">
              <td className="w-[24%] px-3 py-3" />
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`px-3 py-3 text-[14px] font-medium ${i === 2 ? 'bg-signal text-on-signal' : 'text-muted'}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-rule">
                <th scope="row" className="px-3 py-3 align-top text-[15px] font-medium">
                  {r.label}
                </th>
                {r.cells.map((cell, i) => {
                  const ours = i === 2
                  return (
                    <td
                      key={cell.text}
                      className={`px-3 py-3 align-top text-[15px] ${ours ? 'bg-signal font-medium text-on-signal' : ''}`}
                    >
                      <span className="flex items-start gap-2.5">
                        <span className={`mt-[3px] shrink-0 ${ours || cell.good ? '' : 'text-muted'}`}>
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
        <ul className="mt-8 border-t-2 border-ink md:hidden">
          {rows.map((r) => {
            const [agency, tools, ours] = r.cells
            return (
              <li key={r.label} className="border-b border-rule py-3.5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted">{r.label}</p>
                  <p className="inline-flex items-center gap-2 bg-signal px-2 py-1 text-[15px] font-medium text-on-signal">
                    <Check />
                    <span>
                      <span className="sr-only">MultiAgency: </span>
                      {ours.text}
                    </span>
                  </p>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-3 text-sm text-muted">
                  {[
                    { who: 'Agency', cell: agency },
                    { who: 'AI tools', cell: tools },
                  ].map(({ who, cell }) => (
                    <div key={who} className="flex gap-1.5">
                      <dt className="text-xs leading-5">{who}:</dt>
                      <dd className={`leading-5 ${cell.good ? '' : 'line-through decoration-rule'}`}>{cell.text}</dd>
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
