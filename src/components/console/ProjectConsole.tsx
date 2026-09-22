import { type KeyboardEvent, useRef, useState } from 'react'
import { type Service, services } from '../services/services-data'
import { ArrowRight, Check, Person, Spark } from '../ui/icons'

type Owner = 'ai' | 'human' | 'chain'

interface Row {
  n: string
  step: string
  owner: Owner
  who: string
  detail: string
}

/** The pipeline for one service: the same six steps, with that service's specifics. */
function pipeline(s: Service, payments: number): Row[] {
  return [
    { n: '01', step: 'Brief', owner: 'human', who: 'You + lead reviewer', detail: `“${s.brief}”` },
    { n: '02', step: 'Draft', owner: 'ai', who: 'AI, directed by the specialist', detail: s.aiDrafts },
    { n: '03', step: 'Build', owner: 'human', who: 'Vetted specialist', detail: s.peopleOwn },
    {
      n: '04',
      step: 'Review',
      owner: 'human',
      who: 'Lead reviewer',
      detail: 'Checked line by line against the brief.',
    },
    { n: '05', step: 'Accept', owner: 'human', who: 'You', detail: 'Nothing ships until you say yes.' },
    {
      n: '06',
      step: 'Paid',
      owner: 'chain',
      who: 'Treasury proposal on NEAR',
      detail: `The specialist is paid in public, like the ${payments} payouts before.`,
    },
  ]
}

function OwnerBadge({ owner }: { owner: Owner }) {
  if (owner === 'ai')
    return (
      <span className="type-label inline-flex items-center gap-1.5 rounded-full border border-dashed border-cream/25 px-2.5 py-1 text-muted">
        <Spark /> AI
      </span>
    )
  if (owner === 'chain')
    return (
      <span className="type-label inline-flex items-center gap-1.5 rounded-full border border-cream/20 bg-cream/8 px-2.5 py-1 text-cream">
        <Check /> On-chain
      </span>
    )
  return (
    <span className="type-label inline-flex items-center gap-1.5 rounded-full bg-signal px-2.5 py-1 text-on-signal">
      <Person /> Human
    </span>
  )
}

export function ProjectConsole({ payments }: { payments: number }) {
  const [active, setActiveState] = useState(0)
  // Cross-fade only answers a tab change, never the first paint.
  const [changed, setChanged] = useState(false)
  const setActive = (i: number) => {
    setActiveState(i)
    setChanged(true)
  }
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
  const rows = pipeline(service, payments)
  const automated = rows.filter((r) => r.owner === 'ai').length

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-cream/8 px-5 py-4">
        <h2 className="font-semibold tracking-[-0.01em]">How a project runs</h2>
        <p className="text-sm text-dim">Choose a kind of project to see its steps.</p>
      </div>

      <div className="grid md:grid-cols-[15rem_minmax(0,1fr)]">
        {/* biome-ignore lint/a11y/useSemanticElements: an ARIA tablist is the correct pattern for these tabs */}
        <div
          role="tablist"
          aria-label="Choose a kind of project"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="grid grid-cols-2 gap-1.5 border-b border-cream/8 p-3 md:grid-cols-1 md:content-start md:border-r md:border-b-0"
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
                className={`flex min-h-11 flex-col items-start rounded-row border px-3 py-2.5 text-left transition-colors ${
                  selected
                    ? 'border-cream/12 bg-panel-2 text-cream'
                    : 'border-transparent text-muted hover:bg-cream/4 hover:text-cream'
                }`}
              >
                <span className="text-sm font-semibold">{s.name}</span>
                <span className="mt-0.5 hidden text-xs text-dim md:block">{s.tagline}</span>
              </button>
            )
          })}
        </div>

        <div role="tabpanel" id="console-panel" aria-labelledby={`console-tab-${service.id}`} className="p-3 sm:p-5">
          {/* key: remount on tab change so the rows cross-fade in (opacity only). */}
          <ol
            key={service.id}
            className={`relative grid gap-1.5 ${changed ? 'motion-safe:animate-[fade-in_200ms_ease-out]' : ''}`}
          >
            {rows.map((r) => (
              <li
                key={r.n}
                className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-row px-3 py-3 sm:grid-cols-[2rem_7rem_minmax(0,1fr)_auto] sm:items-center ${
                  r.owner === 'ai' ? 'bg-transparent' : 'bg-cream/[0.025]'
                }`}
              >
                <span className="font-mono text-xs text-dim tabular-nums">{r.n}</span>
                <span className="text-sm font-semibold">{r.step}</span>
                <span className="col-start-2 min-w-0 sm:col-start-3">
                  <span className="block text-sm text-muted">{r.detail}</span>
                  <span className="type-label mt-0.5 block text-[11px] text-dim">{r.who}</span>
                </span>
                <span className="col-start-2 sm:col-start-4 sm:justify-self-end">
                  <OwnerBadge owner={r.owner} />
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-row border border-cream/8 bg-canvas/40 px-4 py-3">
            <p className="text-sm text-muted">
              <span className="font-mono text-cream">{automated}</span> of {rows.length} steps automated. The rest are
              owned by people you can name.
            </p>
            <a
              href="#open-books"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-cream hover:text-signal"
            >
              See the payouts <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
