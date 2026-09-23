import { TREASURY_ACCOUNT } from '~/lib/ledger'
import { LoopVideo } from './LoopVideo'
import { NAV } from './SiteHeader'
import { ExternalLink } from './ui/primitives'

const elsewhere = [
  { href: 'https://github.com/MultiAgency/dashboard', label: 'Open source' },
  { href: 'https://x.com/_multiagency', label: 'X' },
]

const item = 'inline-flex min-h-11 items-center text-[15px] text-muted transition-colors hover:text-ink'
/** Group labels are for phones, where the links stack; the desktop row reads without them. */
const groupLabel = 'type-label mb-1 text-[11px] text-muted md:sr-only'

/**
 * A card set apart from the page: inset by the gutter, soft 28px corners, a
 * hairline and a surface a shade above black. In it, the wordmark at poster
 * scale, filled with the site's loop, which shows only through the letters
 * (see the blends below). Then
 * the links. From `md`: one row, links left, treasury account right. On phones: two labelled columns (Site,
 * Elsewhere) under a hairline, then the treasury account on its own ruled
 * line, so nothing wraps unevenly.
 */
export function SiteFooter() {
  return (
    <footer className="page pb-gutter">
      <div className="rounded-[28px] border border-ink/10 bg-[#0d0d0c] px-[clamp(1.25rem,4vw,3rem)] pt-[clamp(1.75rem,4vw,3rem)] pb-6 md:pb-8">
        {/* Two blends. Inside this group, white type on black set to multiply leaves the video in the letters and
            black round them; the group then lightens onto the card, where black changes nothing, so no box shows.
            Clipped by a pixel at the bottom: the type's box can round short of the video's, which showed as a hairline. */}
        <div aria-hidden="true" className="relative mix-blend-lighten [clip-path:inset(0_0_1px_0)]">
          {/* Cropped to the band of sky and falling digits, the brightest part of the frame. */}
          <LoopVideo className="absolute inset-0 size-full object-cover object-[50%_22%]" />
          <p className="relative bg-black font-semibold tracking-[-0.065em] text-[clamp(2.5rem,12vw,12.5rem)] leading-[0.9] text-white mix-blend-multiply [padding-bottom:0.06em]">
            MultiAgency
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-6 border-t border-rule pt-5 md:mt-8 md:flex md:items-baseline md:justify-between md:gap-x-8 md:border-0 md:pt-0">
          <nav aria-label="Footer" className="col-span-2 grid grid-cols-2 gap-x-6 md:flex md:gap-x-7">
            <div>
              <p className={groupLabel}>Site</p>
              <ul className="grid md:flex md:gap-x-7">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className={item}>
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={groupLabel}>Elsewhere</p>
              <ul className="grid md:flex md:gap-x-7">
                {elsewhere.map((n) => (
                  <li key={n.href}>
                    <ExternalLink href={n.href} className={item}>
                      {n.label}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <p className="col-span-2 mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-rule pt-4 md:mt-0 md:block md:border-0 md:pt-0">
            <span className="type-label text-[11px] text-muted md:sr-only">Treasury</span>
            <span className="type-mono whitespace-nowrap text-muted">{TREASURY_ACCOUNT}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
