import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import { skills } from '@/data'
import type { SkillCategory } from '@/types'

// reading order down each column, so the stack a backend recruiter scans for comes first
const CATEGORY_ORDER: SkillCategory[] = [
  'Backend',
  'Languages',
  'Cloud & DevOps',
  'Databases',
  'Architecture',
  'Messaging & Integration',
  'Security & Auth',
  'Testing & Quality',
  'Observability & Tools',
  'Frontend',
]

export default function TechStack() {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((s) => s.category === category),
  })).filter((g) => g.items.length > 0)

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeader
          id="stack-title"
          index="05"
          eyebrow="Stack"
          title="Technologies used in production work"
          subtitle="Grouped by engineering purpose."
        />

        <Reveal>
          {/* balanced columns: a grid leaves a ragged hole wherever the last row runs out of groups */}
          <div className="columns-1 gap-x-10 sm:columns-2 lg:columns-3">
            {groups.map(({ category, items }) => (
              <section key={category} aria-label={category} className="mb-9 break-inside-avoid">
                <h3 className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-hover">
                  {category}
                  <span aria-hidden="true" className="h-px flex-1 bg-border" />
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <li
                      key={skill.name}
                      className="rounded-lg border border-border bg-surface px-2.5 py-1.5 font-mono text-[12.5px] text-text-secondary transition-colors duration-200 hover:border-border-hover hover:text-text-primary"
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
