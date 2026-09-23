/**
 * Our work: the five projects multiagency.ai lists, in its order.
 * Descriptions come from each project's own site. Images are the live sites
 * as captured in September 2026, or, for the two without a public site, an
 * illustration in the site's own style (scripts/illustrations/).
 */

export interface Project {
  /** Anchor id, `#work-<id>` */
  id: string
  name: string
  /** One-word kind, shown as a label */
  kind: string
  description: string
  link?: { href: string; label: string }
  image: { name: string; alt: string }
}

export const projects: Project[] = [
  {
    id: 'ping',
    name: 'Ping',
    kind: 'Product',
    description:
      'A chain-abstracted onramp: buy, sell or pay with a card or Cash App and receive tokens on any chain, in one flow.',
    link: { href: 'https://onramp.pingpay.io', label: 'onramp.pingpay.io' },
    image: { name: 'ping', alt: 'Ping’s onramp: a buy, sell and pay widget converting USD to NEAR.' },
  },
  {
    id: 'city-nodes',
    name: 'City Nodes',
    kind: 'Product',
    description: 'NEAR validators tied to real places: each city, state or country runs a node people can stake to.',
    link: { href: 'https://citynode.app', label: 'citynode.app' },
    image: {
      name: 'city-nodes',
      alt: 'The City Nodes home page: “What are City Nodes?”, with the four steps of staking to a place.',
    },
  },
  {
    id: 'nearbuilders',
    name: 'NEAR Builders',
    kind: 'Platform',
    description:
      'An open network where builders find collaborators, discover open projects and ship community-owned products across NEAR.',
    link: { href: 'https://nearbuilders.org', label: 'nearbuilders.org' },
    image: {
      name: 'nearbuilders',
      alt: 'The NEAR Builders home page: “Build what’s next, together”, with builder and project counts.',
    },
  },
  {
    id: 'near-builders-social',
    name: 'NEAR Builders social',
    kind: 'Social',
    description: 'Ongoing social media management for NEAR Builders.',
    image: {
      name: 'near-builders-social',
      alt: 'Illustration: a week of posts, replies and scheduled drafts for NEAR Builders.',
    },
  },
  {
    id: 'near-builders-bot',
    name: 'NEAR Builders Bot',
    kind: 'Bots',
    description: 'An assistant for the NEAR Builders community.',
    image: {
      name: 'near-builders-bot',
      alt: 'Illustration: a chat with the NEAR Builders Bot suggesting open projects.',
    },
  },
]
