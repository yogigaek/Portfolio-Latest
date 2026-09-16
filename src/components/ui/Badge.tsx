import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'danger' | 'outline'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-2 border-border text-text-secondary',
  success: 'bg-success/10 border-success/30 text-success',
  danger: 'bg-danger/10 border-danger/30 text-danger',
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
