import { type Service, services } from './services-data'

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="scroll-mt-6 border-t border-rule [contain-intrinsic-size:auto_1400px] [content-visibility:auto]"
    >
      <div className="page py-[clamp(4rem,9vw,8rem)]">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-6">
          <header className="lg:col-span-5">
            <p className="label">02 · Services</p>
            <h2 id="services-title" className="mt-4 text-h2 font-semibold">
              What we make.
            </h2>
          </header>
          <p className="max-w-[30em] self-end text-lede text-graphite lg:col-span-6 lg:col-start-7">
            Four kinds of work, one way of working: AI speeds up the first draft, and a named person owns what ships.
          </p>
        </div>

        <ol className="mt-[clamp(3rem,6vw,4.5rem)] grid gap-x-6 gap-y-14 md:grid-cols-2 md:gap-y-16">
          {services.map((service, i) => (
            <li key={service.id}>
              <ServiceBlock service={service} index={i} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ServiceBlock({ service, index }: { service: Service; index: number }) {
  return (
    <article aria-labelledby={`service-${service.id}`} className="border-t border-ink pt-6 lg:pr-10">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-label text-struck">{String(index + 1).padStart(2, '0')}</span>
        <h3
          id={`service-${service.id}`}
          className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight font-semibold tracking-[-0.025em]"
        >
          {service.name}
        </h3>
      </div>
      <p className="mt-4 max-w-[30em] text-lg leading-snug">{service.summary}</p>

      {/* The split every deliverable follows: the machine drafts, a person owns. */}
      <dl className="mt-7 grid grid-cols-[7.5rem_minmax(0,1fr)] border-t border-rule text-[15px] leading-snug">
        <dt className="border-b border-rule py-3 font-mono text-label text-graphite">AI drafts</dt>
        <dd className="border-b border-rule py-3 text-graphite">{service.aiDrafts}</dd>
        <dt className="flex items-start gap-2 border-b border-rule py-3 font-mono text-label text-pencil-deep">
          <span aria-hidden="true" className="mt-[0.45em] h-[1.5px] w-3 shrink-0 bg-pencil" />
          People own
        </dt>
        <dd className="border-b border-rule py-3 font-medium">{service.peopleOwn}</dd>
      </dl>

      <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-mono text-micro text-graphite">See it in</span>
        {service.proof.map((p) => (
          <a
            key={p.href + p.label}
            href={p.href}
            className="inline-flex min-h-11 items-center text-[15px] font-medium underline decoration-rule decoration-1 underline-offset-[5px] transition-colors hover:decoration-pencil"
          >
            {p.label}
          </a>
        ))}
      </p>
    </article>
  )
}
