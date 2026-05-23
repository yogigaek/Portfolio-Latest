import { Linkedin, Mail } from 'lucide-react'
import GitHubIcon from '@/components/ui/GitHubIcon'
import { navItems, CONTACT_INFO } from '@/data'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-0 py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="font-display font-bold text-text-primary text-lg">Muhammad Yogi</p>
            <p className="text-text-secondary text-sm mt-1">Backend Software Engineer</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-text-muted hover:text-text-primary text-sm transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={CONTACT_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200"
            >
              <GitHubIcon size={16} />
            </a>
            <a
              href={CONTACT_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              aria-label="Email"
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-text-muted text-xs">
            © {year} Muhammad Yogi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
