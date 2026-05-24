interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 md:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-accent-hover mb-4">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
