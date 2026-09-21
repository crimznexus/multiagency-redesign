import { BriefLedger, BrowserFrame } from './visuals'
import { type FeaturedProject, featured, type OtherProject, others } from './work-data'

export function SelectedWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      // Below the fold: skip rendering (and its font/image requests) until it's near the viewport.
      // `auto` remembers the real height once rendered, so the scrollbar doesn't jump.
      className="scroll-mt-6 border-t border-rule [contain-intrinsic-size:auto_2400px] [content-visibility:auto]"
    >
      <div className="page py-[clamp(4rem,9vw,8rem)]">
        <header className="max-w-2xl">
          <p className="label">01 · Selected work</p>
          <h2 id="work-title" className="mt-4 text-h2 font-semibold">
            Work, reviewed and shipped.
          </h2>
          <p className="mt-4 max-w-[30em] text-lede text-graphite">
            A few things our contributors are building right now, each one drafted fast and signed off by a person.
          </p>
        </header>

        <ol className="mt-[clamp(3rem,6vw,5rem)] grid gap-[clamp(4rem,9vw,7.5rem)]">
          {featured.map((project, i) => (
            <li key={project.id}>
              <Featured project={project} index={i} />
            </li>
          ))}
        </ol>

        <AlsoActive projects={others} />
      </div>
    </section>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

function Featured({ project, index }: { project: FeaturedProject; index: number }) {
  const flip = index % 2 === 1
  return (
    <article
      id={`work-${project.id}`}
      aria-labelledby={`${project.id}-title`}
      className="group scroll-mt-8 grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-12 lg:gap-6"
    >
      <figure className={`lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''}`}>
        <div className="transition duration-500 ease-out-soft group-hover:-translate-y-1 group-hover:drop-shadow-[0_18px_24px_rgb(40_30_20/0.12)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          {project.visual.kind === 'screenshot' ? (
            <BrowserFrame image={project.visual.image} alt={project.visual.alt} url={project.link?.label} />
          ) : (
            <BriefLedger briefs={project.visual.briefs} />
          )}
        </div>
        <figcaption className="mt-3 font-mono text-micro text-graphite">{project.caption}</figcaption>
      </figure>

      <div className={`lg:col-span-5 ${flip ? 'lg:order-1 lg:col-start-1 lg:pr-6' : 'lg:col-start-8 lg:pl-6'}`}>
        <p className="font-mono text-label text-struck">{pad(index + 1)}</p>
        <h3
          id={`${project.id}-title`}
          className="mt-3 text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight font-semibold tracking-[-0.025em]"
        >
          {project.name}
        </h3>
        <p className="mt-1 text-lg text-graphite">{project.headline}</p>
        <p className="mt-5 max-w-[32em] leading-relaxed">{project.description}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Disciplines">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-rule px-2.5 py-1 font-mono text-micro text-graphite">
              {tag}
            </li>
          ))}
        </ul>

        {/* The human layer: a reviewer's note in the margin, as on every piece of work. */}
        <aside aria-label="Reviewer note" className="mt-7 border-l-[1.5px] border-pencil pl-4">
          <p className="font-note text-note text-pencil-deep italic">“{project.note}”</p>
          <p className="mt-1.5 font-mono text-micro text-graphite">Lead reviewer</p>
        </aside>

        {project.link && (
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-11 items-center gap-2 text-[15px] font-medium underline decoration-1 underline-offset-[5px] hover:decoration-pencil"
          >
            Visit {project.link.label}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  )
}

function AlsoActive({ projects }: { projects: OtherProject[] }) {
  return (
    <div className="mt-[clamp(4rem,9vw,7.5rem)]">
      <h3 className="label">Also active</h3>
      <ul className="mt-4 border-t border-ink">
        {projects.map((p) => (
          <li
            key={p.name}
            id={`work-${slug(p.name)}`}
            className="scroll-mt-8 grid gap-x-6 gap-y-2 border-b border-rule py-5 md:grid-cols-[minmax(0,3fr)_minmax(0,6fr)_minmax(0,3fr)] md:items-baseline"
          >
            <span className="text-lg font-semibold tracking-tight">{p.name}</span>
            <span className="text-graphite">{p.description}</span>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
              <span className="font-mono text-micro text-graphite">{p.tags.join(' · ')}</span>
              {p.link && (
                <a
                  href={p.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 text-[15px] font-medium underline decoration-1 underline-offset-[5px] hover:decoration-pencil"
                >
                  {p.link.label}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
