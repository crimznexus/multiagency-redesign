import { type FormEvent, type ReactNode, type Ref, useEffect, useRef, useState } from 'react'
import type { FieldErrors, Validated } from '~/lib/forms'
import { ArrowRight, Check } from '../ui/icons'

/**
 * The building blocks every site form uses (hire us, apply to join), so they
 * look and behave as one: square inputs, chips for a single choice, errors in
 * mono under the field, one submit row, and one success panel.
 */

type Status = 'idle' | 'sending' | 'sent' | 'failed'

const inputClass =
  'block w-full border border-ink/40 bg-transparent px-3.5 py-3 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-ink focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-0 aria-[invalid=true]:border-ink aria-[invalid=true]:bg-signal/15'

/**
 * Validates with the same rules the server uses, moves focus to the first
 * field in error, and posts JSON. Keeps the text when a send fails.
 */
export function useFormPost<T, F extends string>(
  endpoint: string,
  validate: (raw: Record<string, unknown>) => Validated<T, F>,
  order: readonly F[],
) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors<F>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const sentRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (status === 'sent') sentRef.current?.focus()
  }, [status])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const checked = validate(data)
    if ('errors' in checked) {
      setErrors(checked.errors)
      const first = order.find((f) => checked.errors[f])
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setErrors({})
    setStatus('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: FieldErrors<F> }
      if (res.ok && body.ok) return setStatus('sent')
      if (body.errors) setErrors(body.errors)
      setStatus('failed')
    } catch {
      setStatus('failed')
    }
  }

  return { status, errors, formRef, sentRef, onSubmit }
}

/**
 * The form element and the two no-script results: the API redirects back
 * with #sent or #error, and `:target` shows the right one.
 */
export function FormFrame({
  action,
  labelledBy,
  formRef,
  onSubmit,
  sent,
  children,
}: {
  action: string
  labelledBy: string
  formRef: Ref<HTMLFormElement>
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  sent: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <div id="sent" className="hidden target:block">
        {sent}
      </div>
      <p id="error" className="type-mono mb-6 hidden border-t-2 border-ink pt-3 target:block">
        That did not go through. Check the fields and send it again.
      </p>
      <form
        ref={formRef}
        action={action}
        method="post"
        noValidate
        onSubmit={onSubmit}
        aria-labelledby={labelledBy}
        className="grid gap-7 border-t-2 border-ink pt-6 [#sent:target~&]:hidden"
      >
        {children}
        {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </form>
    </>
  )
}

/** A single choice as square chips: a radio group, the chosen one filled with ink. */
export function Choices({ legend, name, options }: { legend: string; name: string; options: readonly string[] }) {
  return (
    <fieldset>
      <legend className="type-label text-muted">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o} className="cursor-pointer">
            <input type="radio" name={name} value={o} defaultChecked={i === 0} className="peer sr-only" />
            <span className="inline-flex min-h-11 items-center border border-ink/40 px-4 text-[15px] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink hover:border-ink">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** A labelled input or textarea, with an optional hint and its error underneath. */
export function TextField({
  name,
  label,
  error,
  optional,
  hint,
  rows,
  ...input
}: {
  name: string
  label: string
  error?: string
  optional?: boolean
  hint?: string
  rows?: number
  type?: string
  autoComplete?: string
  placeholder?: string
  maxLength?: number
  minLength?: number
  inputMode?: 'text' | 'email' | 'url'
}) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(' ') || undefined
  const shared = {
    id: name,
    name,
    required: !optional,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }
  return (
    <div>
      <label htmlFor={name} className="text-[15px] font-medium">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {rows ? (
        <textarea {...shared} {...input} rows={rows} className={`${inputClass} mt-2 resize-y`} />
      ) : (
        <input {...shared} {...input} className={`${inputClass} mt-2`} />
      )}
      {error && (
        <p id={`${name}-error`} className="type-mono mt-2 text-ink">
          {error}
        </p>
      )}
    </div>
  )
}

export function SubmitRow({ status, label, note }: { status: Status; label: string; note: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <button type="submit" disabled={status === 'sending'} className="btn btn-signal disabled:opacity-60">
        {status === 'sending' ? 'Sending' : label}
        <ArrowRight />
      </button>
      <p role="status" className="type-mono text-muted">
        {status === 'failed' ? 'That did not go through. Your text is still here; try again in a moment.' : note}
      </p>
    </div>
  )
}

/** Replaces the form once it is sent; the heading takes focus. */
export function Sent({
  title,
  body,
  headingRef,
}: {
  title: string
  body: string
  headingRef?: Ref<HTMLHeadingElement>
}) {
  return (
    <div className="border-t-2 border-ink pt-6">
      <span className="grid size-10 place-items-center bg-signal text-on-signal">
        <Check className="size-5" />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="type-h3 mt-5 text-2xl outline-none">
        {title}
      </h2>
      <p className="mt-2 max-w-[48ch] text-[17px] leading-relaxed text-muted">{body}</p>
      <a href="/" className="link mt-4">
        Back to the home page
      </a>
    </div>
  )
}
