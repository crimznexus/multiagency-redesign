import type { ReactNode } from 'react'
import { APPLY_URL, CONTACT_LABEL, CONTACT_URL } from './SiteHeader'

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: 'What does “AI-native” mean for my project?',
    a: 'AI produces the first drafts: scaffolds, scripts, variants, copy. That makes the early stages fast and cheap, so you see options in hours rather than weeks. Everything after the draft is done and signed off by people.',
  },
  {
    q: 'Who actually does the work?',
    a: 'A vetted specialist from the MultiAgency network builds it, and a lead reviewer checks every change against your brief. You know both by name, and nothing ships until you accept it.',
  },
  {
    q: 'How do payments work, and what can I see?',
    a: 'Specialists are paid from a shared treasury on NEAR. Each payout is a proposal that is voted on and recorded on-chain, so you can check who was paid for your work, and when. The Open books section above reads that record live.',
  },
  {
    q: 'What does a project cost?',
    a: (
      <>
        It depends on the brief. Tell us what you’re making and we’ll come back with a scoped first draft of the brief
        and a quote.{' '}
        <a href={CONTACT_URL} className="text-cream underline underline-offset-4 hover:decoration-signal">
          {CONTACT_LABEL}
        </a>
        .
      </>
    ),
  },
  {
    q: 'Do you only work on NEAR?',
    a: 'Most of our projects ship in the NEAR ecosystem, and our treasury runs there. Websites, bots, video and social work for any team.',
  },
  {
    q: 'Can I join as a builder?',
    a: (
      <>
        Yes. The network is open to specialists in product, bots, video and social.{' '}
        <a href={APPLY_URL} className="text-cream underline underline-offset-4 hover:decoration-signal">
          Apply to join
        </a>
        .
      </>
    ),
  },
]

/*
 * Side-by-side answers, all visible: six short questions read faster in a grid
 * than behind accordion toggles (taste-skill: no accordion FAQ).
 */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="page scroll-mt-20 py-section">
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <h2 id="faq-title" className="type-h2 lg:col-span-4">
          Questions, answered
        </h2>
        <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold tracking-[-0.01em]">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
