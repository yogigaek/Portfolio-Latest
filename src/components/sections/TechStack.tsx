import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import useInView from '@/hooks/useInView'
import { skills } from '@/data'
import type { SkillCategory, SkillLevel } from '@/types'
import { cn } from '@/lib/utils'

const allCategories: Array<'All' | SkillCategory> = [
  'All',
  'Languages',
  'Backend & Frameworks',
  'Cloud & Infrastructure',
  'Databases',
  'Security & Auth',
  'Frontend',
  'DevOps & Tools',
  'Architecture & Design',
  'Engineering Quality',
]

const levelColors: Record<SkillLevel, string> = {
  Expert: 'bg-accent/10 border-accent/30 text-accent-hover',
  Advanced: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
  Proficient: 'bg-slate-500/10 border-slate-400/30 text-slate-400',
  Familiar: 'bg-surface-2 border-border text-text-muted',
}

const levelDotColors: Record<SkillLevel, string> = {
  Expert: 'bg-accent',
  Advanced: 'bg-violet-400',
  Proficient: 'bg-slate-400',
  Familiar: 'bg-text-muted',
}

export default function TechStack() {
  const [active, setActive] = useState<'All' | SkillCategory>('All')
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 })

  const filtered = active === 'All' ? skills : skills.filter((s) => s.category === active)

  return (
    <section id="skills" ref={ref} className="section-padding border-t border-border section-tinted">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Technical Expertise"
          title="Tech Stack"
          subtitle="Technologies I use to build production-grade systems."
        />

        {/* Category tabs with count */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {allCategories.map((cat) => {
            const count = cat === 'All'
              ? skills.length
              : skills.filter((s) => s.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                  active === cat
                    ? 'bg-accent/10 border-accent/30 text-accent-hover'
                    : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border-hover',
                )}
              >
                {cat}
                <span className={cn(
                  'text-xs rounded-full px-1.5 py-0.5 font-semibold min-w-[20px] text-center',
                  active === cat
                    ? 'bg-accent/20 text-accent-hover'
                    : 'bg-surface-2 text-text-muted',
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-colors duration-200 hover:brightness-110',
                  levelColors[skill.level],
                )}
              >
                <span className={cn('w-2 h-2 rounded-full flex-shrink-0', levelDotColors[skill.level])} />
                {skill.name}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mt-10"
        >
          {(['Expert', 'Advanced', 'Proficient', 'Familiar'] as SkillLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-2 text-xs text-text-muted">
              <span className={cn('w-2 h-2 rounded-full', levelDotColors[level])} />
              {level}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
