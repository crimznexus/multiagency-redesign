/**
 * Selected work. Descriptions come from each project's own site; the Legion
 * briefs come from the agency's public payment record (one approved payout
 * per accepted brief). MultiAgency's exact role per project isn't public, so
 * reviewer notes stay factual.
 */

export interface Brief {
  id: string
  title: string
  format: string
}

export type Visual = { kind: 'screenshot'; image: string; alt: string } | { kind: 'briefs'; briefs: Brief[] }

export interface FeaturedProject {
  id: string
  name: string
  headline: string
  description: string
  tags: string[]
  link?: { href: string; label: string }
  note: string
  visual: Visual
  caption: string
}

export interface OtherProject {
  name: string
  description: string
  tags: string[]
  link?: { href: string; label: string }
}

export const featured: FeaturedProject[] = [
  {
    id: 'ping',
    name: 'Ping',
    headline: 'Payments from any chain',
    description:
      'A chain-abstracted onramp: buy, sell or pay with a card or Cash App and receive tokens on any chain, in one flow.',
    tags: ['Product', 'Web', 'Payments'],
    link: { href: 'https://onramp.pingpay.io', label: 'onramp.pingpay.io' },
    note: 'Onramp flow live.',
    visual: {
      kind: 'screenshot',
      image: 'ping',
      alt: 'Ping’s onramp: a buy, sell and pay widget converting USD to NEAR.',
    },
    caption: 'Live site · captured Sep 2026',
  },
  {
    id: 'nearbuilders',
    name: 'NEAR Builders',
    headline: 'Build what’s next, together',
    description:
      'An open network where builders find collaborators, discover open projects and ship community-owned products across NEAR.',
    tags: ['Platform', 'Web', 'Community'],
    link: { href: 'https://nearbuilders.org', label: 'nearbuilders.org' },
    note: 'Network live and growing.',
    visual: {
      kind: 'screenshot',
      image: 'nearbuilders',
      alt: 'The NEAR Builders home page: “Build what’s next, together”, with builder and project counts.',
    },
    caption: 'Live site · captured Sep 2026',
  },
  {
    id: 'legion',
    name: 'Legion Creator Programme',
    headline: 'Explainers and release videos',
    description:
      'Nine commissioned videos for NEAR AI and IronClaw: cinematic explainers, motion-design release videos and real bot walkthroughs. Each had a written brief, a named reviewer, and payment on acceptance.',
    tags: ['Content', 'Video', 'Motion'],
    note: 'Nine of nine briefs accepted.',
    visual: {
      kind: 'briefs',
      briefs: [
        { id: 'T-001', title: 'IronClaw explainer', format: 'Cinematic · mascot-led' },
        { id: 'T-002', title: 'NEAR AI argument', format: 'On-camera cut' },
        { id: 'T-003', title: 'NEAR AI argument', format: 'On-camera · 2nd treatment' },
        { id: 'T-004', title: 'NEAR AI argument', format: 'Visual cut · captions' },
        { id: 'T-005', title: 'IronClaw Telegram agent', format: 'Walkthrough · real bot' },
        { id: 'T-006', title: 'IronClaw release alerts', format: 'Walkthrough' },
        { id: 'T-007', title: 'IronClaw 1.2 release', format: 'Motion design · VO' },
        { id: 'T-008', title: 'IronClaw × Pikespeak', format: 'Transaction trace' },
        { id: 'T-009', title: 'NEAR AI argument', format: 'Cinematic montage' },
      ],
    },
    caption: 'From the public payment record',
  },
]

export const others: OtherProject[] = [
  {
    name: 'City Nodes',
    description: 'NEAR validators tied to real places: each city, state or country runs a node people can stake to.',
    tags: ['Product', 'Web3'],
    link: { href: 'https://citynode.app', label: 'citynode.app' },
  },
  {
    name: 'NEAR Builders Bot',
    description: 'An assistant for the NEAR Builders community.',
    tags: ['Bots', 'Automation'],
  },
  {
    name: 'NEAR Builders social',
    description: 'Ongoing social media management for NEAR Builders.',
    tags: ['Social', 'Content'],
  },
]
