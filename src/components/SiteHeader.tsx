import { LogoMark } from './Logo'

export const CONTACT_URL = '/contact'
/** One label for the contact intent, everywhere on the page. */
export const CONTACT_LABEL = 'Hire us'
export const APPLY_URL = 'https://multiagency.ai/apply'
export const APPLY_LABEL = 'Apply to join'
export const REGISTER_URL = 'https://multiagency.ai/register'

export const NAV = [
  { href: '/#work', label: 'Work' },
  { href: '/#open-books', label: 'Open books' },
  { href: '/#template', label: 'Template' },
  { href: '/#faq', label: 'FAQ' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="page flex h-16 items-center justify-between gap-3 sm:gap-6">
        <a href="/" aria-label="MultiAgency home" className="flex min-h-11 items-center gap-2.5">
          <LogoMark className="size-5 shrink-0" />
          <span className="text-[17px] font-semibold tracking-[-0.02em]">MultiAgency</span>
        </a>

        <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
          <nav aria-label="Primary" className="hidden gap-7 md:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-[15px] text-muted transition-colors hover:text-ink">
                {item.label}
              </a>
            ))}
          </nav>

          <a href={CONTACT_URL} className="btn btn-signal btn-sm">
            {CONTACT_LABEL}
          </a>

          {/* Native Popover API: top layer, light-dismiss and Esc for free, no JS. */}
          <button
            type="button"
            popoverTarget="site-menu"
            aria-label="Menu"
            className="grid size-10 place-items-center border border-ink hover:bg-ink hover:text-bg md:hidden"
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
          className="inset-auto top-16 right-3 m-0 h-auto w-[min(18rem,calc(100vw-1.5rem))] content-start border border-ink bg-bg p-0 text-ink open:grid"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => e.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()}
              className="flex min-h-12 items-center border-b border-rule px-4 hover:bg-surface"
            >
              {item.label}
            </a>
          ))}
          <a href={APPLY_URL} className="flex min-h-12 items-center px-4 text-muted hover:bg-surface">
            {APPLY_LABEL}
          </a>
        </nav>
      </div>
    </header>
  )
}
