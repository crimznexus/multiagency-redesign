import { ledgerSnapshot } from '~/data/ledger-snapshot'
import { fetchLedgerSummary, type LedgerSummary, RPC_PROVIDERS } from '~/lib/ledger'

export interface LedgerResult extends LedgerSummary {
  /** true when read from the chain; false when serving the snapshot */
  live: boolean
  fetchedAt: string
}

const TTL_MS = 5 * 60_000
const PROVIDER_TIMEOUT_MS = 4_000

let cache: { at: number; value: LedgerResult } | null = null

/**
 * Server-side read of the public ledger: tries each RPC provider in turn,
 * caches the result in memory, and never throws — the page always gets
 * figures, live or snapshot.
 */
export async function loadLedger(): Promise<LedgerResult> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value

  for (const rpc of RPC_PROVIDERS) {
    try {
      const summary = await fetchLedgerSummary(rpc, AbortSignal.timeout(PROVIDER_TIMEOUT_MS))
      const value = { ...summary, live: true, fetchedAt: new Date().toISOString() }
      cache = { at: Date.now(), value }
      return value
    } catch {
      // try the next provider
    }
  }

  // Keep serving the last live read if there was one; otherwise the snapshot.
  return cache?.value ?? { ...ledgerSnapshot, live: false, fetchedAt: new Date().toISOString() }
}
