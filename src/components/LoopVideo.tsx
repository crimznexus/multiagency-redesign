import { useEffect, useRef } from 'react'

export const LOOP_POSTER = '/hero/loop-poster.webp'

/** Full speed: the clip is already slow. */
const RATE = 1

function play(v: HTMLVideoElement) {
  v.playbackRate = RATE
  // Refused (autoplay blocked, or interrupted by a pause): the poster stays.
  v.play().catch(() => {})
}

/**
 * The site's one piece of footage: dark dunes under a violet sky, digits
 * falling through it, with film grain. It's the motionsites.ai reference clip
 * (a Higgsfield generation, 10 s), self-hosted rather than hotlinked:
 * re-encoded from the 13.8 MB 1080p original to 720p WebM and MP4 of about
 * 300 to 380 KB each.
 *
 * The poster paints first; the video loads only once it's on screen (or at
 * once when `eager`), plays while visible and pauses out of view. Reduced
 * motion and Save-Data keep the still poster.
 */
export function LoopVideo({ className, eager = false }: { className?: string; eager?: boolean }) {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = video.current
    if (!v) return
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || saveData) return
    if (eager) play(v)
    const seen = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) v.pause()
      else play(v)
    })
    seen.observe(v)
    return () => seen.disconnect()
  }, [eager])

  return (
    <video
      ref={video}
      muted
      loop
      playsInline
      preload="none"
      poster={LOOP_POSTER}
      onRateChange={(e) => {
        // Some browsers reset the rate when a source loads.
        if (e.currentTarget.playbackRate !== RATE) e.currentTarget.playbackRate = RATE
      }}
      className={className}
    >
      <source src="/hero/loop.webm" type="video/webm" />
      <source src="/hero/loop.mp4" type="video/mp4" />
    </video>
  )
}
