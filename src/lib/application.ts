/**
 * Applications to join the network: the fields and the one validator shared
 * by the form (in the browser) and /api/apply (on the server).
 */
import { done, EMAIL, type FieldErrors as Errors, oneOf, str, type Validated } from './forms'

export const SKILLS = ['Product', 'Bots', 'Video', 'Social', 'Other'] as const
export type Skill = (typeof SKILLS)[number]

export interface Application {
  name: string
  email: string
  skill: Skill | ''
  near: string
  link: string
  message: string
}

export type Field = keyof Application
export type FieldErrors = Errors<Field>

export const LIMITS = { name: 100, email: 200, near: 64, link: 300, message: 4000, messageMin: 20 } as const

/** A named NEAR account (alice.near, team.tg) or a 64-hex implicit account. */
const NEAR_ACCOUNT = /^(?:[a-f0-9]{64}|(?:(?:[a-z\d]+[-_])*[a-z\d]+\.)+(?:[a-z\d]+[-_])*[a-z\d]+)$/
const URL_LIKE = /^https?:\/\/[^\s.]+\.[^\s]+$/i

/** Normalises untrusted input; returns the application or the errors to show beside each field. */
export function validateApplication(raw: Record<string, unknown>): Validated<Application, Field> {
  const near = str(raw.near).toLowerCase()
  let link = str(raw.link)
  if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`
  const app: Application = {
    name: str(raw.name),
    email: str(raw.email),
    skill: oneOf(SKILLS, raw.skill),
    near,
    link,
    message: str(raw.message),
  }
  const errors: FieldErrors = {}
  if (!app.name) errors.name = 'Tell us who you are.'
  else if (app.name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`
  if (!EMAIL.test(app.email) || app.email.length > LIMITS.email) errors.email = 'Enter an email we can reply to.'
  if (app.near && (app.near.length < 2 || app.near.length > LIMITS.near || !NEAR_ACCOUNT.test(app.near)))
    errors.near = 'Use a NEAR account like name.near, or leave it empty.'
  if (app.link && (app.link.length > LIMITS.link || !URL_LIKE.test(app.link)))
    errors.link = 'Use a full link like github.com/you, or leave it empty.'
  if (app.message.length < LIMITS.messageMin)
    errors.message = `A sentence or two, at least ${LIMITS.messageMin} characters.`
  else if (app.message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`
  return done(app, errors)
}

/** The one-line summary a webhook shows for an application. */
export const summariseApplication = (a: Application) =>
  `New application from ${a.name} <${a.email}>${a.skill ? ` · ${a.skill}` : ''}${a.near ? ` · ${a.near}` : ''}${a.link ? `\n${a.link}` : ''}\n\n${a.message}`
