import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import { outcomes } from '@/data'

export default function Outcomes() {
  return (
    <section id="outcomes" aria-labelledby="outcomes-title" className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeader
          id="outcomes-title"
          index="01"
          eyebrow="Facts"
          title="Selected outcomes from production work"
        />

        <Reveal>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((outcome) => (
              <li
                key={outcome.id}
                className="flex flex-col bg-surface p-7 transition-colors duration-300 hover:bg-surface-2 md:p-8"
              >
                <span className="font-mono text-4xl font-semibold tracking-tight text-metric md:text-[2.75rem]">
                  {outcome.value}
                </span>
                <span className="mt-4 font-display text-base font-semibold text-text-primary">{outcome.label}</span>
                <span className="mt-1.5 text-sm leading-relaxed text-text-secondary">{outcome.note}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
