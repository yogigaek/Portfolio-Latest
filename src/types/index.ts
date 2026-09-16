export interface WorkExperience {
  id: string
  company: string
  client?: string
  role: string
  period: string
  periodStart: string
  periodEnd: string
  current: boolean
  type: string
  location: string
  summary: string
  achievements: string[]
  techStack: string[]
}

export type SkillLevel = 'Expert' | 'Advanced' | 'Proficient' | 'Familiar'

export type SkillCategory =
  | 'Languages'
  | 'Backend'
  | 'Cloud & DevOps'
  | 'Databases'
  | 'Messaging & Integration'
  | 'Security & Auth'
  | 'Architecture'
  | 'Testing & Quality'
  | 'Observability & Tools'
  | 'Frontend'

export interface Skill {
  name: string
  level: SkillLevel
  category: SkillCategory
}

export type ProjectStatus = 'Private · NDA' | 'Public'
export type ProjectType = 'Enterprise' | 'Open Source' | 'Personal'

export interface ProjectScreenshot {
  title: string
  image: string
  description: string
}

export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  type: ProjectType
  status: ProjectStatus
  metrics: string[]
  techStack: string[]
  coverImage?: string
  githubUrl?: string
  demoUrl?: string
  demoLabel?: string
  detailPath?: string
  screenshots?: ProjectScreenshot[]
  featured: boolean
  architectureLabel?: string
}

export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  avatar: string
  review: string
}

export interface Outcome {
  id: string
  value: string
  label: string
  note: string
}

export type ServiceIcon = 'api' | 'integration' | 'cloud' | 'database' | 'modernization' | 'platform' | 'consulting'

export interface Service {
  id: string
  icon: ServiceIcon
  title: string
  description: string
  proof: string
}

export interface WorkStep {
  title: string
  description: string
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  major: string
  period: string
  highlights: string[]
}

export interface QuickFact {
  label: string
  value: string
  href?: string
}

export interface NavItem {
  label: string
  href: string
}
