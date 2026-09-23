import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Soft, eased scrolling for the whole site (Lenis). The wheel and trackpad
 * glide to a stop instead of stepping; touch keeps the phone's own momentum.
 * The page still scrolls natively underneath, so the sticky header, the
 * hero's scroll timeline and IntersectionObservers all work as before.
 * Same-page links ("/#work") glide too and respect each section's scroll
 * margin. Reduced motion turns it off (Lenis checks the preference itself).
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, anchors: true, autoRaf: true })
    return () => lenis.destroy()
  }, [])
}
