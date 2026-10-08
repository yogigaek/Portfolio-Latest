import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react'
import GitHubIcon from '@/components/ui/GitHubIcon'
import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import Badge from '@/components/ui/Badge'
import TiltCard from '@/components/ui/TiltCard'
import ArchitecturePanel from '@/components/ui/ArchitecturePanel'
import CaseStudyBadges from '@/components/ui/CaseStudyBadges'
import MetricList from '@/components/ui/MetricList'
import { cn } from '@/lib/utils'
import { NDA_NOTE, projects } from '@/data'
import { hasProjectPage, projectPath } from '@/lib/seo'
import type { Project } from '@/types'

const VISIBLE_TAGS = 9
// phones get a shorter case study: every card is otherwise several screens tall
const VISIBLE_TAGS_MOBILE = 5

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  // public code gets its own visible row: the collapsed list below is for older personal builds
  const openSource = projects.filter((p) => !p.featured && p.type === 'Open Source')
  const earlier = projects.filter((p) => !p.featured && p.type !== 'Open Source')

  return (
    <section id="work" aria-labelledby="work-title" className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeader
          id="work-title"
          index="03"
          eyebrow="Selected work"
          title="Enterprise systems, from architecture to production"
          subtitle={NDA_NOTE}
        />

        <div className="space-y-6">
          {featured.map((project) => (
            <Reveal as="article" key={project.id}>
              <CaseStudy project={project} />
            </Reveal>
          ))}
        </div>

        {openSource.length > 0 && (
          <div className="mt-16">
            <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.14em] text-text-muted">
              Open source · code you can read
            </p>
            <div className="space-y-6">
              {openSource.map((project) => (
                <Reveal as="article" key={project.id}>
                  <CaseStudy project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {earlier.length > 0 && (
          <Reveal className="mt-16">
            {/* collapsed by default: the enterprise case studies above are what recruiters came for */}
            <details className="group/earlier rounded-2xl border border-border bg-term-bg">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 px-4 py-3 font-mono text-[12px] text-term-fg marker:hidden sm:px-5">
                <span aria-hidden="true" className="text-term-ok">$</span>
                <span className="min-w-0 flex-1">
                  ls earlier-projects/{' '}
                  <span className="text-term-muted">
                    — {earlier.length} personal full-stack builds · public source &amp; walkthroughs
                  </span>
                </span>
                <ChevronRight
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 text-term-muted transition-transform duration-200 group-open/earlier:rotate-90"
                />
              </summary>
              <ul className="grid grid-cols-1 gap-5 border-t border-white/[0.06] p-4 sm:p-5 md:grid-cols-2">
                {earlier.map((project) => (
                  <li key={project.id}>
                    <EarlierProjectCard project={project} />
                  </li>
                ))}
              </ul>
            </details>
          </Reveal>
        )}
      </div>
    </section>
  )
}

function CaseStudy({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)
  const hiddenTags = project.techStack.length - VISIBLE_TAGS
  const hiddenTagsMobile = project.techStack.length - VISIBLE_TAGS_MOBILE
  const descriptionId = `${project.id}-description`
  const isPublic = project.status === 'Public'

  return (
    <TiltCard
      amplitude={1.5}
      className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-border-hover lg:grid-cols-[1.4fr_1fr]"
    >
      <div className="p-5 sm:p-6 md:p-9">
        <CaseStudyBadges project={project} />

        <h3 className="font-display text-2xl font-bold tracking-tight text-text-primary md:text-[1.7rem]">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm text-text-muted">{project.subtitle}</p>

        <p
          id={descriptionId}
          className={cn('mt-5 text-[15px] leading-relaxed text-text-secondary sm:line-clamp-none', !expanded && 'line-clamp-4')}
        >
          {project.description}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={descriptionId}
          className="-mb-2 inline-flex min-h-11 items-center text-sm font-medium text-accent-hover sm:hidden"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>

        <MetricList metrics={project.metrics} label={isPublic ? 'Highlights' : 'Outcomes'} className="mt-6" />

        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.techStack.slice(0, VISIBLE_TAGS).map((tech, i) => (
            <li key={tech} className={cn(i >= VISIBLE_TAGS_MOBILE && 'max-sm:hidden')}>
              <Badge>{tech}</Badge>
            </li>
          ))}
          {hiddenTagsMobile > 0 && (
            <li className="sm:hidden">
              <span className="inline-flex items-center px-1 py-1 text-xs text-text-muted">+{hiddenTagsMobile} more</span>
            </li>
          )}
          {hiddenTags > 0 && (
            <li className="max-sm:hidden">
              <span className="inline-flex items-center px-1 py-1 text-xs text-text-muted">+{hiddenTags} more</span>
            </li>
          )}
        </ul>

        {hasProjectPage(project) && (
          <Link
            to={projectPath(project)}
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent-hover transition-colors hover:text-text-primary"
          >
            Read case study
            <ArrowRight size={14} aria-hidden="true" />
            <span className="sr-only">: {project.title}</span>
          </Link>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent-hover transition-colors hover:text-text-primary"
          >
            <GitHubIcon size={14} />
            View source on GitHub
            <ArrowUpRight size={14} aria-hidden="true" />
            <span className="sr-only">: {project.title} (opens in new tab)</span>
          </a>
        )}
      </div>

      {project.architectureLabel && (
        <ArchitecturePanel
          id={project.id}
          label={project.architectureLabel}
          before={project.architectureBefore}
          isPublic={isPublic}
          className="border-t border-border lg:border-l lg:border-t-0"
        />
      )}
    </TiltCard>
  )
}

function EarlierProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard
      amplitude={3}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-border-hover"
    >
      {project.coverImage && (
        <div className="aspect-[16/9] overflow-hidden border-b border-border bg-surface-2">
          <img
            src={project.coverImage}
            alt={`${project.title} — home page screenshot`}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            width={640}
            height={360}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h4 className="font-display text-lg font-semibold text-text-primary">{project.title}</h4>
        <p className="mt-1 text-sm text-text-muted">{project.subtitle}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.techStack.slice(0, 6).map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3.5 text-xs text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              <GitHubIcon size={13} />
              Source
              <span className="sr-only">for {project.title} (opens in new tab)</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3.5 text-xs text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              {project.demoLabel ?? 'Live demo'}
              <ArrowUpRight size={13} aria-hidden="true" />
              <span className="sr-only">for {project.title} (opens in new tab)</span>
            </a>
          )}
          {hasProjectPage(project) && (
            <Link
              to={projectPath(project)}
              className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-accent-hover transition-colors hover:text-text-primary"
            >
              Feature walkthrough
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </TiltCard>
  )
}
