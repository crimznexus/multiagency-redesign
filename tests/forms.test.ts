import { describe, expect, it } from 'vitest'
import { validateApplication } from '~/lib/application'
import { validateInquiry } from '~/lib/inquiry'

const base = { name: 'Ada', email: 'ada@example.com', message: 'Motion design for launches, ten years of it.' }

describe('validateApplication', () => {
  it('accepts the minimum and trims', () => {
    const r = validateApplication({ ...base, name: '  Ada  ', skill: 'Video' })
    expect(r).toEqual({ value: { ...base, skill: 'Video', near: '', link: '' } })
  })

  it.each(['alice.near', 'team-1.tg', 'a_b.c.near', 'f'.repeat(64)])('accepts the NEAR account %s', (near) => {
    expect('value' in validateApplication({ ...base, near })).toBe(true)
  })

  it.each(['alice', 'Alice .near', '-a.near', 'a..near', 'x'])('rejects the NEAR account %s', (near) => {
    const r = validateApplication({ ...base, near })
    expect('errors' in r && r.errors.near).toBeTruthy()
  })

  it('lower-cases the account and adds a scheme to a bare link', () => {
    const r = validateApplication({ ...base, near: 'Alice.NEAR', link: 'github.com/ada' })
    expect('value' in r && r.value).toMatchObject({ near: 'alice.near', link: 'https://github.com/ada' })
  })

  it('rejects a link that is not a link', () => {
    const r = validateApplication({ ...base, link: 'my portfolio' })
    expect('errors' in r && r.errors.link).toBeTruthy()
  })

  it('drops a skill that is not offered', () => {
    const r = validateApplication({ ...base, skill: 'Hacking' })
    expect('value' in r && r.value.skill).toBe('')
  })

  it('reports every missing required field', () => {
    const r = validateApplication({})
    expect('errors' in r && Object.keys(r.errors).sort()).toEqual(['email', 'message', 'name'])
  })
})

describe('validateInquiry', () => {
  it('accepts a brief and keeps the company optional', () => {
    const r = validateInquiry({ ...base, kind: 'Product' })
    expect(r).toEqual({ value: { ...base, company: '', kind: 'Product' } })
  })

  it('needs a real message', () => {
    const r = validateInquiry({ ...base, message: 'hi' })
    expect('errors' in r && r.errors.message).toBeTruthy()
  })
})
