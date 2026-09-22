import { type Service, services } from './services-data'

/*
 * Sticky split: the heading holds its place while the four services scroll past.
 * No cards and no mock-ups: the project console above already shows what AI
 * drafts and what people own, so this section only says what you can hire.
 */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="page scroll-mt-20 py-section">
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="services-title" className="type-h2">
              What you can hire us for
            </h2>
            <p className="mt-4 max-w-[26rem] text-lede text-muted">
              Four kinds of work. Each one runs through the same six steps.
            </p>
          </div>
        </div>

        <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-8">
          {services.map((s) => (
            <li key={s.id}>
              <ServiceItem service={s} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ServiceItem({ service }: { service: Service }) {
  return (
    <article aria-labelledby={`service-${service.id}`} className="border-t border-cream/12 pt-6">
      <h3 id={`service-${service.id}`} className="type-h3">
        {service.name}
      </h3>
      <p className="mt-2 max-w-[30rem] text-muted">{service.summary}</p>
      <ul aria-label={`${service.name}: recent work`} className="mt-4 flex flex-wrap gap-2">
        {service.proof.map((p) => (
          <li key={p.href + p.label}>
            <a
              href={p.href}
              className="inline-flex min-h-11 items-center rounded-btn border border-cream/10 bg-cream/4 px-3 text-sm text-cream transition-colors hover:border-cream/20 hover:bg-cream/8"
            >
              {p.label}
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}
