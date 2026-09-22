import { ArrowUpRight, Check } from '../ui/icons'
import { ExternalLink, SectionHead } from '../ui/primitives'
import { type Brief, type FeaturedProject, featured, type OtherProject, others } from './work-data'

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export function SelectedWork() {
  const [ping, builders, legion] = featured
  if (!ping || !builders || !legion) return null
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="page scroll-mt-20 py-section [contain-intrinsic-size:auto_2200px] [content-visibility:auto]"
    >
      <SectionHead id="work-title" title="Shipped, live, and on the record">
        Every figure below comes from the live site or the payment record.
      </SectionHead>

      {/* Bento: 7/5, then a full-width row, then one list panel (no three equal cards). */}
      <ul className="mt-14 grid gap-4 lg:grid-cols-12">
        <li className="lg:col-span-7">
          <ScreenshotCase project={ping} />
        </li>
        <li className="lg:col-span-5">
          <ScreenshotCase project={builders} />
        </li>
        <li className="lg:col-span-12">
          <BriefsCase project={legion} />
        </li>
        <li className="lg:col-span-12">
          <AlsoInProgress projects={others} />
        </li>
      </ul>
    </section>
  )
}

function Stats({ stats }: { stats: FeaturedProject['stats'] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-row border border-cream/8 bg-cream/8">
      {stats.map((s) => (
        // dt first for valid markup; flex-col-reverse puts the figure on top visually.
        <div key={s.label} className="flex flex-col-reverse bg-panel px-4 py-3">
          <dt className="mt-1 text-xs text-dim">{s.label}</dt>
          <dd className="font-mono text-2xl font-semibold tracking-[-0.04em] tabular-nums">{s.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function CaseHeader({ project }: { project: FeaturedProject }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="type-label text-dim">{project.tags.join(', ')}</p>
        <h3 id={`${project.id}-title`} className="type-h3 mt-2">
          {project.name}
        </h3>
        <p className="mt-1 text-muted">{project.headline}</p>
      </div>
      {project.link && (
        <ExternalLink
          href={project.link.href}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-cream/12 bg-cream/4 text-cream transition-colors hover:border-cream/25 hover:bg-cream/8"
        >
          <ArrowUpRight className="size-4" />
          <span className="sr-only">Visit {project.link.label}</span>
        </ExternalLink>
      )}
    </div>
  )
}

function ScreenshotCase({ project }: { project: FeaturedProject }) {
  if (project.visual.kind !== 'screenshot') return null
  const { image, alt } = project.visual
  const src = (w: number, ext: string) => `/work/${image}-${w}.${ext}`
  const sizes = '(min-width: 1024px) 700px, 100vw'
  return (
    <article
      id={`work-${project.id}`}
      aria-labelledby={`${project.id}-title`}
      className="panel flex h-full scroll-mt-24 flex-col overflow-hidden"
    >
      <div className="border-b border-cream/8 bg-canvas p-3">
        <picture>
          <source type="image/avif" srcSet={`${src(640, 'avif')} 640w, ${src(1200, 'avif')} 1200w`} sizes={sizes} />
          <source type="image/webp" srcSet={`${src(640, 'webp')} 640w, ${src(1200, 'webp')} 1200w`} sizes={sizes} />
          <img
            src={src(1200, 'webp')}
            alt={alt}
            width={1200}
            height={750}
            loading="lazy"
            decoding="async"
            className="block aspect-[16/10] h-auto w-full rounded-row object-cover object-top"
          />
        </picture>
        {project.link && <p className="px-1 pt-2.5 font-mono text-xs text-dim">{project.link.label}</p>}
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <CaseHeader project={project} />
        <p className="max-w-[40rem] text-sm text-muted">{project.description}</p>
        <div className="mt-auto">
          <Stats stats={project.stats} />
        </div>
      </div>
    </article>
  )
}

function BriefsCase({ project }: { project: FeaturedProject }) {
  if (project.visual.kind !== 'briefs') return null
  const briefs: Brief[] = project.visual.briefs
  return (
    <article
      id={`work-${project.id}`}
      aria-labelledby={`${project.id}-title`}
      className="panel grid scroll-mt-24 overflow-hidden lg:grid-cols-12"
    >
      <div className="flex flex-col gap-5 p-6 lg:col-span-5 lg:border-r lg:border-cream/8 lg:p-8">
        <CaseHeader project={project} />
        <p className="text-sm text-muted">{project.description}</p>
        <div className="mt-auto">
          <Stats stats={project.stats} />
        </div>
      </div>
      {/* Nine briefs as tiles, not nine hairline rows. */}
      <div className="bg-canvas/50 p-3 lg:col-span-7 lg:p-5">
        <ul aria-label="Commissioned video briefs, all accepted" className="grid gap-2 sm:grid-cols-3">
          {briefs.map((b) => (
            <li key={b.id} className="flex flex-col rounded-row border border-cream/8 bg-panel p-3.5">
              <span className="flex items-center justify-between font-mono text-xs text-dim tabular-nums">
                {b.id}
                <span className="inline-flex items-center gap-1 text-cream">
                  <Check className="size-3 text-signal" />
                  Accepted
                </span>
              </span>
              <span className="mt-3 text-sm font-medium">{b.title}</span>
              <span className="mt-0.5 text-xs text-dim">{b.format}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function AlsoInProgress({ projects }: { projects: OtherProject[] }) {
  return (
    <div className="panel grid gap-6 p-6 lg:grid-cols-12 lg:p-8">
      <h3 className="type-h3 lg:col-span-3">Also in progress</h3>
      <ul className="grid gap-5 lg:col-span-9">
        {projects.map((p) => (
          <li
            key={p.name}
            id={`work-${slug(p.name)}`}
            className="grid scroll-mt-24 gap-x-6 gap-y-1 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto] sm:items-baseline"
          >
            <span className="font-semibold">{p.name}</span>
            <span className="text-sm text-muted">{p.description}</span>
            {p.link ? (
              <ExternalLink href={p.link.href} className="link self-start text-sm sm:min-h-0">
                {p.link.label}
                <ArrowUpRight />
              </ExternalLink>
            ) : (
              <span className="type-label text-dim">{p.tags.join(', ')}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
