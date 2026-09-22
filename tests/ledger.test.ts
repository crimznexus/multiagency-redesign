import { describe, expect, it } from 'vitest'
import { type RawProposal, summarize } from '~/lib/ledger'

const ns = (iso: string) => `${BigInt(Date.parse(iso)) * 1_000_000n}`

const transfer = (id: number, to: string, iso: string, status: RawProposal['status'] = 'Approved'): RawProposal => ({
  id,
  status,
  submission_time: ns(iso),
  kind: { Transfer: { token_id: '', receiver_id: to, amount: '1000000000000000000000000' } },
})

describe('summarize', () => {
  it('counts only approved transfers', () => {
    const summary = summarize([
      transfer(1, 'a.near', '2026-06-15T00:00:00Z'),
      transfer(2, 'b.near', '2026-07-01T00:00:00Z', 'Rejected'),
      { id: 3, status: 'Approved', submission_time: ns('2026-07-02T00:00:00Z'), kind: { ChangePolicy: {} } },
      { id: 4, status: 'Failed', submission_time: ns('2026-07-03T00:00:00Z'), kind: { FunctionCall: {} } },
    ])
    expect(summary.payments).toBe(1)
  })

  it('counts each contributor once', () => {
    const summary = summarize([
      transfer(1, 'a.near', '2026-06-15T00:00:00Z'),
      transfer(2, 'a.near', '2026-06-20T00:00:00Z'),
      transfer(3, 'b.near', '2026-06-25T00:00:00Z'),
    ])
    expect(summary.payments).toBe(3)
    expect(summary.contributors).toBe(2)
  })

  it('reports the first payment date and the latest payments newest-first', () => {
    const summary = summarize(
      [
        transfer(2, 'b.near', '2026-07-01T00:00:00Z'),
        transfer(1, 'a.near', '2026-06-15T12:00:00Z'),
        transfer(3, 'c.near', '2026-08-01T00:00:00Z'),
      ],
      2,
    )
    expect(summary.since).toBe('2026-06-15T12:00:00.000Z')
    expect(summary.latest.map((p) => p.id)).toEqual([3, 2])
  })

  it('counts payments per month, oldest first', () => {
    const summary = summarize([
      transfer(3, 'a.near', '2026-08-02T00:00:00Z'),
      transfer(1, 'a.near', '2026-06-15T00:00:00Z'),
      transfer(2, 'b.near', '2026-08-01T00:00:00Z'),
      transfer(4, 'c.near', '2026-08-03T00:00:00Z', 'Rejected'),
    ])
    expect(summary.byMonth).toEqual([
      { month: '2026-06', count: 1 },
      { month: '2026-08', count: 2 },
    ])
  })

  it('handles an empty ledger', () => {
    expect(summarize([])).toEqual({ payments: 0, contributors: 0, since: null, byMonth: [], latest: [] })
  })
})
