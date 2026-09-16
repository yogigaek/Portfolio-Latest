interface SectionHeaderProps {
  index: string
  eyebrow: string
  title: string
  subtitle?: string
  id?: string
  children?: React.ReactNode
}

export default function SectionHeader({ index, eyebrow, title, subtitle, id, children }: SectionHeaderProps) {
  return (
    <header className="mb-10 md:mb-14 max-w-3xl">
      <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent-hover mb-4">
        <span>
          {index} <span aria-hidden="true">—</span> {eyebrow}
        </span>
        <span aria-hidden="true" className="h-px w-16 sm:w-40 bg-gradient-to-r from-accent/40 to-transparent" />
      </p>
      <h2 id={id} className="font-display text-3xl md:text-[2.6rem] md:leading-[1.15] font-bold text-text-primary tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-text-secondary text-base md:text-lg leading-relaxed">{subtitle}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </header>
  )
}
