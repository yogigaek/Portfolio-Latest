import { motion } from 'framer-motion'
import { Home, User, Briefcase, Code2, FolderOpen, Quote, Mail, GraduationCap } from 'lucide-react'
import useScrollSpy from '@/hooks/useScrollSpy'
import { navItems } from '@/data'
import { cn } from '@/lib/utils'

const sectionIds = [
  'home', 'about', 'experience', 'education',
  'skills', 'projects', 'testimonials', 'contact',
]

const navIcons: Record<string, React.ElementType> = {
  home: Home,
  about: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code2,
  projects: FolderOpen,
  testimonials: Quote,
  contact: Mail,
}

export default function Nav() {
  const activeId = useScrollSpy(sectionIds)

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:bottom-auto md:top-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass rounded-2xl px-2 py-2 flex items-center gap-0.5"
      >
        {/* Desktop: icon + label */}
        {navItems.map((item) => {
          const id = item.href.replace('#', '')
          const isActive = activeId === id
          const Icon = navIcons[id] ?? Home

          return (
            <a
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                'relative hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-xl',
                'text-xs font-medium transition-colors duration-200',
                isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 bg-accent/20 rounded-xl border border-accent/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={13} className="relative z-10 flex-shrink-0" />
              <span className="relative z-10">{item.label}</span>
            </a>
          )
        })}

        {/* Mobile: icon only — use w-9 to fit 8 items on 375px */}
        {navItems.map((item) => {
          const id = item.href.replace('#', '')
          const isActive = activeId === id
          const Icon = navIcons[id] ?? Home

          return (
            <a
              key={`mob-${item.href}`}
              href={item.href}
              aria-label={item.label}
              className={cn(
                'relative w-9 h-9 rounded-xl flex md:hidden items-center justify-center',
                'transition-colors duration-200',
                isActive
                  ? 'bg-accent/20 text-white border border-accent/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5',
              )}
            >
              <Icon size={15} />
            </a>
          )
        })}
      </motion.div>
    </nav>
  )
}
