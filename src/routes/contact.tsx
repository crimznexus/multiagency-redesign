import { createFileRoute } from '@tanstack/react-router'
import { ContactForm } from '~/components/contact/ContactForm'
import { FormPage } from '~/components/forms/FormPage'

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

function Contact() {
  return (
    <FormPage
      label="Hire us"
      titleId="contact-title"
      title="Tell us what you need."
      lede="Product, bots, video or social. Describe it in your own words; we turn it into a brief."
      steps={next}
    >
      <ContactForm />
    </FormPage>
  )
}
