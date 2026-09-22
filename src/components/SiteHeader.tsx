import { LogoMark } from './Logo'

export const CONTACT_URL = 'https://multiagency.ai/contact'
/** One label for the contact intent, everywhere on the page. */
export const CONTACT_LABEL = 'Start a project'
export const APPLY_URL = 'https://multiagency.ai/apply'

export const NAV = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#open-books', label: 'Open books' },
  { href: '#faq', label: 'FAQ' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream/8 bg-canvas/80 backdrop-blur-md">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="page flex h-16 items-center gap-8">
        <a href="/" aria-label="MultiAgency home" className="flex min-h-11 min-w-11 items-center gap-2.5">
          <LogoMark className="size-5 text-cream" />
          <span className="hidden text-[17px] font-semibold tracking-[-0.02em] sm:inline">MultiAgency</span>
        </a>

        <nav aria-label="Primary" className="mx-auto hidden gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-cream/4 hover:text-cream"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <a href={APPLY_URL} className="btn btn-ghost hidden text-sm sm:inline-flex">
            Join as a builder
          </a>
          <a href={CONTACT_URL} className="btn btn-signal text-sm">
            {CONTACT_LABEL}
          </a>
          {/* Native Popover API: top layer, light-dismiss and Esc for free, no JS. */}
          <button
            type="button"
            popoverTarget="site-menu"
            aria-label="Menu"
            className="grid size-11 place-items-center rounded-btn border border-cream/12 bg-cream/4 hover:bg-cream/8 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M2 6h14M2 12h14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <nav
          id="site-menu"
          popover="auto"
          aria-label="Menu"
          // Override the UA popover box (inset: 0, centred) with a panel hung under the header.
          className="panel inset-auto top-18 right-3 m-0 h-auto w-[min(20rem,calc(100vw-1.5rem))] content-start p-2 text-cream open:grid"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => e.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()}
              className="flex min-h-12 items-center rounded-row px-4 hover:bg-cream/4"
            >
              {item.label}
            </a>
          ))}
          <a href={APPLY_URL} className="flex min-h-12 items-center rounded-row px-4 text-muted hover:bg-cream/4">
            Join as a builder
          </a>
        </nav>
      </div>
    </header>
  )
}
