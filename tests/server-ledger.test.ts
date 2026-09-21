import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RPC_PROVIDERS } from '~/lib/ledger'

const encode = (value: unknown) => ({ result: { result: [...new TextEncoder().encode(JSON.stringify(value))] } })

const proposal = {
  id: 0,
  status: 'Approved',
  submission_time: `${BigInt(Date.parse('2026-06-15T00:00:00Z')) * 1_000_000n}`,
  kind: { Transfer: { token_id: '', receiver_id: 'a.near', amount: '1' } },
}

/** A fake RPC: `down` providers answer 429, the rest serve one approved transfer. */
function fakeRpc(down: string[]) {
  return vi.fn(async (url: string, init: RequestInit) => {
    if (down.includes(url)) return new Response('rate limited', { status: 429 })
    const method = JSON.parse(String(init.body)).params.method_name
    return Response.json(encode(method === 'get_last_proposal_id' ? 1 : [proposal]))
  })
}

// loadLedger keeps an in-memory cache, so each test gets a fresh module.
const freshLoad = async () => (await import('~/server/ledger')).loadLedger

beforeEach(() => vi.resetModules())
afterEach(() => vi.unstubAllGlobals())

describe('loadLedger', () => {
  it('falls through rate-limited providers to one that answers', async () => {
    const fetch = fakeRpc([RPC_PROVIDERS[0]])
    vi.stubGlobal('fetch', fetch)
    const ledger = await (await freshLoad())()
    expect(ledger).toMatchObject({ live: true, payments: 1, contributors: 1 })
    expect(fetch.mock.calls.some(([url]) => url === RPC_PROVIDERS[1])).toBe(true)
  })

  it('serves the snapshot, flagged not-live, when every provider fails', async () => {
    vi.stubGlobal('fetch', fakeRpc([...RPC_PROVIDERS]))
    const ledger = await (await freshLoad())()
    expect(ledger.live).toBe(false)
    expect(ledger.payments).toBeGreaterThan(0)
  })

  it('caches a live read instead of hitting the RPC on every request', async () => {
    const fetch = fakeRpc([])
    vi.stubGlobal('fetch', fetch)
    const load = await freshLoad()
    await load()
    const calls = fetch.mock.calls.length
    await load()
    expect(fetch.mock.calls.length).toBe(calls)
  })
})
