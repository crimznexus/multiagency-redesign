import { createFileRoute } from '@tanstack/react-router'
import { ledgerSnapshot } from '~/data/ledger-snapshot'

export const Route = createFileRoute('/')({
  component: Home,
})

// Placeholder: proves tokens, fonts and the grid end-to-end before the real
// sections are built.
function Home() {
  return (
    <main className="page page-grid py-24">
      <p className="label col-span-12 border-b border-rule pb-4">Foundation · v0.1</p>
      <h1 className="col-span-12 mt-10 text-display font-semibold md:col-span-9">
        We draft with AI and ship with people.
      </h1>
      <aside className="col-span-12 mt-6 border-l-[1.5px] border-pencil pl-4 md:col-span-3 md:col-start-10 md:mt-12">
        <span className="font-mono text-label font-medium text-pencil-deep">1 · Edit</span>
        <p className="mt-2 font-note text-note text-pencil-deep italic">“Too generic. Say what we actually do.”</p>
      </aside>
      <p className="col-span-12 mt-10 max-w-[58ch] text-lede text-graphite md:col-span-7">
        {ledgerSnapshot.payments} payments to {ledgerSnapshot.contributors} contributors, all on the public record.
      </p>
    </main>
  )
}
