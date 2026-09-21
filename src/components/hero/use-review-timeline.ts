import { useEffect, useEffectEvent, useState } from 'react'

/** The stages a deliverable passes through, in order. */
export const PHASES = ['brief', 'drafting', 'review', 'struck', 'commented', 'revised', 'approved'] as const
export type Phase = (typeof PHASES)[number]

export const SCENE_MS = 8200
const LINE_STAGGER = 200

export const reached = (phase: Phase, target: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(target)

/** Which of the four visible steps (Brief · AI draft · Review · Approved) is active. */
export const stepFor = (phase: Phase): 0 | 1 | 2 | 3 =>
  phase === 'brief' ? 0 : phase === 'drafting' ? 1 : phase === 'approved' ? 3 : 2

interface Timeline {
  phase: Phase
  /** How many draft lines have been "written" so far. */
  linesShown: number
}

/**
 * Drives one scene: AI drafts line by line, a reviewer strikes the generic
 * line, comments, revises, approves. When `playing` is false the scene is
 * shown in its finished state (reduced motion, hover-to-read, off-screen).
 */
export function useReviewTimeline(lineCount: number, playing: boolean, runKey: string, onDone: () => void): Timeline {
  const [state, setState] = useState<Timeline>({ phase: 'approved', linesShown: lineCount })
  // Read the latest callback when the timer fires, without restarting the run.
  const finish = useEffectEvent(onDone)

  // `runKey` isn't read inside: it exists to restart the run (new scene, or the same one re-selected).
  // biome-ignore lint/correctness/useExhaustiveDependencies: runKey is a deliberate restart trigger
  useEffect(() => {
    if (!playing) {
      setState({ phase: 'approved', linesShown: lineCount })
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))
    const phase = (p: Phase) => setState((s) => ({ ...s, phase: p }))

    setState({ phase: 'brief', linesShown: 0 })
    at(350, () => phase('drafting'))
    for (let k = 1; k <= lineCount; k++)
      at(500 + (k - 1) * LINE_STAGGER, () => setState((s) => ({ ...s, linesShown: k })))

    const drafted = 600 + lineCount * LINE_STAGGER
    at(drafted + 300, () => phase('review'))
    at(drafted + 1200, () => phase('struck'))
    at(drafted + 1700, () => phase('commented'))
    at(drafted + 2600, () => phase('revised'))
    at(drafted + 3600, () => phase('approved'))
    at(SCENE_MS, () => finish())

    return () => timers.forEach(clearTimeout)
  }, [lineCount, playing, runKey])

  return state
}
