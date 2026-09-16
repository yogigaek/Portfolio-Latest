import { useEffect, useState } from 'react'
import { ArrowUp, ArrowUpRight, MessageCircle } from 'lucide-react'
import { CONTACT_INFO, LOCATION } from '@/data'
import { cn } from '@/lib/utils'

// stamped at build time, shown in WIB: every deploy is a content update, so the date never goes stale
const buildDate = new Date(__BUILD_DATE__)
const updated = {
  iso: buildDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit' }),
  label: buildDate.toLocaleDateString('en-US', { timeZone: 'Asia/Jakarta', year: 'numeric', month: 'long' }),
}

const profiles = [
  { label: 'GitHub', href: CONTACT_INFO.github },
  { label: 'GitLab', href: CONTACT_INFO.gitlab },
  { label: 'LeetCode', href: CONTACT_INFO.leetcode },
  { label: 'LinkedIn', href: CONTACT_INFO.linkedin },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const [showTop, setShowTop] = useState(false)
  const [inContact, setInContact] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // the contact shortcut is redundant inside Contact, and on phones it would sit on the message field
    const contact = document.getElementById('contact')
    const observer = contact
      ? new IntersectionObserver(([entry]) => setInContact(entry.isIntersecting), { threshold: 0.12 })
      : null
    if (contact) observer?.observe(contact)

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  const showContact = showTop && !inContact

  return (
    <>
      <footer className="border-t border-border py-12">
        <div className="container-custom flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-text-primary">Muhammad Yogi</p>
            <p className="mt-1 text-sm text-text-secondary">
              Backend Software Engineer · {LOCATION.city}, {LOCATION.country} ({LOCATION.timezone})
            </p>
          </div>

          <nav aria-label="Profiles" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {profiles.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 text-text-secondary transition-colors hover:text-text-primary"
              >
                {p.label}
                <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            ))}
            <a href={`mailto:${CONTACT_INFO.email}`} className="inline-flex min-h-11 min-w-11 items-center justify-center text-text-secondary transition-colors hover:text-text-primary">
              Email
            </a>
          </nav>
        </div>

        <div className="container-custom mt-8">
          <div className="flex flex-col gap-2 border-t border-border pt-6 font-mono text-[11px] text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} Muhammad Yogi · Built with React, TypeScript &amp; Tailwind CSS</p>
            <p>
              Updated <time dateTime={updated.iso}>{updated.label}</time>
            </p>
          </div>
        </div>
      </footer>

      <a
        href="#home"
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={cn(
          'fixed right-5 z-40 hidden h-12 w-12 place-items-center sm:grid rounded-full border border-border-hover bg-surface/90 text-text-primary shadow-xl backdrop-blur transition-all duration-300 hover:border-accent/60',
          // takes the contact shortcut's slot while that one is hidden, instead of floating above an empty gap
          showContact ? 'bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))]' : 'bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]',
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <ArrowUp size={18} aria-hidden="true" />
      </a>

      <a
        href="#contact"
        aria-label="Jump to contact section"
        tabIndex={showContact ? 0 : -1}
        aria-hidden={!showContact}
        className={cn(
          // white icon on the brand accent (the accent hue is locked; white keeps ≥3:1 for the glyph in every look)
          'fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-[0_14px_36px_-10px_rgb(var(--accent)/0.7)] transition-all duration-300 hover:scale-105 focus-visible:outline-offset-4 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:right-5',
          showContact ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <MessageCircle size={20} aria-hidden="true" />
      </a>
    </>
  )
}
