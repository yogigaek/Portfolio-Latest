import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Download, ExternalLink, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import NotFound from '@/components/pages/NotFound'
import GitHubIcon from '@/components/ui/GitHubIcon'
import Badge from '@/components/ui/Badge'
import ArchitecturePanel from '@/components/ui/ArchitecturePanel'
import CaseStudyBadges from '@/components/ui/CaseStudyBadges'
import MetricList from '@/components/ui/MetricList'
import { CV, NDA_NOTE, projects, whatsappLink, workExperiences } from '@/data'
import { HOME_HEAD, applyHead, hasProjectPage, projectHead, projectPath } from '@/lib/seo'
import type { Project } from '@/types'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const found = projects.find((p) => p.id === id)
  const project = found && hasProjectPage(found) ? found : undefined
  // enterprise work (under NDA) is told through its role and architecture; personal builds through screenshots
  const isCaseStudy = !!project?.experienceId
  // replace: browser Back from the portfolio should not land on this project page again
  const handleBack = () => navigate('/#work', { replace: true })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!project) return

    // the project is its own indexable page (listed in sitemap.xml), not a duplicate of home
    applyHead(projectHead(project))
    // back to the home tags, not "whatever was there before": a visitor who opened this URL directly got the
    // project's own static HTML, so the tags in the document already belonged to this project
    return () => applyHead(HOME_HEAD)
  }, [project])

  if (!project) {
    return <NotFound />
  }

  return (
    <main id="main" className="min-h-screen bg-background text-text-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <button
          onClick={handleBack}
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Portfolio
        </button>

        {isCaseStudy ? <CaseStudyBody project={project} /> : <WalkthroughBody project={project} />}

        {/* Bottom nav */}
        <div className="mt-16 flex flex-col items-center gap-6 border-t border-border pt-10 text-center">
          <p className="font-display text-xl font-semibold text-text-primary">Interested in working together?</p>
          <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
            <Button href={CV.onePage.href} download={CV.onePage.filename} variant="solid" size="sm">
              <Download size={15} aria-hidden="true" />
              Download CV ({CV.onePage.pages} page)
            </Button>
            <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm">
              <MessageCircle size={15} aria-hidden="true" />
              Message on WhatsApp
              <span className="sr-only">(opens in new tab)</span>
            </Button>
          </div>
          <button
            onClick={handleBack}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Portfolio
          </button>
        </div>
      </div>
    </main>
  )
}

function CaseStudyBody({ project }: { project: Project }) {
  const job = workExperiences.find((w) => w.id === project.experienceId)
  const others = projects.filter((p) => p.experienceId && p.id !== project.id)

  return (
    <article>
      <header className="mb-10">
        <CaseStudyBadges project={project} />

        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
          {project.title}
        </h1>
        <p className="mt-2 text-lg text-text-secondary">{project.subtitle}</p>

        {job && (
          <dl className="mt-6 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {[
              { label: 'Role', value: job.role },
              { label: 'Company', value: job.client ? `${job.company} · Client: ${job.client}` : job.company },
              { label: 'Period', value: job.period },
            ].map((fact) => (
              <div key={fact.label} className="bg-surface px-5 py-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">{fact.label}</dt>
                <dd className="mt-1.5 text-sm text-text-primary">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        <div className="space-y-10">
          <section aria-labelledby="overview-title">
            <h2 id="overview-title" className="font-display text-xl font-semibold text-text-primary">
              Overview
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary md:text-base">{project.description}</p>
          </section>

          <section aria-labelledby="outcomes-title">
            <h2 id="outcomes-title" className="font-display text-xl font-semibold text-text-primary">
              Outcomes
            </h2>
            <MetricList metrics={project.metrics} className="mt-4" />
          </section>

          <section aria-labelledby="stack-title">
            <h2 id="stack-title" className="font-display text-xl font-semibold text-text-primary">
              Tech stack
            </h2>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <li key={tech}>
                  <Badge>{tech}</Badge>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          {project.architectureLabel && (
            <ArchitecturePanel
              id={project.id}
              label={project.architectureLabel}
              before={project.architectureBefore}
              className="overflow-hidden rounded-2xl border border-border"
            />
          )}
          <p className="text-sm leading-relaxed text-text-muted">{NDA_NOTE}</p>
        </aside>
      </div>

      {others.length > 0 && (
        <nav aria-labelledby="more-title" className="mt-16">
          <h2 id="more-title" className="font-display text-xl font-semibold text-text-primary">
            More case studies
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {others.map((other) => (
              // an odd last card spans the row instead of leaving a grey hole beside it
              <li key={other.id} className="bg-surface sm:odd:last:col-span-2">
                {/* replace: hopping between case studies keeps one history entry, so Back still leaves the page */}
                <Link
                  to={projectPath(other)}
                  replace
                  className="group flex min-h-11 items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
                >
                  <span>
                    <span className="block text-sm font-medium text-text-primary">{other.title}</span>
                    <span className="mt-0.5 block text-xs text-text-muted">{other.subtitle}</span>
                  </span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-hover"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  )
}

function WalkthroughBody({ project }: { project: Project }) {
  return (
    <>
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={project.status === 'Public' ? 'success' : 'danger'}>
            {project.status}
          </Badge>
          <Badge variant="default">{project.type}</Badge>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-2">
          {project.title}
        </h1>
        <p className="text-text-secondary text-lg mb-6">{project.subtitle}</p>

        <p className="text-text-secondary text-base leading-relaxed max-w-3xl mb-8">
          {project.description}
        </p>

        <MetricList metrics={project.metrics} label="Highlights" className="mb-6 max-w-3xl" />

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-surface border border-border hover:border-border-hover px-5 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-all duration-200"
            >
              <GitHubIcon size={16} />
              View on GitHub
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-solid hover:bg-solid/90 px-5 py-2.5 rounded-xl text-sm font-semibold text-solid-ink transition-all duration-200"
            >
              <ExternalLink size={16} aria-hidden="true" />
              {project.demoLabel ?? 'Live Demo'}
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}
        </div>
      </div>

      {/* Screenshots grid */}
      <div>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-8">
          Feature Walkthrough
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.screenshots?.map((screenshot, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl overflow-hidden"
            >
              <div className="bg-surface-2 p-3 flex items-center gap-2 border-b border-border">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/40" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/40" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/40" />
                </div>
                <span className="text-text-muted text-xs font-medium ml-2">
                  {screenshot.title}
                </span>
              </div>
              <img
                src={screenshot.image}
                alt={screenshot.title}
                className="w-full object-cover"
                width={800}
                height={500}
                loading="lazy"
              />
              <div className="p-4">
                <p className="text-text-secondary text-sm leading-relaxed">
                  {screenshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
