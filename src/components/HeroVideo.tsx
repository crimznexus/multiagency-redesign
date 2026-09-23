import { LoopVideo } from './LoopVideo'

/**
 * The hero's backdrop: the site's loop (LoopVideo) under a gradient that keeps
 * the copy on solid ground. It starts at once rather than waiting to be seen.
 * There is no pause button (client request), so reduced motion is the only
 * way to stop it.
 *
 * From `md` it fills the hero. On phones the hero is tall and narrow, and
 * covering it magnified the 16:9 footage nearly four times, so there the
 * video is a band 85vw tall across the top (about 1.5×, the dunes still
 * legible) that fades out above the pipeline graph.
 */
export function HeroVideo() {
  return (
    <div aria-hidden="true" className="hero-frame absolute inset-0 -z-10 overflow-hidden">
      <LoopVideo
        eager
        className="h-[85vw] w-full object-cover [mask-image:linear-gradient(to_bottom,#000_60%,transparent)] md:h-full md:[mask-image:none]"
      />
      {/* Solid ground under the copy, so the glow and the digits never cut the text's contrast, and the
          footage in full on the other side. On phones, a lighter veil over the band, darkening downward. */}
      <div className="absolute inset-x-0 top-0 h-[85vw] bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-bg)_25%,transparent),color-mix(in_srgb,var(--color-bg)_55%,transparent)_60%,var(--color-bg))] md:inset-0 md:h-auto md:bg-[linear-gradient(to_right,var(--color-bg),color-mix(in_srgb,var(--color-bg)_88%,transparent)_42%,color-mix(in_srgb,var(--color-bg)_15%,transparent)_72%,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-bg" />
    </div>
  )
}
