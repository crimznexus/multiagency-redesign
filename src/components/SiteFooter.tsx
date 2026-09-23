import { TREASURY_ACCOUNT } from '~/lib/ledger'
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
 * The wordmark at poster scale, then the links. From `md`: one row, links
 * left, treasury account right. On phones: two labelled columns (Site,
 * Elsewhere) under a hairline, then the treasury account on its own ruled
 * line, so nothing wraps unevenly.
 */
export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink">
      <div className="page pt-10 pb-8">
        <p
          aria-hidden="true"
          className="font-semibold tracking-[-0.065em] text-[clamp(2.5rem,13.5vw,13.5rem)] leading-[0.9] [padding-bottom:0.06em]"
        >
          MultiAgency
        </p>
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
