import { TREASURY_ACCOUNT } from '~/lib/ledger'
import { LogoMark } from './Logo'
import { NAV } from './SiteHeader'
import { ArrowUpRight } from './ui/icons'
import { ExternalLink } from './ui/primitives'

const elsewhere = [
  { href: `https://nearblocks.io/address/${TREASURY_ACCOUNT}`, label: 'Treasury' },
  { href: 'https://github.com/MultiAgency', label: 'GitHub' },
  { href: 'https://x.com/_multiagency', label: 'X' },
]

const item = 'inline-flex min-h-11 items-center gap-1 text-sm text-muted transition-colors hover:text-cream'

/* One row of links, not a four-column link farm. */
export function SiteFooter() {
  return (
    <footer className="border-t border-cream/8">
      <div className="page flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
        <a href="/" aria-label="MultiAgency home" className="inline-flex min-h-11 items-center gap-2.5 self-start">
          <LogoMark className="size-5" />
          <span className="text-[17px] font-semibold tracking-[-0.02em]">MultiAgency</span>
        </a>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={item}>
              {n.label}
            </a>
          ))}
          {elsewhere.map((n) => (
            <ExternalLink key={n.href} href={n.href} className={item}>
              {n.label}
              <ArrowUpRight className="size-3" />
            </ExternalLink>
          ))}
        </nav>
      </div>
      <p className="page border-t border-cream/8 py-6 text-sm text-dim">
        © 2026 MultiAgency. Open books, open source, open doors.
      </p>
    </footer>
  )
}
