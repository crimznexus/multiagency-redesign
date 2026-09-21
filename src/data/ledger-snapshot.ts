import type { LedgerSummary } from '~/lib/ledger'

/**
 * Build-time fallback so the prerendered page always shows real figures,
 * even before (or without) the live fetch. Taken from the public ledger on
 * 2026-09-21; the live fetch replaces it on load.
 */
export const ledgerSnapshot: LedgerSummary = {
  payments: 41,
  contributors: 23,
  since: new Date('2026-06-15T13:13:44Z'),
  latest: [],
}
