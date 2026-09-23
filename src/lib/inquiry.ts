/**
 * Hire-us inquiries: the fields and the one validator shared by the form (in
 * the browser) and /api/contact (on the server).
 */
import { done, EMAIL, type FieldErrors as Errors, oneOf, str, type Validated } from './forms'

export const KINDS = ['Product', 'Bots', 'Video', 'Social', 'Something else'] as const
export type Kind = (typeof KINDS)[number]

export interface Inquiry {
  name: string
  email: string
  company: string
  kind: Kind | ''
  message: string
}

export type Field = keyof Inquiry
export type FieldErrors = Errors<Field>

export const LIMITS = { name: 100, email: 200, company: 120, message: 4000, messageMin: 20 } as const

/** Normalises untrusted input; returns the inquiry or the errors to show beside each field. */
export function validateInquiry(raw: Record<string, unknown>): Validated<Inquiry, Field> {
  const inquiry: Inquiry = {
    name: str(raw.name),
    email: str(raw.email),
    company: str(raw.company),
    kind: oneOf(KINDS, raw.kind),
    message: str(raw.message),
  }
  const errors: FieldErrors = {}
  if (!inquiry.name) errors.name = 'Tell us who you are.'
  else if (inquiry.name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`
  if (!EMAIL.test(inquiry.email) || inquiry.email.length > LIMITS.email)
    errors.email = 'Enter an email we can reply to.'
  if (inquiry.company.length > LIMITS.company) errors.company = `Keep it under ${LIMITS.company} characters.`
  if (inquiry.message.length < LIMITS.messageMin)
    errors.message = `A sentence or two, at least ${LIMITS.messageMin} characters.`
  else if (inquiry.message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`
  return done(inquiry, errors)
}

/** The one-line summary a webhook shows for an inquiry. */
export const summariseInquiry = (i: Inquiry) =>
  `New inquiry from ${i.company ? `${i.name} (${i.company})` : i.name} <${i.email}>${i.kind ? ` · ${i.kind}` : ''}\n\n${i.message}`
