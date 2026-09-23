import { type CSSProperties, type KeyboardEvent, useRef, useState } from 'react'
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
    { step: 'Brief', owner: 'Person', who: 'You and a lead reviewer', detail: 'Scoped with you and a lead reviewer.' },
    { step: 'Draft', owner: 'AI', who: 'AI, directed by the specialist', detail: s.aiDrafts },
    { step: 'Build', owner: 'Person', who: 'A vetted specialist', detail: s.peopleOwn },
    { step: 'Review', owner: 'Person', who: 'Lead reviewer', detail: 'Checked line by line against the brief.' },
    { step: 'Accept', owner: 'You', who: 'You', detail: 'Nothing ships until you say yes.' },
    {
      step: 'Paid',
      owner: 'NEAR',
      who: 'Treasury proposal on NEAR',
      detail: `Paid in public, like the ${payments} payouts before.`,
    },
  ]
}

/** The graph's box, in SVG units; nodes and labels are placed in percentages of it. */
const W = 600
const H = 300
/** Where each step sits: a rising zigzag, so labels alternate above and below. */
const POINTS: [number, number][] = [
  [48, 196],
  [148, 110],
  [250, 184],
  [352, 98],
  [454, 170],
  [552, 86],
]

/** A smooth curve through every point (Catmull-Rom, written as cubic Béziers). */
function curve(p: [number, number][]) {
  // Ends repeat their own point, so the curve leaves and arrives flat.
  const at = (i: number) => p[Math.max(0, Math.min(p.length - 1, i))] as [number, number]
  let d = `M${at(0).join(' ')}`
  for (let i = 0; i < p.length - 1; i++) {
    const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6]
    const c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6]
    d += ` C${c1.join(' ')} ${c2.join(' ')} ${c.join(' ')}`
  }
  return d
}
const PATH = curve(POINTS)

/** The first two things AI drafts for a service, e.g. "scripts, storyboards". */
const firstDrafts = (s: Service) => s.aiDrafts.split(', ').slice(0, 2).join(', ').replace(/\.$/, '').toLowerCase()

/**
 * The six steps as a graph: the line draws itself, a yellow spark runs along
 * it once, and each node lights as the spark reaches it. Only the AI node is
 * yellow. Laid out in full from the first frame; the motion is opacity,
 * scale and stroke offset only, and reduced motion shows the finished graph
 * (see `.pg-*` in app.css).
 */
function Graph({ steps }: { steps: Step[] }) {
  return (
    <div className="relative mx-3.5 mt-2 mb-1 aspect-[2/1] sm:mx-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <path d={PATH} pathLength={1} className="pg-track" />
        <path d={PATH} pathLength={1} className="pg-line" />
        <path d={PATH} pathLength={1} className="pg-spark" />
      </svg>
      {steps.map((s, i) => {
        const [x, y] = POINTS[i] as [number, number]
        const above = i % 2 === 1
        const ai = s.owner === 'AI'
        return (
          <div
            key={s.step}
            className="pg-node absolute"
            style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, '--i': i } as CSSProperties}
          >
            <span
              className={`absolute top-0 left-0 block -translate-1/2 rounded-full ${
                ai
                  ? 'size-4 bg-signal shadow-[0_0_0_4px_rgb(243_225_27/0.2),0_0_18px_rgb(243_225_27/0.55)]'
                  : 'size-3 border-[1.5px] border-ink bg-bg'
              }`}
            />
            <span
              className={`absolute left-0 grid -translate-x-1/2 justify-items-center gap-0.5 whitespace-nowrap ${
                above ? 'bottom-3.5' : 'top-3.5'
              }`}
            >
              <span className="text-[12.5px] font-medium leading-none @md:text-[13.5px]">{s.step}</span>
              <span
                className={`type-label px-1 text-[9.5px] leading-[1.5] ${ai ? 'bg-signal text-on-signal' : 'text-ink/70'}`}
              >
                {s.owner}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * The signature moment, as a graph: pick a kind of project from the tabs and
 * the six-step pipeline draws itself, one step marked AI, the last paid on
 * NEAR. Under it, the brief and what AI drafts for that kind of project. The
 * graph is decorative; a visually hidden list carries the same six steps for
 * assistive tech. The panel is frosted glass: the hero video shows through,
 * blurred.
 */
export function ProjectPipeline({ payments }: { payments: number }) {
  const [active, setActive] = useState(0)
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
    <div className="@container border border-ink/15 bg-bg/35 text-ink backdrop-blur-xl backdrop-saturate-150">
      <div className="flex items-center gap-3.5 border-b border-ink/15 pl-3.5 sm:pl-4">
        <div
          role="tablist"
          aria-label="Choose a kind of project"
          onKeyDown={onKeyDown}
          className="flex min-w-0 flex-1 gap-4 overflow-x-auto [scrollbar-width:none] sm:gap-5"
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
                className={`-mb-px min-h-11 border-b-2 pt-2.5 pb-2 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:outline-ink focus-visible:-outline-offset-2 ${
                  selected ? 'border-ink text-ink' : 'border-transparent text-ink/70 hover:text-ink'
                }`}
              >
                {s.short}
              </button>
            )
          })}
        </div>
        <span aria-hidden="true" className="hidden shrink-0 pr-4 type-mono text-[11.5px] text-ink/70 @sm:block">
          6 steps · 1 AI
        </span>
      </div>

      <div role="tabpanel" id="console-panel" aria-labelledby={`console-tab-${service.id}`}>
        <p className="px-3.5 pt-3.5 type-mono text-[11.5px] leading-[1.5] text-ink/70 sm:px-4">
          <span className="sr-only">Example brief: </span>
          <span aria-hidden="true" className="text-ink">
            brief{' '}
          </span>
          {service.brief}
        </p>
        <ol className="sr-only">
          {steps.map((s) => (
            <li key={s.step}>
              {s.step}, owned by {s.owner}: {s.detail} {s.who}.
            </li>
          ))}
        </ol>
        <div aria-hidden="true">
          <Graph key={service.id} steps={steps} />
          <p
            key={`${service.id}-note`}
            className="pg-note flex items-center gap-2 border-t border-ink/15 px-3.5 py-2.5 type-mono text-[11.5px] text-ink/80 sm:px-4"
          >
            <span className="size-2 shrink-0 rounded-full bg-signal" />
            <span className="min-w-0">
              AI drafts <span className="text-ink">{firstDrafts(service)}</span>. People do the rest.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
