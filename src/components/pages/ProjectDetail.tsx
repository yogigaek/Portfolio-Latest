import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import GitHubIcon from '@/components/ui/GitHubIcon'
import Badge from '@/components/ui/Badge'
import { projects } from '@/data'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === id)
  const handleBack = () => navigate('/')

  if (!project || !project.screenshots || project.screenshots.length === 0) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm transition-colors duration-200 mb-10"
        >
          <ArrowLeft size={16} />
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

          <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">
            {project.title}
          </h1>
          <p className="text-text-secondary text-lg mb-6">{project.subtitle}</p>

          <p className="text-text-secondary text-base leading-relaxed max-w-3xl mb-8">
            {project.description}
          </p>

          {/* Metrics */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.metrics.map((m) => (
              <span
                key={m}
                className="bg-accent/10 border border-accent/20 text-accent-hover text-sm font-semibold px-4 py-2 rounded-xl"
              >
                {m}
              </span>
            ))}
          </div>

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
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover px-5 py-2.5 rounded-xl text-sm text-white transition-all duration-200"
              >
                <ExternalLink size={16} />
                {project.demoLabel ?? 'Live Demo'}
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
        <div className="mt-16 pt-8 border-t border-border text-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  )
}
