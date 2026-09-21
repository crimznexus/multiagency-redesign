import { useEffect, useState } from 'react'
import type { LedgerResult } from '~/server/ledger'

/**
 * Ledger figures for the page. Starts from what the route loader baked into
 * the HTML at build time, then refreshes from our own `/api/ledger` (same
 * origin, CDN-cached) after hydration. Only live results replace what's shown.
 */
export function useLedger(initial: LedgerResult): LedgerResult {
  const [ledger, setLedger] = useState(initial)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/ledger', { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<LedgerResult>) : null))
      .then((fresh) => fresh?.live && setLedger(fresh))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return ledger
}
