import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, Clock } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import Badge from '@/components/ui/Badge'
import useInView from '@/hooks/useInView'
import { workExperiences, yearsOfExperience } from '@/data'

export default function WorkExperience() {
  return (
    <section id="experience" className="section-padding border-t border-border section-tinted">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Career History"
          title="Work Experience"
          subtitle={`${yearsOfExperience} years building enterprise systems — from a healthcare platform to financial APIs at scale.`}
        />

        <div className="relative">
          {/* Timeline vertical line (desktop) */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-8">
            {workExperiences.map((job, index) => (
              <ExperienceCard key={job.id} job={job} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function getDuration(start: string, end: string): string {
  const parseDate = (s: string) => {
    if (s === 'Present') return new Date()
    const [mon, yr] = s.split(' ')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return new Date(parseInt(yr), months.indexOf(mon))
  }
  const from = parseDate(start)
  const to = parseDate(end)
  const totalMonths = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  const yrs = Math.floor(totalMonths / 12)
  const mos = totalMonths % 12
  if (yrs === 0) return `${mos} mo`
  if (mos === 0) return `${yrs} yr`
  return `${yrs} yr ${mos} mo`
}

function ExperienceCard({
  job,
  index,
}: {
  job: (typeof workExperiences)[number]
  index: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative md:pl-20"
    >
      {/* Timeline dot — must align with the line at left-8 */}
      <div className="absolute left-8 top-8 -translate-x-1/2 hidden md:flex items-center justify-center">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            job.current
              ? 'border-accent bg-accent/20'
              : 'border-border bg-surface'
          }`}
        >
          {job.current && (
            <span className="w-2 h-2 rounded-full bg-accent block" />
          )}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 hover:border-border-hover transition-colors duration-300">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: job.accentColor + '20', border: `1px solid ${job.accentColor}40` }}
            >
              <span style={{ color: job.accentColor }}>{job.logoInitials}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-display text-lg md:text-xl font-bold text-text-primary">
                  {job.role}
                </h3>
                {job.current && (
                  <Badge variant="success">Current</Badge>
                )}
                <Badge variant="default">{job.type}</Badge>
              </div>
              <p className="text-text-secondary font-medium">{job.company}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:text-right text-sm text-text-muted flex-shrink-0">
            <span className="flex items-center gap-1.5 md:justify-end">
              <Calendar size={13} />
              {job.period}
            </span>
            <span className="flex items-center gap-1.5 md:justify-end">
              <Clock size={13} />
              <span className="font-medium text-text-secondary">
                {getDuration(job.periodStart, job.periodEnd)}
              </span>
            </span>
            <span className="flex items-center gap-1.5 md:justify-end">
              <MapPin size={13} />
              {job.location}
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
          {job.summary}
        </p>

        {/* Achievements */}
        <ul className="space-y-2.5 mb-6">
          {job.achievements.map((achievement, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <span>{achievement}</span>
            </li>
          ))}
        </ul>

        {/* Tech Stack */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-text-muted text-xs">
            <Briefcase size={12} />
            Stack:
          </span>
          {job.techStack.map((tech) => (
            <Badge key={tech} variant="default">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
