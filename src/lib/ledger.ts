/**
 * MultiAgency pays contributors through proposals on a public on-chain
 * treasury. This module reads that record from a NEAR RPC endpoint and
 * reduces it to the few figures the landing page shows. Amounts are kept in
 * the data, but the page shows counts only.
 *
 * Runs on the server only (see `src/server/ledger.ts`): public RPCs rate-limit
 * aggressively and their 429s carry no CORS headers, so browsers never call
 * them directly.
 */

export const TREASURY_ACCOUNT = 'multiagency.sputnik-dao.near'

/** Tried in order. The official endpoint is last: it rate-limits hardest. */
export const RPC_PROVIDERS = [
  'https://free.rpc.fastnear.com',
  'https://rpc.mainnet.fastnear.com',
  'https://rpc.mainnet.near.org',
] as const

type ProposalStatus = 'Approved' | 'Rejected' | 'InProgress' | 'Removed' | 'Expired' | 'Moved' | 'Failed'

type TransferKind = { Transfer: { token_id: string; receiver_id: string; amount: string } }

export interface RawProposal {
  id: number
  status: ProposalStatus
  submission_time: string // nanoseconds since epoch, as a string
  kind: TransferKind | Record<string, unknown> | string
}

export interface Payment {
  id: number
  recipient: string
  /** yoctoNEAR, kept as a string to avoid precision loss */
  amount: string
  /** ISO 8601 */
  paidAt: string
}

export interface LedgerSummary {
  payments: number
  contributors: number
  /** ISO 8601 date of the first payment */
  since: string | null
  latest: Payment[]
}

const isTransfer = (kind: RawProposal['kind']): kind is TransferKind =>
  typeof kind === 'object' && kind !== null && 'Transfer' in kind

/** Pure: approved transfers → the figures shown on the page. */
export function summarize(proposals: RawProposal[], latestCount = 5): LedgerSummary {
  const payments: Payment[] = proposals
    .flatMap((p) =>
      p.status === 'Approved' && isTransfer(p.kind)
        ? [
            {
              id: p.id,
              recipient: p.kind.Transfer.receiver_id,
              amount: p.kind.Transfer.amount,
              paidAt: new Date(Number(BigInt(p.submission_time) / 1_000_000n)).toISOString(),
            },
          ]
        : [],
    )
    .sort((a, b) => b.paidAt.localeCompare(a.paidAt))

  return {
    payments: payments.length,
    contributors: new Set(payments.map((p) => p.recipient)).size,
    since: payments.at(-1)?.paidAt ?? null,
    latest: payments.slice(0, latestCount),
  }
}

async function view<T>(rpcUrl: string, method: string, args: object, signal?: AbortSignal): Promise<T> {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    signal,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: method,
      method: 'query',
      params: {
        request_type: 'call_function',
        finality: 'final',
        account_id: TREASURY_ACCOUNT,
        method_name: method,
        args_base64: btoa(JSON.stringify(args)),
      },
    }),
  })
  if (!res.ok) throw new Error(`RPC ${method} failed: ${res.status}`)
  const body = (await res.json()) as { result?: { result: number[] }; error?: unknown }
  if (!body.result) throw new Error(`RPC ${method} returned no result`)
  return JSON.parse(new TextDecoder().decode(new Uint8Array(body.result.result))) as T
}

/** Fetch every proposal (paged) from one RPC endpoint and summarize. */
export async function fetchLedgerSummary(rpcUrl: string, signal?: AbortSignal): Promise<LedgerSummary> {
  const total = await view<number>(rpcUrl, 'get_last_proposal_id', {}, signal)
  const pageSize = 50
  const pages = await Promise.all(
    Array.from({ length: Math.ceil(total / pageSize) }, (_, i) =>
      view<RawProposal[]>(rpcUrl, 'get_proposals', { from_index: i * pageSize, limit: pageSize }, signal),
    ),
  )
  return summarize(pages.flat())
}
