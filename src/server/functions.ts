import { createServerFn } from '@tanstack/react-start'
import { loadLedger } from './ledger'

/** Used by the home route's loader, so the prerendered HTML ships real figures. */
export const getLedger = createServerFn({ method: 'GET' }).handler(() => loadLedger())
