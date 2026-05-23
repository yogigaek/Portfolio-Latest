export interface WorkExperience {
  id: string
  company: string
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
  logoInitials: string
  accentColor: string
}

export type SkillLevel = 'Expert' | 'Advanced' | 'Proficient' | 'Familiar'

export type SkillCategory =
  | 'Languages'
  | 'Backend & Frameworks'
  | 'Cloud & Infrastructure'
  | 'Databases'
  | 'Security & Auth'
  | 'Frontend'
  | 'DevOps & Tools'
  | 'Architecture & Design'
  | 'Engineering Quality'

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

export interface StatCard {
  value: string
  suffix?: string
  label: string
  description: string
}

export interface NavItem {
  label: string
  href: string
}

