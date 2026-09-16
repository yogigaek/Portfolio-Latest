import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, ExternalLink, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import NotFound from '@/components/pages/NotFound'
import GitHubIcon from '@/components/ui/GitHubIcon'
import Badge from '@/components/ui/Badge'
import { CV, projects, whatsappLink } from '@/data'

const SITE = 'https://muhammadyogi.vercel.app'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === id)
  // replace: browser Back from the portfolio should not land on this project page again
  const handleBack = () => navigate('/#work', { replace: true })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!project) return

    document.title = `${project.title} — Muhammad Yogi`
    // the project is its own indexable page (listed in sitemap.xml), not a duplicate of home
    const tags = [
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]'),
      document.querySelector<HTMLMetaElement>('meta[property="og:url"]'),
    ]
    const url = `${SITE}/projects/${project.id}`
    const previous = tags.map((tag) => (tag instanceof HTMLLinkElement ? tag.href : tag?.content))
    tags[0]?.setAttribute('href', url)
    tags[1]?.setAttribute('content', url)
    return () => {
      document.title = 'Muhammad Yogi — Backend Software Engineer'
      if (previous[0]) tags[0]?.setAttribute('href', previous[0])
      if (previous[1]) tags[1]?.setAttribute('content', previous[1])
    }
  }, [project])

  if (!project || !project.screenshots || project.screenshots.length === 0) {
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

          {/* Metrics */}
          <ul className="mb-6 grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Highlights">
            {project.metrics.map((m) => (
              <li key={m} className="flex items-start gap-2 text-sm text-text-primary">
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-metric" />
                {m}
              </li>
            ))}
          </ul>

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
            {project.screenshots.map((screenshot, i) => (
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
