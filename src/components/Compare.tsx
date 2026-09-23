import { Check, Cross } from './ui/icons'

type Cell = { text: string; good: boolean }

const columns = ['A typical agency', 'AI tools alone', 'MultiAgency'] as const
const short = ['Agency', 'AI', 'MultiAgency'] as const

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
 * rather than above it, so the section is about half as tall. One table at
 * every width: on phones the other two columns show only their mark. Our
 * column is the only filled one: the answer you are meant to read.
 */
export function Compare() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-16">
      <div className="page grid12 items-start py-[clamp(3.5rem,9vw,7.5rem)]">
        <div className="lg:col-span-4">
          <h2 id="compare-title" className="type-h2 max-w-[14ch]">
            AI speed, without the black box.
          </h2>
          <p className="mt-5 max-w-[36ch] text-[17px] leading-relaxed text-muted">
            Agencies are slow. AI answers to no one. We kept the speed and put people in charge.
          </p>
        </div>

        <table className="mt-8 w-full table-fixed border-collapse text-left md:mt-10 lg:col-span-8 lg:mt-0">
          <caption className="sr-only">How MultiAgency compares with a typical agency and AI tools alone</caption>
          <colgroup>
            <col className="w-[31%] md:w-[24%]" />
            <col className="w-[13%] md:w-auto" />
            <col className="w-[13%] md:w-auto" />
            <col className="w-[43%] md:w-auto" />
          </colgroup>
          <thead>
            <tr className="border-b-2 border-ink">
              <td className="px-2 py-2.5 md:px-3 md:py-3" />
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`py-2.5 text-[11px] leading-tight font-medium md:px-3 md:py-3 md:text-left md:text-[14px] ${
                    i === 2 ? 'bg-signal px-2 text-on-signal' : 'px-0.5 text-center text-muted'
                  }`}
                >
                  {/* Phones get the short name; the full one stays the header's accessible name. */}
                  <span aria-hidden="true" className="md:hidden">
                    {short[i]}
                  </span>
                  <span className="sr-only md:not-sr-only">{c}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-rule">
                <th
                  scope="row"
                  className="px-2 py-2.5 align-top text-[13px] font-medium md:px-3 md:py-3 md:text-[15px]"
                >
                  {r.label}
                </th>
                {r.cells.map((cell, i) => {
                  const ours = i === 2
                  return (
                    <td
                      key={cell.text}
                      className={`py-2.5 align-top text-[13px] md:px-3 md:py-3 md:text-[15px] ${
                        ours ? 'bg-signal px-2 font-medium text-on-signal' : 'px-0.5'
                      }`}
                    >
                      <span
                        className={`flex items-start gap-2 md:justify-start md:gap-2.5 ${ours ? '' : 'justify-center'}`}
                      >
                        <span className={`mt-[3px] shrink-0 ${ours || cell.good ? '' : 'text-muted'}`}>
                          {cell.good ? <Check /> : <Cross />}
                          <span className="sr-only">{cell.good ? 'Yes: ' : 'No: '}</span>
                        </span>
                        {/* Phones show only the mark for the other two; the words stay for screen readers. */}
                        <span
                          className={
                            ours
                              ? ''
                              : `sr-only md:not-sr-only ${cell.good ? '' : 'text-muted line-through decoration-rule'}`
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
    </section>
  )
}
