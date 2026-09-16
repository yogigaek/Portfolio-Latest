import { Download } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { CV, education, workExperiences, yearsOfExperience } from '@/data'
import type { WorkExperience as Job } from '@/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseMonth(value: string): Date {
  if (value === 'Present') return new Date()
  const [mon, yr] = value.split(' ')
  return new Date(parseInt(yr), MONTHS.indexOf(mon))
}

function getDuration(start: string, end: string): string {
  const from = parseMonth(start)
  const to = parseMonth(end)
  // inclusive of both the start and end month, as LinkedIn and CVs count tenure
  const totalMonths = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1
  const yrs = Math.floor(totalMonths / 12)
  const mos = totalMonths % 12
  if (yrs === 0) return `${mos} mo`
  if (mos === 0) return `${yrs} yr`
  return `${yrs} yr ${mos} mo`
}

export default function WorkExperience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section-padding border-t border-border section-tinted">
      <div className="container-custom">
        <SectionHeader
          id="experience-title"
          index="04"
          eyebrow="Experience"
          title="Experience and education"
          subtitle={`${yearsOfExperience} years across enterprise fintech and a healthcare platform.`}
        >
          <CvDownloads />
        </SectionHeader>

        <ol className="border-t border-border">
          {workExperiences.map((job) => (
            <Reveal as="li" key={job.id} className="border-b border-border">
              <Role job={job} />
            </Reveal>
          ))}
        </ol>


        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {education.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06} className="rounded-2xl border border-border bg-surface p-6 md:p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                Education · {item.period}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-text-primary">{item.degree}</h3>
              <p className="mt-0.5 text-sm text-text-secondary">
                {item.institution}
                {item.major !== item.degree && <> · {item.major}</>}
              </p>
              <ul className="mt-4 space-y-2">
                {item.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                    <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-text-muted" />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">
            {CV.onePage.pages}-page CV for quick screening, full CV for the complete detail.
          </p>
          <CvDownloads />
        </Reveal>
      </div>
    </section>
  )
}

function CvDownloads() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
      <Button href={CV.onePage.href} download={CV.onePage.filename} variant="solid" size="sm">
        <Download size={15} aria-hidden="true" />
        Download CV — {CV.onePage.pages} page (PDF)
      </Button>
      <Button href={CV.full.href} download={CV.full.filename} variant="secondary" size="sm">
        <Download size={15} aria-hidden="true" />
        Full CV — {CV.full.pages} pages (PDF)
      </Button>
    </div>
  )
}

function Role({ job }: { job: Job }) {
  return (
    <div className="grid grid-cols-1 gap-5 py-10 md:grid-cols-[240px_1fr] md:gap-10">
      <div className="md:sticky md:top-24 md:self-start">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent-hover">
          {job.periodStart} — {job.periodEnd}
        </p>
        <p className="mt-2 font-display text-lg font-semibold text-text-primary">{job.company}</p>
        {job.client && <p className="text-sm text-text-secondary">Client: {job.client}</p>}
        <p className="mt-1 text-sm text-text-muted">{job.location}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.current && <Badge variant="success">Current</Badge>}
          <Badge variant="outline">{job.type}</Badge>
          <Badge variant="outline">{getDuration(job.periodStart, job.periodEnd)}</Badge>
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold text-text-primary">{job.role}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{job.summary}</p>

        <ul className="mt-5 space-y-2.5">
          {job.achievements.map((achievement) => (
            <li key={achievement} className="flex gap-3 text-sm leading-relaxed text-text-secondary md:text-[15px]">
              <span aria-hidden="true" className="mt-[10px] h-px w-3 shrink-0 bg-accent-hover" />
              <span>{achievement}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`Tech stack at ${job.company}`}>
          {job.techStack.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
