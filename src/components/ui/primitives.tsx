import type { ReactNode } from 'react'

/**
 * A live-status dot for real, live data only (hero pill, treasury). `live`
 * adds the ping ring: the only looping motion on the page.
 */
export function LiveDot({ live = true }: { live?: boolean }) {
  const color = 'bg-signal'
  return (
    <span aria-hidden="true" className="relative inline-flex size-1.5 shrink-0">
      {live && <span className={`absolute inset-0 animate-ping rounded-full opacity-60 ${color}`} />}
      <span className={`relative size-1.5 rounded-full ${color} ${live ? '' : 'opacity-50'}`} />
    </span>
  )
}

/** Centred section head (DESIGN.md §5): pill → H2 → lede. */
export function SectionHead({
  id,
  pill,
  title,
  children,
}: {
  id: string
  /** Rationed: at most one section label per three sections (taste-skill eyebrow rule). */
  pill?: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
      {pill && <p className="pill mb-5">{pill}</p>}
      <h2 id={id} className="type-h2">
        {title}
      </h2>
      {children && <p className="mt-4 max-w-[38rem] text-lede text-muted">{children}</p>}
    </header>
  )
}

export function ExternalLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
