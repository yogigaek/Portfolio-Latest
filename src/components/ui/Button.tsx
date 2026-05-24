import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  target?: string
  rel?: string
  download?: string | boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-deep hover:bg-accent text-white border border-accent-deep hover:border-accent shadow-lg shadow-accent/20',
  secondary:
    'bg-transparent hover:bg-accent/10 text-text-primary border border-border hover:border-accent/40',
  ghost: 'bg-transparent hover:bg-white/5 text-text-secondary hover:text-text-primary border border-transparent',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  loading = false,
  disabled = false,
  type = 'button',
  className,
  target,
  rel,
  download,
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer select-none',
    variantStyles[variant],
    sizeStyles[size],
    (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  )

  if (href) {
    return (
      <a
        href={href}
        className={baseStyles}
        target={target}
        rel={rel}
        download={download}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseStyles}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Sending...
        </>
      ) : (
        children
      )}
    </button>
  )
}
