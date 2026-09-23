import { createFileRoute } from '@tanstack/react-router'
import { ContactForm } from '~/components/contact/ContactForm'
import { SiteFooter } from '~/components/SiteFooter'
import { SiteHeader } from '~/components/SiteHeader'

const title = 'Hire us | MultiAgency'
const description = 'Tell MultiAgency what you need. A lead reviewer replies by email with a scoped brief and a quote.'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ],
  }),
  component: Contact,
})

const next = [
  { step: 'Read', text: 'A lead reviewer reads your brief and replies by email.' },
  { step: 'Scope', text: 'You get a scoped first draft of the brief and a quote.' },
  { step: 'Build', text: 'AI drafts, a named specialist builds, nothing ships until you accept.' },
]

/** Split like the hero: the ask and what happens next on the left, the form on the right. */
function Contact() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page grid12 items-start gap-y-12 pt-10 pb-section sm:pt-14 md:grid-cols-12">
        <div className="md:col-span-5 lg:sticky lg:top-28">
          <p className="type-label mb-5 text-muted">Hire us</p>
          <h1 id="contact-title" className="type-h2">
            Tell us what you need.
          </h1>
          <p className="mt-6 max-w-[40ch] text-lede text-muted">
            Product, bots, video or social. Describe it in your own words; we turn it into a brief.
          </p>
          <ol className="mt-10 border-t border-rule">
            {next.map((n, i) => (
              <li key={n.step} className="grid grid-cols-[3ch_5rem_minmax(0,1fr)] gap-x-3 border-b border-rule py-3">
                <span className="type-mono text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[15px] font-medium">{n.step}</span>
                <span className="text-[15px] text-muted">{n.text}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
