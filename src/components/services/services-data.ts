/**
 * What MultiAgency makes. The four areas are inferred from its projects and
 * payouts; the AI / people split is how the agency's review model applies to
 * each (every deliverable is drafted fast and signed off by a named person).
 */

export interface Service {
  id: string
  name: string
  summary: string
  aiDrafts: string
  peopleOwn: string
  /** Anchors into Selected work */
  proof: { label: string; href: string }[]
}

export const services: Service[] = [
  {
    id: 'product',
    name: 'Product & web',
    summary: 'Websites, web apps and product features, designed, built and shipped.',
    aiDrafts: 'Scaffolds, component variants, test cases, first-pass copy.',
    peopleOwn: 'Architecture, UX decisions, code review, the launch.',
    proof: [
      { label: 'Ping', href: '#work-ping' },
      { label: 'NEAR Builders', href: '#work-nearbuilders' },
      { label: 'City Nodes', href: '#work-city-nodes' },
    ],
  },
  {
    id: 'bots',
    name: 'Bots & automation',
    summary: 'Agents and bots that do real work in Telegram, Discord and your own tools.',
    aiDrafts: 'Conversation flows, tool integrations, reply drafts.',
    peopleOwn: 'What the bot may do, its tone, testing with real users.',
    proof: [
      { label: 'NEAR Builders Bot', href: '#work-near-builders-bot' },
      { label: 'IronClaw walkthroughs', href: '#work-legion' },
    ],
  },
  {
    id: 'content',
    name: 'Content & video',
    summary: 'Explainers, launch videos and motion design, briefed, reviewed and delivered on schedule.',
    aiDrafts: 'Scripts, storyboards, caption passes.',
    peopleOwn: 'Direction, the edit, sign-off against the brief.',
    proof: [{ label: 'Legion Creator Programme', href: '#work-legion' }],
  },
  {
    id: 'social',
    name: 'Social & community',
    summary: 'A consistent, on-brand presence, run by people who know your community.',
    aiDrafts: 'Post calendars, first drafts, trend digests.',
    peopleOwn: 'The voice, what gets posted, replies to real people.',
    proof: [{ label: 'NEAR Builders social', href: '#work-near-builders-social' }],
  },
]
