import { useLocation } from '@tanstack/react-router'
import { type CSSProperties, type RefObject, useEffect, useRef, useState } from 'react'
import { LogoMark } from './Logo'

export const CONTACT_URL = '/contact'
/** One label for the contact intent, everywhere on the page. */
export const CONTACT_LABEL = 'Hire us'
export const APPLY_URL = '/apply'
export const APPLY_LABEL = 'Apply to join'
export const REGISTER_URL = 'https://multiagency.ai/register'

export const NAV = [
  { href: '/#work', label: 'Work' },
  { href: '/#open-books', label: 'Open books' },
  { href: '/#template', label: 'Template' },
  { href: '/#faq', label: 'FAQ' },
] as const

/** The header's links: home first, then the sections. */
const LINKS = [{ href: '/', label: 'Home' }, ...NAV] as const

/** Three dots under the active link: one dot, and two drawn as its shadows, in the colour `--dot`. */
const dots =
  "after:absolute after:left-1/2 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-(--dot) after:shadow-[-5px_0_0_var(--dot),5px_0_0_var(--dot)] after:content-['']"

/** How far the glass has deepened: 0 at the top of the page, 1 once it has scrolled this far. */
const GLASS_AFTER = 200

/**
 * Writes the scroll progress to the header as `--p` (see `.hdr` in app.css), once
 * per frame and without re-rendering: the glass follows the scroll, both ways.
 */
function useGlass(header: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = header.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      el.style.setProperty('--p', Math.min(window.scrollY / GLASS_AFTER, 1).toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [header])
}

/**
 * On the home page, which link is current: the section crossing the middle
 * of the viewport, or Home above the first one. Elsewhere, none.
 */
function useActive() {
  const path = useLocation({ select: (l) => l.pathname })
  const [section, setSection] = useState<string | null>(null)

  useEffect(() => {
    if (path !== '/') return
    const inView = new Set<string>()
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? inView.add(e.target.id) : inView.delete(e.target.id)
        setSection(NAV.map((n) => n.href.slice(2)).find((id) => inView.has(id)) ?? null)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const n of NAV) {
      const el = document.getElementById(n.href.slice(2))
      if (el) seen.observe(el)
    }
    return () => seen.disconnect()
  }, [path])

  if (path !== '/') return null
  return section ? `/#${section}` : '/'
}

/**
 * A floating header: the mark in a white circle, the links in a white pill,
 * and "Hire us" as the hero's yellow pill. It takes no bar of its own, so the hero's
 * video runs up behind it. At the top it is light frosted glass; as the page
 * scrolls it deepens, step by step with the scroll, into dark glass, and
 * lightens again on the way back up. Phones get the mark, a round menu
 * button, and a dark glass sheet of links that eases in.
 */
export function SiteHeader() {
  const active = useActive()
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  useGlass(header)

  return (
    <header ref={header} className="hdr sticky top-0 z-40 h-18">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="page flex h-full items-center justify-between md:justify-center md:gap-[clamp(18px,2.8vw,28px)]">
        <a
          href="/"
          aria-label="MultiAgency home"
          className="hdr-surface grid size-12 shrink-0 place-items-center rounded-full transition-[scale] hover:scale-104 md:size-[clamp(40px,4.4vw,46px)]"
        >
          <LogoMark className="size-[42%]" />
        </a>

        <nav
          aria-label="Primary"
          className="hdr-surface hidden h-[clamp(44px,5.2vw,48px)] max-w-[34rem] flex-1 items-center justify-around rounded-full px-2 md:flex"
        >
          {LINKS.map((l) => {
            const current = l.href === active
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={current ? 'location' : undefined}
                className={`hdr-link relative flex h-full items-center px-2 text-[clamp(13px,1.4vw,15px)] font-medium tracking-[-0.01em] whitespace-nowrap after:bottom-[5px] focus-visible:outline-current focus-visible:-outline-offset-4 ${current ? dots : ''}`}
              >
                {l.label}
              </a>
            )
          })}
        </nav>

        <a
          href={CONTACT_URL}
          className="btn btn-signal btn-lit hidden h-[clamp(44px,5.2vw,48px)] min-h-0 shrink-0 rounded-full px-6 text-[clamp(13px,1.4vw,15px)] md:inline-flex"
        >
          {CONTACT_LABEL}
        </a>

        {/* Native Popover API: top layer, light-dismiss and Esc for free. */}
        <button
          type="button"
          popoverTarget="site-menu"
          aria-label="Menu"
          aria-expanded={open}
          className="hdr-dark grid size-12 place-items-center rounded-full md:hidden"
        >
          <span aria-hidden="true" className="grid w-[18px] gap-[5.25px]">
            <span className="h-[1.5px] bg-white" />
            <span className="h-[1.5px] bg-white" />
            <span className="h-[1.5px] bg-white" />
          </span>
        </button>

        {/* The popover is the whole overlay, so the mark and the close button sit sharp above the blur. It opens
            and closes with the transitions on `.menu*` in app.css. */}
        <div
          id="site-menu"
          popover="auto"
          onToggle={(e) => setOpen((e.nativeEvent as ToggleEvent).newState === 'open')}
          className="menu inset-0 m-0 size-full max-h-none max-w-none border-0 bg-black/55 p-0 backdrop-blur-md"
        >
          {/* A tap on the dimmed area closes it (it's inside the popover, so light-dismiss can't). Esc is native. */}
          <button
            type="button"
            popoverTarget="site-menu"
            popoverTargetAction="hide"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 cursor-default"
          />
          <div className="page pointer-events-none relative flex h-18 items-center justify-between">
            <span
              aria-hidden="true"
              className="grid size-12 place-items-center rounded-full border border-ink/15 bg-[#141412]/80 text-ink"
            >
              <LogoMark className="size-[42%]" />
            </span>
            <button
              type="button"
              popoverTarget="site-menu"
              popoverTargetAction="hide"
              aria-label="Close menu"
              className="menu-close pointer-events-auto grid size-12 place-items-center rounded-full border border-ink/15 bg-[#141412]/80"
            >
              <span aria-hidden="true" className="relative block size-[18px]">
                <span className="absolute top-1/2 left-0 h-[1.5px] w-full rotate-45 bg-ink" />
                <span className="absolute top-1/2 left-0 h-[1.5px] w-full -rotate-45 bg-ink" />
              </span>
            </button>
          </div>
          <nav
            aria-label="Menu"
            className="menu-sheet relative mx-auto mt-1 grid w-[calc(100%-2rem)] max-w-sm rounded-[28px] border border-ink/12 bg-[#141412]/85 px-4.5 pt-5 pb-5 text-ink shadow-[0_24px_70px_rgb(0_0_0/0.55)] [--dot:var(--color-signal)]"
          >
            {LINKS.map((l, i) => {
              const current = l.href === active
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={current ? 'location' : undefined}
                  onClick={(e) => e.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()}
                  style={{ '--i': i } as CSSProperties}
                  className={`menu-item relative flex min-h-12 items-center justify-center rounded-full text-[17px] font-medium after:bottom-2 hover:bg-ink/6 ${
                    current ? `text-ink ${dots}` : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  {l.label}
                </a>
              )
            })}
            <a
              href={CONTACT_URL}
              style={{ '--i': LINKS.length } as CSSProperties}
              className="menu-item btn btn-signal btn-lit mt-3 rounded-full"
            >
              {CONTACT_LABEL}
            </a>
            <a
              href={APPLY_URL}
              style={{ '--i': LINKS.length + 1 } as CSSProperties}
              className="menu-item flex min-h-12 items-center justify-center text-[15px] text-ink/70 hover:text-ink"
            >
              {APPLY_LABEL}
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
