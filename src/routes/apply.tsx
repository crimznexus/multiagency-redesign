import { createFileRoute } from '@tanstack/react-router'
import { ApplyForm } from '~/components/apply/ApplyForm'
import { FormPage } from '~/components/forms/FormPage'
import { ArrowUpRight } from '~/components/ui/icons'
import { ExternalLink } from '~/components/ui/primitives'

const title = 'Apply to join | MultiAgency'
const description =
  'Join the MultiAgency network as a specialist in product, bots, video or social. Every payout is public on NEAR.'

const NEARN_URL = 'https://nearn.io/multiagency/'

export const Route = createFileRoute('/apply')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ],
  }),
  component: Apply,
})

const next = [
  { step: 'Read', text: 'A lead reviewer reads your application and replies by email.' },
  { step: 'Build', text: 'You take briefs in your field. AI drafts; you build and own the result.' },
  { step: 'Paid', text: 'Each accepted brief is paid from the treasury, in public on NEAR.' },
]

function Apply() {
  return (
    <FormPage
      titleId="apply-title"
      title="Tell us about your work."
      lede="Specialists in product, bots, video and social. Named on the work, paid on the public record."
      steps={next}
      aside={
        <p className="mt-8 text-[15px] text-muted">
          Rather browse open work first?{' '}
          <ExternalLink href={NEARN_URL} className="link">
            Open listings on NEARN
            <ArrowUpRight />
          </ExternalLink>
        </p>
      }
    >
      <ApplyForm />
    </FormPage>
  )
}
