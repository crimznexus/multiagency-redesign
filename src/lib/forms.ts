/**
 * What the site's forms (hire us, apply to join) share: input normalising,
 * the email rule, and the shape a validator returns. Runs in the browser and
 * on the server, so both apply exactly the same rules.
 */

export type FieldErrors<F extends string> = Partial<Record<F, string>>

export type Validated<T, F extends string> = { value: T } | { errors: FieldErrors<F> }

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** A trimmed string, or '' for anything that is not a string. */
export const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** One of `options`, or '' when the value is missing or not allowed. */
export const oneOf = <T extends string>(options: readonly T[], v: unknown): T | '' =>
  (options as readonly string[]).includes(str(v)) ? (str(v) as T) : ''

export const done = <T, F extends string>(value: T, errors: FieldErrors<F>): Validated<T, F> =>
  Object.keys(errors).length > 0 ? { errors } : { value }
