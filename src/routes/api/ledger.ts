import { createFileRoute } from '@tanstack/react-router'
import { loadLedger } from '~/server/ledger'

/**
 * GET /api/ledger — the public payment ledger, summarised.
 *
 * Always 200 (live figures or the snapshot, flagged by `live`), cached at the
 * CDN for 5 minutes so one upstream read serves every visitor.
 */
export const Route = createFileRoute('/api/ledger')({
  server: {
    handlers: {
      GET: async () =>
        Response.json(await loadLedger(), {
          headers: { 'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600' },
        }),
    },
  },
})
