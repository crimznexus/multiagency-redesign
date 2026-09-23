import { type Field, LIMITS, SKILLS, validateApplication } from '~/lib/application'
import { Choices, FormFrame, Sent, SubmitRow, TextField, useFormPost } from '../forms/form-kit'

const ORDER: readonly Field[] = ['name', 'email', 'skill', 'near', 'link', 'message']

const sent = {
  title: 'Application received.',
  body: 'A lead reviewer reads it and replies by email. Meanwhile, open work is listed on NEARN.',
}

/** The apply-to-join form, posted to /api/apply. */
export function ApplyForm() {
  const { status, errors, formRef, sentRef, onSubmit } = useFormPost('/api/apply', validateApplication, ORDER)

  if (status === 'sent') return <Sent {...sent} headingRef={sentRef} />

  return (
    <FormFrame
      action="/api/apply"
      labelledBy="apply-title"
      formRef={formRef}
      onSubmit={onSubmit}
      sent={<Sent {...sent} />}
    >
      <Choices legend="What do you do best?" name="skill" options={SKILLS} />
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
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
        <TextField
          name="near"
          label="NEAR account"
          optional
          placeholder="name.near"
          autoComplete="off"
          maxLength={LIMITS.near}
          error={errors.near}
        />
        <TextField
          name="link"
          label="Portfolio or GitHub"
          optional
          placeholder="github.com/you"
          inputMode="url"
          autoComplete="url"
          maxLength={LIMITS.link}
          error={errors.link}
        />
      </div>
      <TextField
        name="message"
        label="About your work"
        hint="A few sentences: what you do, and one project you are proud of."
        rows={6}
        minLength={LIMITS.messageMin}
        maxLength={LIMITS.message}
        error={errors.message}
      />
      <SubmitRow status={status} label="Send the application" note="We follow up by email." />
    </FormFrame>
  )
}
