import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { type Service, services } from '../services/services-data'

type Owner = 'Person' | 'AI' | 'You' | 'NEAR'

interface Step {
  step: string
  owner: Owner
  who: string
  detail: string
  /** The terse, one-line version the terminal prints */
  note: string
}

type Line = { kind: 'cmd'; text: string } | { kind: 'quote'; text: string } | { kind: 'step'; step: Step }

/** The pipeline for one service: the same six steps, with that service's specifics. */
function pipeline(s: Service, payments: number): Step[] {
  return [
    {
      step: 'Brief',
      owner: 'Person',
      who: 'You and a lead reviewer',
      detail: 'Scoped with you and a lead reviewer.',
      note: 'scoped with a lead reviewer',
    },
    {
      step: 'Draft',
      owner: 'AI',
      who: 'AI, directed by the specialist',
      detail: s.aiDrafts,
      // The first two things AI drafts for this service, e.g. "scripts, storyboards".
      note: s.aiDrafts.split(', ').slice(0, 2).join(', ').replace(/\.$/, '').toLowerCase(),
    },
    { step: 'Build', owner: 'Person', who: 'A vetted specialist', detail: s.peopleOwn, note: 'by a vetted specialist' },
    {
      step: 'Review',
      owner: 'Person',
      who: 'Lead reviewer',
      detail: 'Checked line by line against the brief.',
      note: 'line by line',
    },
    { step: 'Accept', owner: 'You', who: 'You', detail: 'Nothing ships until you say yes.', note: 'when you say yes' },
    {
      step: 'Paid',
      owner: 'NEAR',
      who: 'Treasury proposal on NEAR',
      detail: `Paid in public, like the ${payments} payouts before.`,
      note: 'in public, on chain',
    },
  ]
}

/** What the terminal types for one service: the brief, then the six steps, one line each. */
function script(s: Service, steps: Step[]): Line[] {
  return [
    { kind: 'cmd', text: `multiagency brief --kind ${s.id}` },
    { kind: 'quote', text: `"${s.brief}"` },
    { kind: 'cmd', text: 'multiagency run' },
    ...steps.map((step) => ({ kind: 'step', step }) as const),
  ]
}

const TYPE_MS = 38
const START_MS = 700
const ENTER_MS = 260
const OUTPUT_MS = 150
const NEXT_CMD_MS = 520

/** First word bright, flags dimmed: the whole of the highlighting, in two tokens. */
function Command({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((word, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: words of a fixed string, never reordered
          key={i}
          className={i === 0 ? 'font-medium' : word.startsWith('-') ? 'text-bg/60' : undefined}
        >
          {word}
        </span>
      ))}
    </>
  )
}

const Prompt = () => <span className="text-bg/60 select-none">~ $ </span>
const Cursor = () => <span className="ml-px inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-bg" />

/**
 * Types out one service's pipeline. The layout is rendered in full from the
 * first frame and lines are revealed in place, so nothing below it moves.
 * The cursor holds steady (nothing on the page loops) and reduced motion
 * shows the finished transcript.
 */
function Transcript({ lines }: { lines: Line[] }) {
  const [line, setLine] = useState(0)
  const [char, setChar] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setLine(lines.length)
  }, [lines.length])

  useEffect(() => {
    if (line >= lines.length) return
    const current = lines[line]
    const next = () => {
      setLine((l) => l + 1)
      setChar(0)
    }
    let t: ReturnType<typeof setTimeout>
    if (current?.kind === 'cmd') {
      const start = line === 0 && char === 0 ? START_MS : char === 0 && line > 0 ? NEXT_CMD_MS : 0
      t =
        char < current.text.length
          ? setTimeout(() => setChar((c) => c + 1), start + TYPE_MS + Math.random() * 30)
          : setTimeout(next, ENTER_MS)
    } else {
      t = setTimeout(next, OUTPUT_MS)
    }
    return () => clearTimeout(t)
  }, [line, char, lines])

  const done = line >= lines.length

  return (
    <div className="grid px-3.5 pt-3 pb-3.5 font-mono text-[11.5px] leading-[1.55] sm:px-4">
      {lines.map((l, i) => {
        const shown = i < line
        const typing = i === line
        if (l.kind === 'cmd') {
          const typed = shown ? l.text : typing ? l.text.slice(0, char) : ''
          const rest = shown ? '' : l.text.slice(typed.length)
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed script, never reordered
            <div key={i} className={`${i > 0 ? 'mt-2' : ''} ${shown || typing ? '' : 'invisible'}`}>
              <Prompt />
              <Command text={typed} />
              {typing && <Cursor />}
              <span className="invisible">{rest}</span>
            </div>
          )
        }
        if (l.kind === 'quote') {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed script, never reordered
            <div key={i} className={`pl-[4ch] text-bg/60 ${shown ? '' : 'invisible'}`}>
              {l.text}
            </div>
          )
        }
        const { step, owner, note } = l.step
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed script, never reordered
            key={i}
            className={`grid grid-cols-[7ch_auto] items-baseline gap-x-2.5 pl-[4ch] @xs:grid-cols-[7ch_7ch_minmax(0,1fr)] ${shown ? '' : 'invisible'}`}
          >
            <span className="font-medium">{step}</span>
            <span
              className={`type-label justify-self-start px-1 text-[10px] ${owner === 'AI' ? 'bg-signal text-on-signal' : 'text-bg/60'}`}
            >
              {owner}
            </span>
            <span className="col-span-2 truncate text-bg/75 @xs:col-span-1">{note}</span>
          </div>
        )
      })}
      <div className={`mt-2 ${done ? '' : 'invisible'}`}>
        <Prompt />
        <Cursor />
      </div>
    </div>
  )
}

/**
 * The signature moment, as a terminal: pick a kind of project from the tabs
 * and the pipeline types itself out. One step is marked AI and carries the
 * only yellow in the panel. The typed transcript is decorative; a visually
 * hidden list carries the same six steps for assistive tech.
 * Adapted from Aceternity UI's Terminal (ui.aceternity.com/components/terminal).
 */
export function ProjectTerminal({ payments }: { payments: number }) {
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
    <div className="@container bg-ink text-bg">
      <div className="flex items-center gap-3.5 border-b border-bg/15 pl-3.5 sm:pl-4">
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          <span className="size-2 border border-bg/40" />
          <span className="size-2 border border-bg/40" />
          <span className="size-2 bg-signal" />
        </span>
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
                className={`-mb-px min-h-11 border-b-2 pt-2.5 pb-2 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:outline-bg focus-visible:-outline-offset-2 ${
                  selected ? 'border-bg text-bg' : 'border-transparent text-bg/60 hover:text-bg'
                }`}
              >
                {s.short}
              </button>
            )
          })}
        </div>
        <span aria-hidden="true" className="hidden pr-4 type-mono text-[11.5px] text-bg/60 sm:block">
          bash
        </span>
      </div>

      <div role="tabpanel" id="console-panel" aria-labelledby={`console-tab-${service.id}`}>
        <p className="sr-only">Example brief: {service.brief}</p>
        <ol className="sr-only">
          {steps.map((s) => (
            <li key={s.step}>
              {s.step}, owned by {s.owner}: {s.detail} {s.who}.
            </li>
          ))}
        </ol>
        <div aria-hidden="true">
          <Transcript key={service.id} lines={script(service, steps)} />
        </div>
      </div>
    </div>
  )
}
