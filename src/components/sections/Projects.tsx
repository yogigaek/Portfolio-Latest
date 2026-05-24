import { motion } from 'framer-motion'
import { ExternalLink, Lock, ChevronRight } from 'lucide-react'
import GitHubIcon from '@/components/ui/GitHubIcon'
import { Link } from 'react-router-dom'
import SectionHeader from '@/components/ui/SectionHeader'
import Badge from '@/components/ui/Badge'
import useInView from '@/hooks/useInView'
import { projects } from '@/data'
import type { Project } from '@/types'

export default function Projects() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.05 })

  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section id="projects" ref={ref} className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Work Showcase"
          title="Projects"
          subtitle="Enterprise systems, internal platforms, and personal projects — from architecture to production."
        />

        {/* Featured (NDA enterprise projects) */}
        <div className="space-y-6 mb-8">
          {featured.map((project, i) => (
            <FeaturedProjectCard key={project.id} project={project} index={i} inView={inView} />
          ))}
        </div>

        {/* Other projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {others.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + featured.length} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedProjectCard({
  project,
  index,
  inView,
}: {
  project: Project
  index: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-border-hover transition-colors duration-300"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="danger">
                <Lock size={10} />
                {project.status}
              </Badge>
              <Badge variant="default">{project.type}</Badge>
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-1">
              {project.title}
            </h3>
            <p className="text-text-secondary text-sm">{project.subtitle}</p>
          </div>

          {/* Architecture label */}
          {project.architectureLabel && (
            <div className="hidden md:flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-4 py-3 text-xs text-text-muted font-mono flex-shrink-0">
              <span className="text-accent">▸</span>
              {project.architectureLabel}
            </div>
          )}
        </div>

        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
          {project.description}
        </p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.metrics.map((metric) => (
            <span
              key={metric}
              className="bg-accent/10 border border-accent/20 text-accent text-xs font-semibold px-3 py-1.5 rounded-xl"
            >
              {metric}
            </span>
          ))}
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="default">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: Project
  index: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-border-hover transition-colors duration-300 flex flex-col"
    >
      {/* Cover image */}
      {project.coverImage && (
        <div className="h-48 overflow-hidden bg-surface-2">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
            width={600}
            height={192}
            loading="lazy"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={project.status === 'Public' ? 'success' : 'danger'}>
            {project.status}
          </Badge>
          <Badge variant="default">{project.type}</Badge>
        </div>

        <h3 className="font-display text-lg font-bold text-text-primary mb-1">
          {project.title}
        </h3>
        <p className="text-text-muted text-xs mb-3">{project.subtitle}</p>

        <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.metrics.map((m) => (
            <span key={m} className="text-xs text-text-muted bg-surface-2 border border-border px-2 py-1 rounded-lg">
              {m}
            </span>
          ))}
        </div>

        {/* Tech */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 5).map((t) => (
            <Badge key={t} variant="default">
              {t}
            </Badge>
          ))}
          {project.techStack.length > 5 && (
            <Badge variant="default">+{project.techStack.length - 5}</Badge>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary border border-border hover:border-border-hover px-3 py-2 rounded-xl transition-all duration-200"
            >
              <GitHubIcon size={13} />
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary border border-border hover:border-border-hover px-3 py-2 rounded-xl transition-all duration-200"
            >
              <ExternalLink size={13} />
              {project.demoLabel ?? 'Live Demo'}
            </a>
          )}
          {project.detailPath && (
            <Link
              to={project.detailPath}
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover border border-accent/30 hover:border-accent/60 px-3 py-2 rounded-xl transition-all duration-200 ml-auto"
            >
              View Details
              <ChevronRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
