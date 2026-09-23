import { LoopVideo } from './LoopVideo'

/**
 * The hero's backdrop: the site's loop (LoopVideo), full bleed, under a
 * gradient that keeps the copy on solid ground. It starts at once rather than
 * waiting to be seen. There is no pause button (client request), so reduced
 * motion is the only way to stop it.
 */
export function HeroVideo() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <LoopVideo eager className="size-full object-cover" />
      {/* Solid ground under the copy, so the glow and the digits never cut the text's contrast, and the
          footage in full on the other side. Phones stack, so there it darkens downward instead. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-bg)_50%,transparent),color-mix(in_srgb,var(--color-bg)_82%,transparent)_40%,var(--color-bg))] md:bg-[linear-gradient(to_right,var(--color-bg),color-mix(in_srgb,var(--color-bg)_88%,transparent)_42%,color-mix(in_srgb,var(--color-bg)_15%,transparent)_72%,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-bg" />
    </div>
  )
}
