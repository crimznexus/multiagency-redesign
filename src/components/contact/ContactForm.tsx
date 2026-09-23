import { type FormEvent, type Ref, useEffect, useRef, useState } from 'react'
import { type Field, type FieldErrors, KINDS, LIMITS, validateInquiry } from '~/lib/inquiry'
import { ArrowRight, Check } from '../ui/icons'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

const input =
  'block w-full border border-ink/40 bg-transparent px-3.5 py-3 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-ink focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-0 aria-[invalid=true]:border-ink aria-[invalid=true]:bg-signal/15'

/**
 * The hire-us form. Validates in the browser with the same rules the server
 * uses, shows errors beside each field and moves focus to the first one, and
 * posts JSON to /api/contact. Without scripts the same form posts natively.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const form = useRef<HTMLFormElement>(null)
  const done = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (status === 'sent') done.current?.focus()
  }, [status])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const checked = validateInquiry(data)
    if ('errors' in checked) {
      setErrors(checked.errors)
      const first = (['name', 'email', 'company', 'kind', 'message'] as Field[]).find((f) => checked.errors[f])
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setErrors({})
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: FieldErrors }
      if (res.ok && body.ok) return setStatus('sent')
      if (body.errors) setErrors(body.errors)
      setStatus('failed')
    } catch {
      setStatus('failed')
    }
  }

  if (status === 'sent') return <Sent headingRef={done} />

  const error = (f: Field) =>
    errors[f] ? (
      <p id={`${f}-error`} className="type-mono mt-2 text-ink">
        {errors[f]}
      </p>
    ) : null
  const aria = (f: Field) => ({
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? `${f}-error` : undefined,
  })

  return (
    <>
      {/* No-script results: the API redirects here with a hash, and :target shows the right one. */}
      <div id="sent" className="hidden target:block">
        <Sent />
      </div>
      <p id="error" className="type-mono mb-6 hidden border-t-2 border-ink pt-3 target:block">
        That did not go through. Check the fields and send it again.
      </p>

      <form
        ref={form}
        action="/api/contact"
        method="post"
        noValidate
        onSubmit={onSubmit}
        aria-labelledby="contact-title"
        className="grid gap-7 border-t-2 border-ink pt-6 [#sent:target~&]:hidden"
      >
        <fieldset>
          <legend className="type-label text-muted">What do you need?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {KINDS.map((k, i) => (
              <label key={k} className="cursor-pointer">
                <input type="radio" name="kind" value={k} defaultChecked={i === 0} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center border border-ink/40 px-4 text-[15px] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink hover:border-ink">
                  {k}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
          <div>
            <label htmlFor="name" className="text-[15px] font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              maxLength={LIMITS.name}
              required
              className={`${input} mt-2`}
              {...aria('name')}
            />
            {error('name')}
          </div>
          <div>
            <label htmlFor="email" className="text-[15px] font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              required
              className={`${input} mt-2`}
              {...aria('email')}
            />
            {error('email')}
          </div>
        </div>

        <div>
          <label htmlFor="company" className="text-[15px] font-medium">
            Company or project <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            maxLength={LIMITS.company}
            className={`${input} mt-2`}
            {...aria('company')}
          />
          {error('company')}
        </div>

        <div>
          <label htmlFor="message" className="text-[15px] font-medium">
            The brief
          </label>
          <p id="message-hint" className="mt-1 text-sm text-muted">
            A few sentences: what you are making, for whom, and by when.
          </p>
          <textarea
            id="message"
            name="message"
            rows={6}
            minLength={LIMITS.messageMin}
            maxLength={LIMITS.message}
            required
            className={`${input} mt-2 resize-y`}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'message-hint message-error' : 'message-hint'}
          />
          {error('message')}
        </div>

        {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="submit" disabled={status === 'sending'} className="btn btn-signal disabled:opacity-60">
            {status === 'sending' ? 'Sending' : 'Send the brief'}
            <ArrowRight />
          </button>
          <p role="status" className="type-mono text-muted">
            {status === 'failed'
              ? 'That did not go through. Your text is still here; try again in a moment.'
              : 'We follow up by email.'}
          </p>
        </div>
      </form>
    </>
  )
}

function Sent({ headingRef }: { headingRef?: Ref<HTMLHeadingElement> }) {
  return (
    <div className="border-t-2 border-ink pt-6">
      <span className="grid size-10 place-items-center bg-signal text-on-signal">
        <Check className="size-5" />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="type-h3 mt-5 text-2xl outline-none">
        Brief received.
      </h2>
      <p className="mt-2 max-w-[48ch] text-[17px] leading-relaxed text-muted">
        A lead reviewer reads it and replies by email with a scoped first draft of the brief and a quote.
      </p>
      <a href="/" className="link mt-4">
        Back to the home page
      </a>
    </div>
  )
}
