import { createFileRoute } from '@tanstack/react-router'
import { validateInquiry } from '~/lib/inquiry'
import { deliverInquiry } from '~/server/contact'

/**
 * POST /api/contact: a hire-us inquiry.
 *
 * The form posts JSON when scripts run and gets JSON back. Without scripts it
 * posts form-encoded and is redirected to /contact#sent or /contact#error,
 * which the page shows with `:target`, so it works either way.
 * A filled-in `website` field is the honeypot: accepted and dropped.
 */
export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const isJson = request.headers.get('content-type')?.includes('application/json') ?? false
        let raw: Record<string, unknown>
        try {
          raw = isJson
            ? ((await request.json()) as Record<string, unknown>)
            : Object.fromEntries(await request.formData())
        } catch {
          return Response.json({ ok: false, error: 'bad-request' }, { status: 400 })
        }

        const back = (hash: 'sent' | 'error') =>
          new Response(null, { status: 303, headers: { location: `/contact#${hash}` } })

        if (typeof raw.website === 'string' && raw.website.trim() !== '') {
          return isJson ? Response.json({ ok: true }) : back('sent')
        }

        const result = validateInquiry(raw)
        if ('errors' in result) {
          return isJson ? Response.json({ ok: false, errors: result.errors }, { status: 422 }) : back('error')
        }

        const delivery = await deliverInquiry(result.inquiry)
        if (delivery !== 'sent') {
          return isJson ? Response.json({ ok: false, error: delivery }, { status: 503 }) : back('error')
        }
        return isJson ? Response.json({ ok: true }) : back('sent')
      },
    },
  },
})
