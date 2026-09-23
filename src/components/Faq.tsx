import { type ReactNode, useState } from 'react'
import { APPLY_URL, CONTACT_LABEL, CONTACT_URL } from './SiteHeader'
import { Plus } from './ui/icons'

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
        <a href={CONTACT_URL} className="underline decoration-rule underline-offset-4 hover:decoration-ink">
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
        <a href={APPLY_URL} className="underline decoration-rule underline-offset-4 hover:decoration-ink">
          Apply to join
        </a>
        .
      </>
    ),
  },
]

/**
 * A compact list of questions; each one slides its answer open. The panel
 * animates grid rows from 0fr to 1fr (a smooth height without measuring) with
 * a fade, calm and short. Closed answers are inert, so they can't be tabbed
 * into or read out; reduced motion makes the change instant.
 */
export function Faq() {
  const [open, setOpen] = useState<Set<number>>(() => new Set())
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (!next.delete(i)) next.add(i)
      return next
    })

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16 border-t border-rule">
      <div className="page grid12 py-section">
        <h2 id="faq-title" className="type-h2 lg:col-span-4">
          Questions, answered.
        </h2>
        <ul className="mt-10 border-t-2 border-ink lg:col-span-7 lg:col-start-6 lg:mt-0">
          {faqs.map((f, i) => {
            const isOpen = open.has(i)
            return (
              <li key={f.q} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => toggle(i)}
                    className="group flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left text-[17px] font-medium tracking-[-0.01em] transition-colors hover:text-ink"
                  >
                    {f.q}
                    <span
                      aria-hidden="true"
                      className={`grid size-7 shrink-0 place-items-center border transition-colors duration-300 ease-[var(--ease-ui)] ${
                        isOpen
                          ? 'border-ink bg-ink text-bg'
                          : 'border-rule text-muted group-hover:border-ink group-hover:text-ink'
                      }`}
                    >
                      {/* The plus turns a quarter and a half into a close mark; the square stays put. */}
                      <Plus
                        className={`size-3.5 transition-transform duration-300 ease-[var(--ease-ui)] ${isOpen ? 'rotate-45' : ''}`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-ui)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[60ch] pr-12 pb-5 text-[15px] leading-relaxed text-muted">{f.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
