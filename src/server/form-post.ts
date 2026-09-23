import type { Validated } from '~/lib/forms'
import { type DeliveryResult, deliver, type FormType } from './deliver'

/**
 * One POST handler for every site form.
 *
 * With scripts, the form posts JSON and gets JSON back: 200, 422 with field
 * errors, or 503 when delivery fails. Without scripts it posts form-encoded
 * and is redirected to `<page>#sent` or `<page>#error`, which the page shows
 * with `:target`. A filled-in `website` field is the honeypot: accepted, dropped.
 */
export async function handleFormPost<T extends object, F extends string>(
  request: Request,
  form: {
    type: FormType
    page: string
    validate: (raw: Record<string, unknown>) => Validated<T, F>
    summarise: (value: T) => string
  },
): Promise<Response> {
  const isJson = request.headers.get('content-type')?.includes('application/json') ?? false
  let raw: Record<string, unknown>
  try {
    raw = isJson ? ((await request.json()) as Record<string, unknown>) : Object.fromEntries(await request.formData())
  } catch {
    return Response.json({ ok: false, error: 'bad-request' }, { status: 400 })
  }

  const back = (hash: 'sent' | 'error') =>
    new Response(null, { status: 303, headers: { location: `${form.page}#${hash}` } })

  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return isJson ? Response.json({ ok: true }) : back('sent')
  }

  const result = form.validate(raw)
  if ('errors' in result) {
    return isJson ? Response.json({ ok: false, errors: result.errors }, { status: 422 }) : back('error')
  }

  const delivery: DeliveryResult = await deliver(form.type, form.summarise(result.value), result.value)
  if (delivery !== 'sent') {
    return isJson ? Response.json({ ok: false, error: delivery }, { status: 503 }) : back('error')
  }
  return isJson ? Response.json({ ok: true }) : back('sent')
}
