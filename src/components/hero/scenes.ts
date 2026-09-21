/**
 * Example deliverables shown in the hero's review workspace.
 *
 * Each scene is a real kind of work MultiAgency delivers. One line of the AI
 * draft is generic; the reviewer strikes it, comments, and a specific line
 * goes in. The copy inside the previews is illustrative, not the clients'
 * production copy.
 */

export type DraftLine = { tag: string; text: string }
export type EditedLine = { tag: string; keep?: string; draft: string; revised: string }
export type Line = DraftLine | EditedLine

export const isEdited = (line: Line): line is EditedLine => 'draft' in line

export type PreviewKind = 'storyboard' | 'checkout' | 'chat'

export interface Scene {
  id: string
  tab: { kind: string; client: string }
  title: string
  format: string
  specialist: string
  file: string
  lines: Line[]
  comment: string
  stamp: string
  preview: PreviewKind
}

export const scenes: Scene[] = [
  {
    id: 'video',
    tab: { kind: 'Video', client: 'IronClaw' },
    title: 'IronClaw 1.2 · release video',
    format: 'Script · 60s',
    specialist: 'KE',
    file: 'script.md',
    lines: [
      {
        tag: '00:00',
        keep: 'Meet IronClaw 1.2 —',
        draft: 'the revolutionary, game-changing AI agent you’ve been waiting for.',
        revised: 'your agent now works in group chats.',
      },
      { tag: '00:08', text: 'Cut to a live Telegram group. The agent answers a teammate.' },
      { tag: '00:21', text: 'It calls an MCP tool to check a staking balance, then replies.' },
      { tag: '00:40', text: 'Release alerts arrive on a schedule. No prompts needed.' },
      { tag: '00:55', text: 'IronClaw 1.2. Out now.' },
    ],
    comment: 'Show, don’t hype. Lead with what’s new.',
    stamp: 'Approved · to edit',
    preview: 'storyboard',
  },
  {
    id: 'product',
    tab: { kind: 'Product', client: 'Ping' },
    title: 'Ping · onramp checkout',
    format: 'Product copy + UI',
    specialist: 'SD',
    file: 'checkout.tsx',
    lines: [
      { tag: 'h1', draft: 'Unlock seamless cross-chain payment synergy', revised: 'Pay from any chain.' },
      { tag: 'sub', text: 'Send and receive payments across chains in one step.' },
      { tag: 'cta', text: 'Continue with 120 USDC' },
      { tag: 'note', text: 'Fees shown before you confirm.' },
    ],
    comment: 'Say what it does. Four words, max.',
    stamp: 'Approved · shipped',
    preview: 'checkout',
  },
  {
    id: 'bot',
    tab: { kind: 'Bot', client: 'NEAR Builders' },
    title: 'NEAR Builders · community bot',
    format: 'Telegram · reply',
    specialist: 'MA',
    file: 'reply-draft',
    lines: [
      { tag: 'user', text: 'How do I find people to build with?' },
      {
        tag: 'bot',
        draft: 'Great question! NEAR Builders offers a robust, vibrant ecosystem of synergistic opportunities.',
        revised: 'Open nearbuilders.org and browse open projects — each lists the skills it needs.',
      },
      { tag: 'bot', text: 'Want me to post your project there too?' },
    ],
    comment: 'Too chatty. Answer first.',
    stamp: 'Approved · live',
    preview: 'chat',
  },
]

/** The line under review in a scene (each scene has exactly one). */
export const editedLine = (scene: Scene): EditedLine => {
  const line = scene.lines.find(isEdited)
  if (!line) throw new Error(`Scene "${scene.id}" has no edited line`)
  return line
}
