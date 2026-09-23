/**
 * Delivers a validated form (a hire-us inquiry or an application to join) to
 * a webhook.
 *
 * Set CONTACT_WEBHOOK_URL to any endpoint that accepts a JSON POST (Slack or
 * Discord incoming webhook, Zapier, Make, n8n, your CRM). Applications go to
 * APPLY_WEBHOOK_URL when it is set, and to the same webhook otherwise. The
 * body carries a ready-to-read `text` / `content` line, the form `type`, and
 * the structured fields. With no webhook, development logs the submission and
 * production refuses it, so nothing is ever silently dropped.
 */

export type FormType = 'inquiry' | 'application'
export type DeliveryResult = 'sent' | 'not-configured' | 'failed'

const webhookFor = (type: FormType) =>
  (type === 'application' && process.env.APPLY_WEBHOOK_URL) || process.env.CONTACT_WEBHOOK_URL

export async function deliver(type: FormType, text: string, data: object): Promise<DeliveryResult> {
  const url = webhookFor(type)
  if (!url) {
    if (process.env.NODE_ENV === 'production') return 'not-configured'
    console.info(`[${type}] no webhook is set; logged only:`, data)
    return 'sent'
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type, text, content: text, [type]: data, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
