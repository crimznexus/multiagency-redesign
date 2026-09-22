import type { LedgerSummary } from '~/lib/ledger'

/**
 * Last-resort fallback, used only if every RPC provider is unreachable at
 * build time and at request time. Taken from the public ledger on 2026-09-21.
 */
export const ledgerSnapshot: LedgerSummary = {
  payments: 41,
  contributors: 23,
  since: '2026-06-15T13:13:44.000Z',
  byMonth: [
    { month: '2026-06', count: 3 },
    { month: '2026-07', count: 8 },
    { month: '2026-08', count: 17 },
    { month: '2026-09', count: 13 },
  ],
  latest: [],
}
