import { useEffect, useRef, useState } from 'react'
import { REGISTER_URL } from './SiteHeader'
import { Check, Copy } from './ui/icons'

const COMMAND = 'bunx everything-dev init'

/** What the template gives you, in the order the dashboard presents it. */
const issue = [
  { name: 'Website', detail: 'Landing, work, contact' },
  { name: 'Treasury', detail: 'Payouts, permissions, policies' },
  { name: 'Projects', detail: 'NEARN listings, live' },
  { name: 'Dashboard', detail: 'Applications, contributors, billing' },
]

export function AgencyTemplate() {
  return (
    <section id="template" aria-labelledby="template-title" className="scroll-mt-16">
      <div className="page grid12 py-section">
        <div className="lg:col-span-5">
          <p className="type-label mb-5 text-muted">Agency template</p>
          <h2 id="template-title" className="type-h2">
            Launch your own agency.
          </h2>
          <p className="mt-6 max-w-[48ch] text-[17px] leading-relaxed text-muted">
            The blueprint behind this site, deployed to your own DAO. One command, your business.
          </p>
          <div className="mt-8">
            <a href={REGISTER_URL} className="btn btn-ghost">
              Register interest
            </a>
          </div>
        </div>

        <div className="mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0">
          <CommandLine />
          <dl className="mt-8 grid gap-x-6 sm:grid-cols-2">
            {issue.map((i) => (
              <div key={i.name} className="border-t border-rule py-4">
                <dt className="text-[17px] font-medium">{i.name}</dt>
                <dd className="text-[15px] text-muted">{i.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function CommandLine() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked (insecure context, or the user said no): the command is on screen to select.
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 bg-ink px-5 py-4 text-bg">
      <code className="font-mono text-[15px] sm:text-[17px]">
        <span aria-hidden="true" className="pr-2.5 opacity-55">
          $
        </span>
        {COMMAND}
      </code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 border border-bg px-3 text-[13px] font-medium active:translate-y-px"
      >
        {copied ? <Check /> : <Copy />}
        {copied ? 'Copied' : 'Copy'}
        <span className="sr-only"> the install command</span>
      </button>
    </div>
  )
}
