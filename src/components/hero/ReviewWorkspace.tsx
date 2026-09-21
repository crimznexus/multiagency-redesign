import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import {
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Preview } from './previews'
import { editedLine, isEdited, type Scene, scenes } from './scenes'
import { type Phase, reached, SCENE_MS, stepFor, useReviewTimeline } from './use-review-timeline'

const ease = [0.2, 0.7, 0.1, 1] as const
const STEPS = ['Brief', 'AI draft', 'Review', 'Approved'] as const

interface Point {
  x: number
  y: number
}
interface Layout {
  cursorFrom: Point
  cursorTo: Point
  comment: Point & { width: number }
}

/**
 * The hero's signature piece: a work tool where an AI draft is reviewed by a
 * person. Cycles through three kinds of deliverable; pauses (showing the
 * finished state) on hover, keyboard focus, off-screen and reduced motion.
 */
export function ReviewWorkspace() {
  const reduceMotion = useReducedMotion()
  const stageRef = useRef<HTMLElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { amount: 0.35 })
  const [index, setIndex] = useState(0)
  const [run, setRun] = useState(0)
  const [held, setHeld] = useState(false)

  const scene = scenes[index] as Scene
  const playing = !reduceMotion && !held && inView
  const next = useCallback(() => setIndex((i) => (i + 1) % scenes.length), [])
  const { phase, linesShown } = useReviewTimeline(scene.lines.length, playing, `${index}:${run}`, next)

  const select = (i: number) => {
    setIndex(i)
    setRun((r) => r + 1)
  }

  // After someone finishes reading a held scene, move on rather than replaying it.
  const release = () => {
    setHeld(false)
    next()
  }

  const layout = useMeasuredLayout(stageRef, windowRef, phase, index)
  const baseId = useId()

  return (
    <div>
      <figure
        ref={stageRef}
        id={`${baseId}-example`}
        aria-labelledby={`${baseId}-caption`}
        className="relative pt-[34px] pl-2.5 sm:pt-7 sm:pl-7"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={release}
      >
        <figcaption className="sr-only" id={`${baseId}-caption`}>
          {describe(scene)}
        </figcaption>

        {/* The previous delivery, stacked behind for depth */}
        <div
          aria-hidden
          className="absolute top-0 right-3.5 left-0 h-[78%] origin-[30%_100%] -rotate-[1.2deg] rounded-lg border border-rule bg-paper-2 sm:right-9"
        >
          <span className="absolute top-2 left-11 hidden font-mono text-micro text-struck sm:block">
            Delivered · {(scenes[(index + scenes.length - 1) % scenes.length] as Scene).title}
          </span>
        </div>

        <div
          ref={windowRef}
          aria-hidden
          data-animated
          data-struck={reached(phase, 'struck') || undefined}
          data-approved={phase === 'approved' || undefined}
          className="relative overflow-hidden rounded-lg border border-rule bg-card shadow-window"
        >
          <WindowBar scene={scene} />
          <Steps phase={phase} />
          <div className="grid sm:h-[352px] sm:grid-cols-2">
            <DraftDoc scene={scene} phase={phase} linesShown={linesShown} />
            <div className="hidden border-l border-rule-soft sm:block">
              <Preview scene={scene} phase={phase} />
            </div>
          </div>
        </div>

        <HumanLayer phase={phase} layout={layout} scene={scene} />
      </figure>

      <SceneTabs
        index={index}
        onSelect={select}
        onFocusChange={(focused) => (focused ? setHeld(true) : release())}
        progressKey={playing ? `${index}:${run}` : null}
        controls={`${baseId}-example`}
      />
    </div>
  )
}

function describe(scene: Scene) {
  const line = editedLine(scene)
  return `Example — ${scene.title}. The AI draft read: “${line.draft}” The lead reviewer commented: “${scene.comment}” It was revised to: “${line.revised}” ${scene.stamp}.`
}

function WindowBar({ scene }: { scene: Scene }) {
  const avatar =
    'grid size-6 place-items-center rounded-full border-2 border-surface font-mono text-[10px] font-semibold'
  return (
    <div className="flex items-center gap-3 border-b border-rule-soft bg-surface px-4 py-3">
      <span className="truncate text-sm font-semibold tracking-tight">{scene.title}</span>
      <span className="hidden font-mono text-xs whitespace-nowrap text-graphite sm:inline">{scene.format}</span>
      <span className="ml-auto flex">
        <span className={`${avatar} bg-ink text-paper`}>AI</span>
        <span className={`${avatar} -ml-1.5 bg-clay text-ink`}>{scene.specialist}</span>
        <span className={`${avatar} -ml-1.5 bg-pencil-deep text-white`}>LR</span>
      </span>
    </div>
  )
}

function Steps({ phase }: { phase: Phase }) {
  const active = stepFor(phase)
  return (
    <ol className="grid grid-cols-4 border-b border-rule-soft">
      {STEPS.map((label, i) => {
        const human = i >= 2
        const state = i < active ? 'done' : i === active ? 'active' : 'todo'
        const color =
          state === 'todo'
            ? 'text-struck'
            : state === 'done'
              ? 'text-graphite'
              : human
                ? 'text-pencil-deep'
                : 'text-ink'
        const dot =
          state === 'todo'
            ? 'border-current'
            : human
              ? 'border-pencil bg-pencil'
              : state === 'done'
                ? 'border-graphite bg-graphite'
                : 'border-ink bg-ink'
        return (
          <li
            key={label}
            className={`relative flex items-center gap-1.5 px-2 py-2.5 font-mono text-[10.5px] leading-none transition-colors sm:gap-2 sm:px-4 sm:text-[11.5px] ${color} ${i > 0 ? 'border-l border-rule-soft' : ''}`}
          >
            <span className={`size-[7px] rounded-full border-[1.5px] transition-colors ${dot}`} />
            {label}
            <span
              className={`absolute inset-x-0 -bottom-px h-0.5 origin-left transition-transform duration-500 ${human ? 'bg-pencil' : 'bg-ink'} ${state === 'active' ? 'scale-x-100' : 'scale-x-0'}`}
            />
          </li>
        )
      })}
    </ol>
  )
}

function chipFor(phase: Phase) {
  if (phase === 'brief') return { text: 'Brief received', cls: 'border-rule text-graphite bg-surface' }
  if (phase === 'drafting') return { text: 'AI drafting', cls: 'border-rule text-graphite bg-surface', ai: true }
  if (phase === 'approved') return { text: '✓ Approved', cls: 'border-ink text-ink bg-card' }
  return { text: 'In review', cls: 'border-[#EBC2B3] text-pencil-deep bg-[#FBF0EB]' }
}

function DraftDoc({ scene, phase, linesShown }: { scene: Scene; phase: Phase; linesShown: number }) {
  const chip = chipFor(phase)
  return (
    <div className="p-5 pb-6">
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <span className="label">{scene.file}</span>
        <span
          className={`inline-flex h-[22px] items-center gap-1.5 rounded-full border px-2 font-mono text-[11px] whitespace-nowrap transition-colors ${chip.cls}`}
        >
          {chip.ai && <span className="size-1.5 animate-pulse rounded-full bg-ink" />}
          {chip.text}
        </span>
      </div>
      <div className="grid gap-2.5">
        {scene.lines.map((line, i) => (
          <motion.div
            key={`${scene.id}:${line.tag}:${isEdited(line) ? line.draft : line.text}`}
            data-target={isEdited(line) || undefined}
            initial={false}
            animate={{ opacity: i < linesShown ? 1 : 0, y: i < linesShown ? 0 : 4 }}
            transition={{ duration: 0.35, ease }}
            className={`grid grid-cols-[44px_minmax(0,1fr)] gap-2.5 rounded-[3px] text-[14.5px] leading-normal transition-colors duration-500 ${
              isEdited(line) && reached(phase, 'struck')
                ? 'bg-linear-to-r from-pencil-wash from-0% to-transparent to-85%'
                : ''
            }`}
          >
            <span className="font-mono text-[11.5px] leading-[1.9] text-struck">{line.tag}</span>
            {isEdited(line) ? (
              <span>
                {line.keep && `${line.keep} `}
                <del className="mark-del">{line.draft}</del>
                {reached(phase, 'revised') && (
                  <motion.ins
                    className="mark-ins"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    {line.revised}
                  </motion.ins>
                )}
              </span>
            ) : (
              <span>{line.text}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function HumanLayer({ phase, layout, scene }: { phase: Phase; layout: Layout | null; scene: Scene }) {
  const cursorOn = reached(phase, 'review') && phase !== 'approved'
  // Reduced motion: marks simply appear. (Motion skips transforms but would still fade opacity.)
  const instant = useReducedMotion()
  return (
    <div aria-hidden data-animated>
      {layout && (
        <motion.div
          className="pointer-events-none absolute top-0 left-0 z-10"
          initial={false}
          animate={{
            x: cursorOn ? layout.cursorTo.x : layout.cursorFrom.x,
            y: cursorOn ? layout.cursorTo.y : layout.cursorFrom.y,
            opacity: cursorOn ? 1 : 0,
          }}
          transition={{ duration: 0.9, ease, opacity: { duration: 0.3 } }}
        >
          <svg viewBox="0 0 18 18" className="size-[18px] drop-shadow-sm" aria-hidden="true">
            <path
              d="M2 1.5 L15 8.2 L9 9.6 L6.4 15.8 Z"
              className="fill-pencil stroke-white"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute top-4 left-3.5 rounded-[3px_8px_8px_8px] bg-pencil-deep px-[7px] py-[5px] font-mono text-[11px] leading-none whitespace-nowrap text-white">
            Lead reviewer
          </span>
        </motion.div>
      )}

      <AnimatePresence>
        {layout && reached(phase, 'commented') && (
          <motion.div
            key={scene.id}
            className="absolute z-[5] rounded-md border border-l-[3px] border-rule border-l-pencil bg-card px-3.5 py-3 shadow-window"
            style={{ left: layout.comment.x, width: layout.comment.width }}
            initial={instant ? false : { opacity: 0, y: 8, scale: 0.98, top: layout.comment.y }}
            animate={{ opacity: 1, y: 0, scale: 1, top: layout.comment.y }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-pencil-deep font-mono text-[10px] font-semibold text-white">
                LR
              </span>
              <b className="text-[12.5px] font-semibold">Lead reviewer</b>
              <span className="ml-auto font-mono text-[11px] text-struck">now</span>
            </div>
            <p className="mt-2 font-note text-note text-pencil-deep italic">“{scene.comment}”</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'approved' && (
          <motion.div
            key={scene.id}
            className="absolute top-0.5 right-0.5 z-20 flex items-center gap-2 rounded-md border-[1.5px] border-pencil bg-card py-2 pr-3 pl-2.5 font-mono text-[12.5px] leading-none text-pencil-deep sm:top-3 sm:-right-1.5"
            initial={instant ? false : { opacity: 0, scale: 1.15, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          >
            <svg viewBox="0 0 14 14" className="size-3.5" aria-hidden="true">
              <path d="M2 7.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            {scene.stamp}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Measures where the reviewer's cursor and comment go, relative to the stage.
 * Comments stay inside the draft column so they never cover the deliverable.
 */
function useMeasuredLayout(
  stageRef: RefObject<HTMLElement | null>,
  windowRef: RefObject<HTMLElement | null>,
  phase: Phase,
  index: number,
) {
  const [layout, setLayout] = useState<Layout | null>(null)
  const [size, setSize] = useState(0)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const ro = new ResizeObserver(([entry]) => setSize(Math.round(entry?.contentRect.width ?? 0)))
    ro.observe(stage)
    return () => ro.disconnect()
  }, [stageRef])

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the text reflows (phase/scene/size)
  useLayoutEffect(() => {
    const stage = stageRef.current
    const target = stage?.querySelector<HTMLElement>('[data-target]')
    const del = target?.querySelector('del')
    const text = target?.lastElementChild
    const win = windowRef.current
    if (!stage || !target || !del || !text || !win) return

    const s = stage.getBoundingClientRect()
    const rel = (r: DOMRect) => ({
      left: r.left - s.left,
      top: r.top - s.top,
      right: r.right - s.left,
      bottom: r.bottom - s.top,
    })
    const t = rel(target.getBoundingClientRect())
    const d = rel(del.getBoundingClientRect())
    const tx = rel(text.getBoundingClientRect())
    const w = rel(win.getBoundingClientRect())
    const docRight = s.width < 640 ? w.right - 8 : w.left + (w.right - w.left) / 2

    setLayout({
      cursorFrom: { x: w.left + (w.right - w.left) * 0.85, y: w.bottom + 30 },
      cursorTo: { x: d.left + 20, y: d.top + 6 },
      comment: { x: Math.max(8, tx.left), y: t.bottom + 10, width: Math.min(280, docRight - tx.left + 24) },
    })
  }, [phase, index, size, stageRef, windowRef])

  return layout
}

function SceneTabs({
  index,
  onSelect,
  onFocusChange,
  progressKey,
  controls,
}: {
  index: number
  onSelect: (i: number) => void
  onFocusChange: (focused: boolean) => void
  progressKey: string | null
  controls: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (e: KeyboardEvent) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const i = (index + delta + scenes.length) % scenes.length
    onSelect(i)
    refs.current[i]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Example deliverables"
      className="mt-4 ml-2.5 flex gap-1.5 sm:ml-7"
      onKeyDown={onKeyDown}
      onFocus={() => onFocusChange(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && onFocusChange(false)}
    >
      {scenes.map((s, i) => (
        <button
          key={s.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-controls={controls}
          tabIndex={i === index ? 0 : -1}
          onClick={() => onSelect(i)}
          className={`relative min-h-11 flex-1 pt-3 text-left font-mono text-[12.5px] leading-tight transition-colors hover:text-ink ${i === index ? 'text-ink' : 'text-graphite'}`}
        >
          <span className="absolute inset-x-0 top-0 h-0.5 bg-rule" />
          {i === index && progressKey && (
            <motion.span
              key={progressKey}
              className="absolute top-0 left-0 h-0.5 bg-ink"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: SCENE_MS / 1000, ease: 'linear' }}
            />
          )}
          {i === index && !progressKey && <span className="absolute inset-x-0 top-0 h-0.5 bg-ink" />}
          {s.tab.kind}
          <span className="hidden sm:inline"> · {s.tab.client}</span>
        </button>
      ))}
    </div>
  )
}
