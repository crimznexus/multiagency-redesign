import { type KeyboardEvent, useRef, useState } from 'react'
import { type Service, services } from '../services/services-data'

type Owner = 'Person' | 'AI' | 'You' | 'NEAR'

interface Step {
  step: string
  owner: Owner
  who: string
  detail: string
}

/** The pipeline for one service: the same six steps, with that service's specifics. */
function pipeline(s: Service, payments: number): Step[] {
  return [
    { step: 'Brief', owner: 'Person', who: 'You and a lead reviewer', detail: `“${s.brief}”` },
    { step: 'Draft', owner: 'AI', who: 'AI, directed by the specialist', detail: s.aiDrafts },
    { step: 'Build', owner: 'Person', who: 'A vetted specialist', detail: s.peopleOwn },
    { step: 'Review', owner: 'Person', who: 'Lead reviewer', detail: 'Checked line by line against the brief.' },
    { step: 'Accept', owner: 'You', who: 'You', detail: 'Nothing ships until you say yes.' },
    {
      step: 'Paid',
      owner: 'NEAR',
      who: 'Treasury proposal on NEAR',
      detail: `The specialist is paid in public, like the ${payments} payouts before.`,
    },
  ]
}

/**
 * The signature moment: pick a kind of project and the six steps re-route.
 * One step is marked AI and carries the only yellow in the panel; clicking a
 * step opens what happens there and who owns it.
 */
export function ProjectConsole({ payments }: { payments: number }) {
  const [active, setActive] = useState(0)
  // Draft is open first: the AI step is the thing people come to check.
  const [open, setOpen] = useState(1)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const service = services[active]

  // ARIA tabs pattern: arrows move focus and selection; Home/End jump.
  const onKeyDown = (e: KeyboardEvent) => {
    const last = services.length - 1
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? active === last
          ? 0
          : active + 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? active === 0
            ? last
            : active - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  if (!service) return null
  const steps = pipeline(service, payments)

  return (
    <div className="border-t-2 border-ink">
      <div
        role="tablist"
        aria-label="Choose a kind of project"
        onKeyDown={onKeyDown}
        className="flex gap-6 overflow-x-auto border-b border-rule [scrollbar-width:none] sm:gap-7"
      >
        {services.map((s, i) => {
          const selected = i === active
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`console-tab-${s.id}`}
              aria-selected={selected}
              aria-controls="console-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`-mb-px min-h-11 border-b-2 pt-3.5 pb-3 text-[15px] font-medium whitespace-nowrap transition-colors ${
                selected ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {s.short}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id="console-panel" aria-labelledby={`console-tab-${service.id}`}>
        <ul className="grid">
          {steps.map((s, i) => {
            const isOpen = i === open
            return (
              <li key={s.step} className="border-b border-rule last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(i)}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-3 py-2.5 text-left transition-colors ${
                    isOpen ? 'bg-ink text-bg' : 'hover:bg-surface'
                  }`}
                >
                  <span className="text-[22px] font-medium tracking-[-0.025em]">{s.step}</span>
                  <span
                    className={`type-label px-1.5 py-0.5 text-[12px] ${
                      s.owner === 'AI' ? 'bg-signal text-on-signal' : isOpen ? 'text-bg' : 'text-muted'
                    }`}
                  >
                    {s.owner}
                  </span>
                  {isOpen && (
                    <span className="col-span-2 grid gap-1.5 pt-2.5 pb-1">
                      <span className="text-[15px] leading-snug">{s.detail}</span>
                      <span className="type-mono opacity-75">{s.who}</span>
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
