import { useEffect, useState } from 'react'
import { ledgerSnapshot } from '~/data/ledger-snapshot'
import { fetchLedgerSummary, type LedgerSummary } from './ledger'

/**
 * The public payment ledger, live when the network allows it. Starts from the
 * build-time snapshot (so prerendered HTML already has real figures) and swaps
 * in fresh numbers after hydration. Failures keep the snapshot silently.
 */
export function useLedger(): LedgerSummary & { live: boolean } {
  const [state, setState] = useState({ ...ledgerSnapshot, live: false })

  useEffect(() => {
    const controller = new AbortController()
    fetchLedgerSummary(controller.signal)
      .then((summary) => setState({ ...summary, live: true }))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return state
}
