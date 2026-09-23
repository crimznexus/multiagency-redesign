/**
 * Delivers a validated hire-us inquiry to a webhook.
 *
 * Set CONTACT_WEBHOOK_URL to any endpoint that accepts a JSON POST (Slack or
 * Discord incoming webhook, Zapier, Make, n8n, your CRM). The body carries a
 * ready-to-read `text` / `content` line plus the structured fields.
 * Without it, development logs the inquiry and production refuses it, so a
 * lead is never silently dropped.
 */
import type { Inquiry } from '~/lib/inquiry'

export type DeliveryResult = 'sent' | 'not-configured' | 'failed'

export async function deliverInquiry(inquiry: Inquiry): Promise<DeliveryResult> {
  const url = process.env.CONTACT_WEBHOOK_URL
  if (!url) {
    if (process.env.NODE_ENV === 'production') return 'not-configured'
    console.info('[contact] CONTACT_WEBHOOK_URL is not set; inquiry logged only:', inquiry)
    return 'sent'
  }
  const who = inquiry.company ? `${inquiry.name} (${inquiry.company})` : inquiry.name
  const text = `New inquiry from ${who} <${inquiry.email}>${inquiry.kind ? ` · ${inquiry.kind}` : ''}\n\n${inquiry.message}`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, content: text, inquiry, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
