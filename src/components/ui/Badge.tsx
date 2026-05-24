import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'accent' | 'success' | 'danger' | 'warning' | 'cyan' | 'outline'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-2 border-border text-text-secondary',
  accent: 'bg-accent/10 border-accent/30 text-accent-hover',
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  danger: 'bg-red-500/10 border-red-500/30 text-red-400',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  outline: 'bg-transparent border-border text-text-secondary',
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
