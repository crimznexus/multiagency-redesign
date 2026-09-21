import { LogoMark } from './Logo'

export const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#how-we-work', label: 'How we work' },
  { href: '#open-books', label: 'Open books' },
] as const

const cta =
  'inline-flex min-h-11 items-center gap-2.5 rounded-sm bg-ink px-3.5 text-sm font-medium whitespace-nowrap text-paper transition hover:bg-ink-soft active:translate-y-px sm:px-[18px] sm:text-[15px]'

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="page flex h-[72px] items-center gap-10">
        <a href="/" aria-label="MultiAgency home" className="flex min-h-11 min-w-11 items-center gap-2.5">
          <LogoMark className="size-[22px]" />
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">MultiAgency</span>
        </a>

        <nav aria-label="Primary" className="ml-auto hidden gap-7 text-[15px] text-graphite lg:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="py-3 transition-colors hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className={`${cta} ml-auto lg:ml-0`}>
          Start a project <span aria-hidden="true">→</span>
        </a>

        {/* Native Popover API: top layer, light-dismiss and Esc for free, no JS. */}
        <button
          type="button"
          popoverTarget="site-menu"
          aria-label="Menu"
          className="-ml-6 grid size-11 place-items-center rounded-sm border border-rule lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 6h14M2 12h14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <nav
          id="site-menu"
          popover="auto"
          aria-label="Menu"
          // Override the UA popover box (inset: 0, centred) with a panel hung under the header.
          className="inset-auto top-[72px] right-0 m-0 h-auto w-full max-w-sm content-start border-b border-l border-rule bg-card p-2 text-lg shadow-window open:grid"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => e.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()}
              className="flex min-h-12 items-center rounded-sm px-4 hover:bg-surface"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
