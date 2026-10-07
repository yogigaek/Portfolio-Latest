import { cn } from '@/lib/utils'

interface ArchitecturePanelProps {
  id: string
  label: string
  before?: string[]
  className?: string
}

export default function ArchitecturePanel({ id, label, before, className }: ArchitecturePanelProps) {
  const segments = label.split('→').map((s) => s.trim())
  const [lastNode, ...extras] = segments[segments.length - 1].split('·').map((s) => s.trim())
  const nodes = [...segments.slice(0, -1), lastNode]

  return (
    <div className={cn('flex flex-col bg-term-bg', className)}>
      <div aria-hidden="true" className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 font-mono text-[11px] text-term-muted">{id}</span>
      </div>
      <div className="flex flex-1 flex-col px-5 py-7 font-mono text-[12px] leading-[1.9] text-term-fg md:px-7 lg:justify-center lg:py-9">
        <p aria-hidden="true">
          <span className="text-term-muted">$</span> describe --architecture
        </p>
        <p className="sr-only">
          {before ? `Before: ${before.join(', ')}. After: ${label}` : `Architecture: ${label}`}
        </p>
        {before && (
          <>
            <p aria-hidden="true" className="mt-2 text-term-muted">
              # before
            </p>
            <ul aria-hidden="true">
              {before.map((node, i) => (
                <li key={`${node}-${i}`} className="flex gap-3">
                  <span className="w-3 text-center text-term-muted">·</span>
                  <span className="text-term-muted">{node}</span>
                </li>
              ))}
            </ul>
            <p aria-hidden="true" className="mt-2 text-term-muted">
              # after
            </p>
          </>
        )}
        <ol aria-hidden="true" className={before ? undefined : 'mt-2'}>
          {nodes.map((node, i) => (
            <li key={`${node}-${i}`} className="flex gap-3">
              <span className="w-3 text-center text-term-key">{i === 0 ? '▸' : '↓'}</span>
              <span className="text-term-string">{node}</span>
            </li>
          ))}
        </ol>
        {extras.length > 0 && (
          <p aria-hidden="true" className="mt-2">
            <span className="text-term-muted">with</span> <span className="text-term-metric">{extras.join(' · ')}</span>
          </p>
        )}
        <p aria-hidden="true" className="mt-2">
          <span className="text-term-muted">status</span> <span className="text-term-ok">private · under NDA</span>
        </p>
      </div>
    </div>
  )
}
