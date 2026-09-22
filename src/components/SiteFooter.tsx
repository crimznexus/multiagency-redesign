import { TREASURY_ACCOUNT } from '~/lib/ledger'
import { NAV } from './SiteHeader'
import { ExternalLink } from './ui/primitives'

const elsewhere = [
  { href: 'https://github.com/MultiAgency/dashboard', label: 'Open source' },
  { href: 'https://x.com/_multiagency', label: 'X' },
]

const item = 'inline-flex min-h-11 items-center text-[15px] text-muted transition-colors hover:text-ink'

/** The wordmark at poster scale, then one row of links. */
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
        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={item}>
                {n.label}
              </a>
            ))}
            {elsewhere.map((n) => (
              <ExternalLink key={n.href} href={n.href} className={item}>
                {n.label}
              </ExternalLink>
            ))}
          </nav>
          <p className="type-mono text-muted">{TREASURY_ACCOUNT}</p>
        </div>
      </div>
    </footer>
  )
}
