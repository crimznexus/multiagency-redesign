import type { Brief } from './work-data'

/** A light browser frame around a live-site screenshot (16:10, matching the capture). */
export function BrowserFrame({ image, alt, url }: { image: string; alt: string; url?: string }) {
  const src = (w: number, ext: string) => `/work/${image}-${w}.${ext}`
  const sizes = '(min-width: 1024px) 700px, 100vw'
  return (
    <div className="overflow-hidden rounded-lg border border-rule bg-card shadow-window">
      <div className="flex items-center gap-3 border-b border-rule-soft bg-surface px-3.5 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-full border border-rule" />
          <span className="size-2 rounded-full border border-rule" />
        </span>
        {url && (
          <span className="mx-auto truncate rounded-full border border-rule-soft bg-card px-3 py-1 font-mono text-micro text-graphite">
            {url}
          </span>
        )}
      </div>
      <picture>
        <source type="image/avif" srcSet={`${src(640, 'avif')} 640w, ${src(1200, 'avif')} 1200w`} sizes={sizes} />
        <source type="image/webp" srcSet={`${src(640, 'webp')} 640w, ${src(1200, 'webp')} 1200w`} sizes={sizes} />
        <img
          src={src(1200, 'webp')}
          alt={alt}
          width={1200}
          height={750}
          loading="lazy"
          decoding="async"
          className="block aspect-[16/10] h-auto w-full"
        />
      </picture>
    </div>
  )
}

/** The Legion programme's briefs, as they appear in the payment record: every one accepted. */
export function BriefLedger({ briefs }: { briefs: Brief[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-rule bg-card shadow-window">
      <div className="flex items-center justify-between gap-3 border-b border-rule-soft bg-surface px-4 py-3">
        <span className="truncate text-sm font-semibold tracking-tight">
          Legion Creator Programme<span className="hidden sm:inline"> · briefs</span>
        </span>
        <span className="font-mono text-micro whitespace-nowrap text-graphite">
          {briefs.length} of {briefs.length} accepted
        </span>
      </div>
      <table className="w-full border-collapse text-left text-[13.5px]">
        <caption className="sr-only">Commissioned video briefs and their review status</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Brief</th>
            <th scope="col">Video</th>
            <th scope="col">Format</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {briefs.map((b) => (
            <tr key={b.id} className="border-b border-rule-soft last:border-b-0">
              <td className="py-2.5 pr-3 pl-4 font-mono text-micro text-struck">{b.id}</td>
              <td className="py-2.5 pr-3 font-medium [overflow-wrap:anywhere]">{b.title}</td>
              <td className="hidden py-2.5 pr-3 text-graphite sm:table-cell">{b.format}</td>
              <td className="py-2.5 pr-4 text-right">
                <span className="inline-flex items-center gap-1.5 font-mono text-micro whitespace-nowrap text-pencil-deep">
                  <svg viewBox="0 0 14 14" className="size-3" aria-hidden="true">
                    <path d="M2 7.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  Accepted
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
