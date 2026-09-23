import { useState } from 'react'
import { ArrowUpRight } from '../ui/icons'
import { ExternalLink } from '../ui/primitives'
import { type Project, projects } from './work-data'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Our work, as one ruled index: the five projects multiagency.ai lists, one
 * row each. From `md` a single preview frame sits beside the list and
 * follows the row you hover or focus.
 */
export function SelectedWork() {
  const [active, setActive] = useState(0)
  const current = projects[active]

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="scroll-mt-16 border-t border-rule [contain-intrinsic-size:auto_900px] [content-visibility:auto]"
    >
      <div className="page py-section">
        <div className="flex items-end justify-between gap-6">
          <h2 id="work-title" className="type-h2">
            Our work.
          </h2>
          <p className="type-mono pb-2 text-muted">{pad(projects.length)} projects</p>
        </div>

        <div className="grid12 mt-10 items-start md:grid-cols-12">
          <ol className="border-t-2 border-ink md:col-span-7">
            {projects.map((p, i) => (
              <Row key={p.id} project={p} index={i} active={i === active} onActivate={() => setActive(i)} />
            ))}
          </ol>

          {current && (
            <div className="hidden md:sticky md:top-24 md:col-span-5 md:block">
              <Preview current={current} />
              <p className="type-mono mt-3 text-muted">
                {pad(active + 1)} / {pad(projects.length)} · {current.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Row({
  project: p,
  index,
  active,
  onActivate,
}: {
  project: Project
  index: number
  active: boolean
  onActivate: () => void
}) {
  return (
    <li
      id={`work-${p.id}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`grid scroll-mt-24 grid-cols-[3ch_minmax(0,1fr)] gap-x-4 border-b border-rule px-2 py-4 transition-colors sm:grid-cols-[3ch_minmax(0,1fr)_auto] sm:gap-x-6 ${
        active ? 'md:bg-surface' : ''
      }`}
    >
      <span className={`type-mono pt-1 ${active ? 'text-ink' : 'text-muted'}`}>{pad(index + 1)}</span>
      <div>
        <h3 className="type-h3">{p.name}</h3>
        <p className="mt-1 max-w-[52ch] text-[15px] leading-snug text-muted">{p.description}</p>
      </div>
      <div className="col-start-2 mt-2 flex items-center gap-4 sm:col-start-3 sm:mt-0 sm:flex-col sm:items-end sm:gap-1.5 sm:pt-1">
        <span className="type-label text-[11px] text-muted">{p.kind}</span>
        {p.link && (
          <ExternalLink href={p.link.href} className="link text-[14px]">
            {p.link.label}
            <ArrowUpRight />
          </ExternalLink>
        )}
      </div>
    </li>
  )
}

/** Every image stays mounted and cross-fades, so hovering never waits on a download. */
function Preview({ current }: { current: Project }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden border border-rule bg-surface">
      {projects.map((p) => {
        const shown = p.id === current.id
        const src = (w: number, ext: string) => `/work/${p.image.name}-${w}.${ext}`
        return (
          <picture key={p.id} aria-hidden={!shown}>
            <source type="image/avif" srcSet={`${src(640, 'avif')} 640w, ${src(1200, 'avif')} 1200w`} sizes="40vw" />
            <source type="image/webp" srcSet={`${src(640, 'webp')} 640w, ${src(1200, 'webp')} 1200w`} sizes="40vw" />
            <img
              src={src(1200, 'webp')}
              alt={p.image.alt}
              width={1200}
              height={750}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover object-left-top transition-opacity duration-200 ${
                shown ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </picture>
        )
      })}
    </div>
  )
}
