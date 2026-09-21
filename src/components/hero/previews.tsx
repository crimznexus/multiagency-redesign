import type { ReactNode } from 'react'
import type { Scene } from './scenes'
import { editedLine } from './scenes'
import { type Phase, reached } from './use-review-timeline'

interface PreviewProps {
  scene: Scene
  phase: Phase
}

function PreviewShell({ label, footer, children }: { label: string; footer: [string, string]; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-3.5 bg-surface p-5">
      <span className="label">{label}</span>
      {children}
      <div className="mt-auto flex justify-between font-mono text-micro text-graphite">
        <span>{footer[0]}</span>
        <span>{footer[1]}</span>
      </div>
    </div>
  )
}

/** Four storyboard frames, drawn in CSS. The first frame is flagged until approval. */
function Storyboard({ phase }: PreviewProps) {
  const flagged = !reached(phase, 'approved')
  const frame = 'relative aspect-[16/10] overflow-hidden rounded-md bg-screen'
  const tc = 'absolute bottom-1.5 left-2 font-mono text-[10px] text-screen-mute'
  return (
    <PreviewShell label="Storyboard · 4 frames" footer={['Motion design', '16:9 · VO']}>
      <div className="grid grid-cols-2 gap-2.5">
        <div
          className={`${frame} outline-2 outline-offset-2 transition-[outline-color] ${flagged ? 'outline-pencil' : 'outline-transparent'}`}
        >
          <span className="absolute top-[18%] left-1/3 aspect-square w-[34%] rounded-full border-2 border-paper" />
          <span className={tc}>00:00</span>
        </div>
        <div className={frame}>
          <span className="absolute inset-x-[18%] top-[22%] h-[10%] rounded-xs bg-paper shadow-[0_16px_0_-2px_#7E7A72,0_30px_0_-2px_#7E7A72]" />
          <span className={tc}>00:08</span>
        </div>
        <div className={frame}>
          <span className="absolute top-[18%] left-[12%] h-[44%] w-[44%] rounded-md border-2 border-paper" />
          <span className="absolute top-[34%] left-[48%] h-[40%] w-[40%] rounded-md border-2 border-pencil" />
          <span className={tc}>00:21</span>
        </div>
        <div className={frame}>
          <span className="absolute inset-x-[14%] top-[40%] h-[3px] bg-paper" />
          <span className="absolute top-[calc(40%-3.5px)] left-[60%] size-2.5 rounded-full bg-pencil" />
          <span className={tc}>00:40</span>
        </div>
      </div>
    </PreviewShell>
  )
}

function Checkout({ scene, phase }: PreviewProps) {
  const line = editedLine(scene)
  return (
    <PreviewShell label="Preview · checkout" footer={['Web · React', 'v2']}>
      <div className="grid gap-3 rounded-md border border-rule bg-card p-4 shadow-card">
        <p className="text-lg leading-tight font-semibold tracking-tight">
          {reached(phase, 'revised') ? line.revised : line.draft}
        </p>
        <div className="flex items-baseline justify-between rounded-md border border-rule px-3 py-2.5">
          <b className="text-[22px] font-semibold tracking-tight tabular-nums">120.00</b>
          <span className="font-mono text-xs text-graphite">USDC</span>
        </div>
        <div className="flex flex-wrap gap-1.5 font-mono text-micro">
          {['NEAR', 'Ethereum', 'Base', 'Solana'].map((c, i) => (
            <span
              key={c}
              className={`rounded-full border px-2 py-1.5 ${i === 0 ? 'border-ink text-ink' : 'border-rule text-graphite'}`}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="grid h-[38px] place-items-center rounded-md bg-ink text-sm font-medium text-paper">
          Continue
        </div>
      </div>
    </PreviewShell>
  )
}

function Chat({ scene, phase }: PreviewProps) {
  const line = editedLine(scene)
  const question = scene.lines[0]
  return (
    <PreviewShell label="Preview · Telegram" footer={['Bot · automation', 'reviewed']}>
      <div className="grid gap-2.5 text-[13.5px] leading-snug">
        <div className="max-w-[88%] justify-self-end rounded-[10px] rounded-br-[3px] bg-ink px-3 py-2 text-paper">
          {question && 'text' in question ? question.text : null}
        </div>
        <div className="max-w-[88%] rounded-[10px] rounded-bl-[3px] border border-rule bg-card px-3 py-2">
          <span className="mb-1 block font-mono text-[10.5px] text-graphite">NB Bot</span>
          {reached(phase, 'revised') ? (
            line.revised
          ) : (
            <span className="inline-flex gap-[3px]" role="img" aria-label="Typing">
              {[0, 1, 2].map((i) => (
                <i
                  key={i}
                  className="size-[5px] animate-pulse rounded-full bg-struck"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </span>
          )}
        </div>
      </div>
    </PreviewShell>
  )
}

export function Preview(props: PreviewProps) {
  switch (props.scene.preview) {
    case 'storyboard':
      return <Storyboard {...props} />
    case 'checkout':
      return <Checkout {...props} />
    case 'chat':
      return <Chat {...props} />
  }
}
