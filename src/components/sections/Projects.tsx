import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ChevronRight, Lock } from 'lucide-react'
import GitHubIcon from '@/components/ui/GitHubIcon'
import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import Badge from '@/components/ui/Badge'
import TiltCard from '@/components/ui/TiltCard'
import { cn } from '@/lib/utils'
import { projects } from '@/data'
import type { Project } from '@/types'

const VISIBLE_TAGS = 9
// phones get a shorter case study: every card is otherwise several screens tall
const VISIBLE_TAGS_MOBILE = 5

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const earlier = projects.filter((p) => !p.featured)

  return (
    <section id="work" aria-labelledby="work-title" className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeader
          id="work-title"
          index="03"
          eyebrow="Selected work"
          title="Enterprise systems, from architecture to production"
          subtitle="Client work is under NDA, so these case studies describe scope, architecture, and measured outcomes rather than screenshots."
        />

        <div className="space-y-6">
          {featured.map((project) => (
            <Reveal as="article" key={project.id}>
              <CaseStudy project={project} />
            </Reveal>
          ))}
        </div>

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

  return (
    <TiltCard
      amplitude={1.5}
      className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-border-hover lg:grid-cols-[1.4fr_1fr]"
    >
      <div className="p-5 sm:p-6 md:p-9">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-[11px] uppercase tracking-[0.14em]">
            <Lock size={10} aria-hidden="true" />
            {project.status}
          </Badge>
          <Badge variant="outline" className="font-mono text-[11px] uppercase tracking-[0.14em]">
            {project.type}
          </Badge>
        </div>

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

        <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Outcomes">
          {project.metrics.map((metric) => (
            <li key={metric} className="flex items-start gap-2 text-sm text-text-primary">
              <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-metric" />
              {metric}
            </li>
          ))}
        </ul>

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
      </div>

      {project.architectureLabel && <ArchitecturePanel id={project.id} label={project.architectureLabel} />}
    </TiltCard>
  )
}

function ArchitecturePanel({ id, label }: { id: string; label: string }) {
  const segments = label.split('→').map((s) => s.trim())
  const [lastNode, ...extras] = segments[segments.length - 1].split('·').map((s) => s.trim())
  const nodes = [...segments.slice(0, -1), lastNode]

  return (
    <div className="flex flex-col border-t border-border bg-term-bg lg:border-l lg:border-t-0">
      <div aria-hidden="true" className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 font-mono text-[11px] text-term-muted">{id}</span>
      </div>
      <div className="flex flex-1 flex-col px-5 py-7 font-mono text-[12px] leading-[1.9] text-term-fg md:px-7 lg:justify-center lg:py-9">
        <p aria-hidden="true">
          <span className="text-term-muted">$</span> describe --architecture
        </p>
        <p className="sr-only">Architecture: {label}</p>
        <ol aria-hidden="true" className="mt-2">
          {nodes.map((node, i) => (
            <li key={`${node}-${i}`} className="flex gap-3">
              <span className="w-3 text-center text-term-key">{i === 0 ? '▸' : '↓'}</span>
              <span className="text-term-string">{node}</span>
            </li>
          ))}
        </ol>
        {extras.length > 0 && (
          <p aria-hidden="true" className="mt-2">
            <span className="text-term-muted">with</span> <span className="text-term-metric">{extras.join(' · ')}</span>
          </p>
        )}
        <p aria-hidden="true" className="mt-2">
          <span className="text-term-muted">status</span> <span className="text-term-ok">private · under NDA</span>
        </p>
      </div>
    </div>
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
          {project.detailPath && (
            <Link
              to={project.detailPath}
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
