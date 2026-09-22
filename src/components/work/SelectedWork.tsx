import { ArrowUpRight } from '../ui/icons'
import { ExternalLink } from '../ui/primitives'
import { type Brief, type FeaturedProject, featured, type OtherProject, others } from './work-data'

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/**
 * Work, in three weights: two screenshots on an 8/4 split, the video
 * programme as one big figure against its nine briefs, then the rest as a
 * plain three-column index. No two of them share a layout.
 */
export function SelectedWork() {
  const [ping, builders, legion] = featured
  if (!ping || !builders || !legion) return null
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="scroll-mt-16 border-t border-rule [contain-intrinsic-size:auto_1800px] [content-visibility:auto]"
    >
      <div className="page py-section">
        <h2 id="work-title" className="type-h2">
          Selected work.
        </h2>

        <ul className="grid12 mt-14 gap-y-10">
          <li className="lg:col-span-8">
            <ScreenshotCase project={ping} ratio="aspect-[16/10]" sizes="(min-width: 1024px) 860px, 100vw" />
          </li>
          <li className="lg:col-span-4">
            <ScreenshotCase
              project={builders}
              ratio="aspect-[16/10] lg:aspect-[4/5]"
              sizes="(min-width: 1024px) 420px, 100vw"
            />
          </li>
        </ul>

        <BriefsCase project={legion} />
        <AlsoInProgress projects={others} />
      </div>
    </section>
  )
}

function ScreenshotCase({ project, ratio, sizes }: { project: FeaturedProject; ratio: string; sizes: string }) {
  if (project.visual.kind !== 'screenshot') return null
  const { image, alt } = project.visual
  const src = (w: number, ext: string) => `/work/${image}-${w}.${ext}`
  return (
    <figure id={`work-${project.id}`} className="scroll-mt-20">
      <div className="border border-rule bg-surface">
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
            className={`block h-auto w-full object-cover object-left-top ${ratio}`}
          />
        </picture>
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 pt-4">
        <div>
          <h3 id={`${project.id}-title`} className="type-h3">
            {project.name}
          </h3>
          <p className="mt-1 text-[15px] text-muted">{project.headline}</p>
        </div>
        {project.link && (
          <ExternalLink href={project.link.href} className="link shrink-0 text-[15px]">
            <span className="hidden sm:inline">{project.link.label}</span>
            <ArrowUpRight />
          </ExternalLink>
        )}
      </figcaption>
    </figure>
  )
}

function BriefsCase({ project }: { project: FeaturedProject }) {
  if (project.visual.kind !== 'briefs') return null
  const briefs: Brief[] = project.visual.briefs
  const accepted = project.stats[0]
  return (
    <article
      id={`work-${project.id}`}
      aria-labelledby={`${project.id}-title`}
      className="grid12 mt-20 scroll-mt-20 border-t-2 border-ink pt-6"
    >
      <div className="lg:col-span-4">
        <p className="type-num">{accepted?.value ?? '9/9'}</p>
        <h3 id={`${project.id}-title`} className="type-h3 mt-4">
          {project.name}
        </h3>
        <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-muted">{project.description}</p>
      </div>
      <ul
        aria-label="Commissioned video briefs, all accepted"
        className="mt-8 grid gap-x-6 sm:grid-cols-2 lg:col-span-7 lg:col-start-6 lg:mt-0 lg:grid-cols-3"
      >
        {briefs.map((b) => (
          <li key={b.id} className="border-b border-rule py-3.5">
            <span className="type-mono block text-muted">{b.id}</span>
            <span className="mt-0.5 block text-[15px] font-medium">{b.title}</span>
            <span className="block text-sm text-muted">{b.format}</span>
            <span className="sr-only">Accepted</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function AlsoInProgress({ projects }: { projects: OtherProject[] }) {
  return (
    <ul className="grid12 mt-20 gap-y-8 border-t-2 border-ink pt-6">
      {projects.map((p) => (
        <li key={p.name} id={`work-${slug(p.name)}`} className="scroll-mt-20 lg:col-span-4">
          <h3 className="type-h3">{p.name}</h3>
          <p className="mt-1.5 max-w-[42ch] text-[15px] text-muted">{p.description}</p>
          {p.link && (
            <ExternalLink href={p.link.href} className="link mt-1 text-[15px]">
              {p.link.label}
              <ArrowUpRight />
            </ExternalLink>
          )}
        </li>
      ))}
    </ul>
  )
}
