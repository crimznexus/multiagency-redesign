import { useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
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

const shadow = 'shadow-[0_4px_14px_rgba(0,0,0,0.16)]'
/** Three dots under the active link: one dot, and two drawn as its shadows, in the colour `--dot`. */
const dots =
  "after:absolute after:left-1/2 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-(--dot) after:shadow-[-5px_0_0_var(--dot),5px_0_0_var(--dot)] after:content-['']"

/** Every surface eases between its solid face and frosted glass (the terminal's). */
const surface =
  'border transition-[background-color,border-color,color,box-shadow,backdrop-filter] duration-500 ease-(--ease-ui)'
const glass = 'border-ink/15 bg-bg/35 text-ink shadow-none backdrop-blur-xl backdrop-saturate-150'

/** Past the first few pixels of scroll: the header turns to glass, and back at the top. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 24)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])
  return scrolled
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
 * and "Hire us" as a dark pill. It takes no bar of its own, so the hero's
 * video runs up behind it. Once the page scrolls, all of it turns to frosted
 * glass; back at the top, solid again. Phones get the mark, a round menu
 * button, and a white sheet of links.
 */
export function SiteHeader() {
  const active = useActive()
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()

  return (
    <header className="sticky top-0 z-40 h-18">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="page flex h-full items-center justify-between md:justify-center md:gap-[clamp(18px,2.8vw,28px)]">
        <a
          href="/"
          aria-label="MultiAgency home"
          className={`grid size-12 shrink-0 place-items-center rounded-full hover:scale-104 md:size-[clamp(40px,4.4vw,46px)] ${surface} [transition-property:background-color,border-color,color,box-shadow,backdrop-filter,scale] ${scrolled ? glass : `border-transparent bg-white text-[#111] ${shadow}`}`}
        >
          <LogoMark className="size-[42%]" />
        </a>

        <nav
          aria-label="Primary"
          className={`hidden h-[clamp(44px,5.2vw,48px)] max-w-[34rem] flex-1 items-center justify-around rounded-full px-2 md:flex ${surface} ${scrolled ? `${glass} [--dot:var(--color-ink)]` : `border-transparent bg-white [--dot:#111] ${shadow}`}`}
        >
          {LINKS.map((l) => {
            const current = l.href === active
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={current ? 'location' : undefined}
                className={`relative flex h-full items-center px-2 text-[clamp(13px,1.4vw,15px)] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors after:bottom-[5px] focus-visible:-outline-offset-4 ${scrolled ? '' : 'focus-visible:outline-[#111]'} ${
                  current
                    ? `${scrolled ? 'text-ink' : 'text-[#2e2e2e]'} ${dots}`
                    : scrolled
                      ? 'text-ink/70 hover:text-ink'
                      : 'text-[#6b6b6b] hover:text-[#2e2e2e]'
                }`}
              >
                {l.label}
              </a>
            )
          })}
        </nav>

        <a
          href={CONTACT_URL}
          className={`hidden h-[clamp(44px,5.2vw,48px)] shrink-0 items-center rounded-full px-6 text-[clamp(13px,1.4vw,15px)] font-medium hover:-translate-y-px hover:text-white md:flex ${surface} [transition-property:background-color,border-color,color,box-shadow,backdrop-filter,translate] ${scrolled ? `${glass} hover:bg-bg/55` : `border-transparent bg-[#28282a] text-[#c8c8c8] hover:bg-[#323234] ${shadow}`}`}
        >
          {CONTACT_LABEL}
        </a>

        {/* Native Popover API: top layer, light-dismiss and Esc for free. */}
        <button
          type="button"
          popoverTarget="site-menu"
          aria-label="Menu"
          aria-expanded={open}
          className={`grid size-12 place-items-center rounded-full md:hidden ${surface} ${scrolled ? glass : `border-transparent bg-[#28282a] ${shadow}`}`}
        >
          <span aria-hidden="true" className="grid w-[18px] gap-[5.25px]">
            <span className="h-[1.5px] bg-white" />
            <span className="h-[1.5px] bg-white" />
            <span className="h-[1.5px] bg-white" />
          </span>
        </button>

        {/* The popover is the whole overlay, so the mark and the close button sit sharp above the blur. */}
        <div
          id="site-menu"
          popover="auto"
          onToggle={(e) => setOpen((e.nativeEvent as ToggleEvent).newState === 'open')}
          className="inset-0 m-0 size-full max-h-none max-w-none border-0 bg-black/60 p-0 backdrop-blur-[6px] open:block motion-safe:open:animate-[overlay-in_280ms_var(--ease-ui)]"
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
              className={`grid size-12 place-items-center rounded-full bg-white text-[#111] ${shadow}`}
            >
              <LogoMark className="size-[42%]" />
            </span>
            <button
              type="button"
              popoverTarget="site-menu"
              popoverTargetAction="hide"
              aria-label="Close menu"
              className={`pointer-events-auto grid size-12 place-items-center rounded-full bg-white focus-visible:outline-white ${shadow}`}
            >
              <span aria-hidden="true" className="relative block size-[18px]">
                <span className="absolute top-1/2 left-0 h-[1.5px] w-full rotate-45 bg-[#111]" />
                <span className="absolute top-1/2 left-0 h-[1.5px] w-full -rotate-45 bg-[#111]" />
              </span>
            </button>
          </div>
          <nav
            aria-label="Menu"
            className="relative mx-auto mt-1 grid w-[calc(100%-2rem)] [--dot:#111] max-w-sm rounded-[28px] bg-white px-4.5 pt-5.5 pb-5 text-[#2e2e2e] shadow-[0_20px_60px_rgba(0,0,0,0.45)] motion-safe:animate-[menu-in_380ms_var(--ease-ui)]"
          >
            {LINKS.map((l) => {
              const current = l.href === active
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={current ? 'location' : undefined}
                  onClick={(e) => e.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover()}
                  className={`relative flex min-h-12 items-center justify-center text-[17px] font-medium after:bottom-2 focus-visible:outline-[#111] ${
                    current ? dots : 'text-[#6b6b6b]'
                  }`}
                >
                  {l.label}
                </a>
              )
            })}
            <a
              href={CONTACT_URL}
              className="mt-3 flex min-h-12 items-center justify-center rounded-full bg-[#28282a] text-[16px] font-medium text-white focus-visible:outline-[#111]"
            >
              {CONTACT_LABEL}
            </a>
            <a
              href={APPLY_URL}
              className="flex min-h-12 items-center justify-center text-[15px] text-[#6b6b6b] focus-visible:outline-[#111]"
            >
              {APPLY_LABEL}
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
