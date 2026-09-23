import { type Field, KINDS, LIMITS, validateInquiry } from '~/lib/inquiry'
import { Choices, FormFrame, Sent, SubmitRow, TextField, useFormPost } from '../forms/form-kit'

const ORDER: readonly Field[] = ['name', 'email', 'company', 'kind', 'message']

const sent = {
  title: 'Brief received.',
  body: 'A lead reviewer reads it and replies by email with a scoped first draft of the brief and a quote.',
}

/** The hire-us form, posted to /api/contact. */
export function ContactForm() {
  const { status, errors, formRef, sentRef, onSubmit } = useFormPost('/api/contact', validateInquiry, ORDER)

  if (status === 'sent') return <Sent {...sent} headingRef={sentRef} />

  return (
    <FormFrame
      action="/api/contact"
      labelledBy="contact-title"
      formRef={formRef}
      onSubmit={onSubmit}
      sent={<Sent {...sent} />}
    >
      <Choices legend="What do you need?" name="kind" options={KINDS} />
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
        <TextField name="name" label="Name" autoComplete="name" maxLength={LIMITS.name} error={errors.name} />
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          error={errors.email}
        />
      </div>
      <TextField
        name="company"
        label="Company or project"
        optional
        autoComplete="organization"
        maxLength={LIMITS.company}
        error={errors.company}
      />
      <TextField
        name="message"
        label="The brief"
        hint="A few sentences: what you are making, for whom, and by when."
        rows={6}
        minLength={LIMITS.messageMin}
        maxLength={LIMITS.message}
        error={errors.message}
      />
      <SubmitRow status={status} label="Send the brief" note="We follow up by email." />
    </FormFrame>
  )
}
