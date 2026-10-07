import { cn } from '@/lib/utils'

interface MetricListProps {
  metrics: string[]
  /** accessible name for the list; leave it out when a visible heading already names it */
  label?: string
  className?: string
}

export default function MetricList({ metrics, label, className }: MetricListProps) {
  return (
    <ul className={cn('grid grid-cols-1 gap-2 sm:grid-cols-2', className)} aria-label={label}>
      {metrics.map((metric) => (
        <li key={metric} className="flex items-start gap-2 text-sm text-text-primary">
          <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-metric" />
          {metric}
        </li>
      ))}
    </ul>
  )
}
