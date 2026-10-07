import { Lock } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { Project } from '@/types'

export default function CaseStudyBadges({ project }: { project: Project }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="font-mono text-[11px] uppercase tracking-[0.14em]">
        <Lock size={10} aria-hidden="true" />
        {project.status}
      </Badge>
      <Badge variant="outline" className="font-mono text-[11px] uppercase tracking-[0.14em]">
        {project.type}
      </Badge>
    </div>
  )
}
