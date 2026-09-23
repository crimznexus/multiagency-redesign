import type { ReactNode } from 'react'
import { SiteFooter } from '../SiteFooter'
import { SiteHeader } from '../SiteHeader'

/**
 * The layout every form page shares (hire us, apply to join), split like the
 * hero: the ask, a lede and a numbered "what happens next" on the left, the
 * form on the right. Stacks on phones.
 */
export function FormPage({
  label,
  titleId,
  title,
  lede,
  steps,
  aside,
  children,
}: {
  label: string
  titleId: string
  title: string
  lede: string
  steps: { step: string; text: string }[]
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page grid12 items-start gap-y-12 pt-10 pb-section sm:pt-14 md:grid-cols-12">
        <div className="md:col-span-5 lg:sticky lg:top-28">
          <p className="type-label mb-5 text-muted">{label}</p>
          <h1 id={titleId} className="type-h2">
            {title}
          </h1>
          <p className="mt-6 max-w-[40ch] text-lede text-muted">{lede}</p>
          <ol className="mt-10 border-t border-rule">
            {steps.map((n, i) => (
              <li key={n.step} className="grid grid-cols-[3ch_5rem_minmax(0,1fr)] gap-x-3 border-b border-rule py-3">
                <span className="type-mono text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[15px] font-medium">{n.step}</span>
                <span className="text-[15px] text-muted">{n.text}</span>
              </li>
            ))}
          </ol>
          {aside}
        </div>
        <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">{children}</div>
      </main>
      <SiteFooter />
    </>
  )
}
