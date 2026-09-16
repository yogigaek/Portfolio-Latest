import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloudSun, Download, MessageCircle, Moon, Sun } from 'lucide-react'
import useScrollSpy from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'
import { LOOKS, setLook, useLook, type Look } from '@/lib/look'
import LookSwitch from './LookSwitch'
import { CV, navItems, whatsappLink } from '@/data'

const SPY_IDS = ['home', 'outcomes', 'about', 'work', 'experience', 'stack', 'services', 'recommendations', 'contact']
const LOOK_ICONS: Record<Look, typeof Sun> = { morning: Sun, dusk: CloudSun, night: Moon }

export default function Topbar() {
  const activeId = useScrollSpy(SPY_IDS)
  const look = useLook()
  const lookIndex = LOOKS.findIndex((l) => l.id === look)
  const nextLook = LOOKS[(lookIndex + 1) % LOOKS.length]
  const CurrentLookIcon = LOOK_ICONS[look]
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close(true)
        return
      }
      if (e.key !== 'Tab' || !drawerRef.current || !toggleRef.current) return

      // the open drawer covers the page, so Tab cycles between the toggle and the drawer controls
      const stops = [toggleRef.current, ...drawerRef.current.querySelectorAll<HTMLElement>('a, button')]
      const first = stops[0]
      const last = stops[stops.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const desktop = window.matchMedia('(min-width: 1024px)')
    const onBreakpoint = () => desktop.matches && close(false)

    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onBreakpoint)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onBreakpoint)
    }
  }, [open, close])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        stuck || open
          ? 'bg-background/85 backdrop-blur-xl border-b border-border'
          : 'bg-transparent border-b border-transparent',
      )}
    >
      <div className="container-custom flex h-16 items-center justify-between gap-3 sm:gap-6">
        <a href="#home" onClick={() => close(false)} className="group flex min-h-11 min-w-0 items-center gap-3 rounded-lg" aria-label="Muhammad Yogi — back to top">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-lg border border-accent/30 bg-accent/10 font-mono text-xs font-semibold text-accent-hover transition-colors group-hover:bg-accent/20"
          >
            MY
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[15px] font-semibold text-text-primary">Muhammad Yogi</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted max-[359px]:hidden">Backend · Fintech</span>
          </span>
        </a>

        <nav aria-label="Section navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeId === item.href.slice(1)
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'relative block rounded-lg px-3 py-2 text-sm transition-colors duration-200',
                      isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="topbar-active"
                        className="absolute inset-0 rounded-lg border border-border-hover bg-surface-2"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LookSwitch className="mr-1 hidden lg:flex" />
          <a
            href={CV.onePage.href}
            download={CV.onePage.filename}
            className="hidden sm:inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-solid px-3.5 text-sm font-semibold text-solid-ink transition-colors hover:bg-solid/90"
          >
            <Download size={15} aria-hidden="true" />
            Download CV
          </a>

          <button
            type="button"
            onClick={() => setLook(nextLook.id)}
            aria-label={`Theme: ${LOOKS[lookIndex].label}. Switch to ${nextLook.label}`}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-background/40 text-text-primary backdrop-blur hover:border-border-hover lg:hidden"
          >
            <CurrentLookIcon size={17} aria-hidden="true" />
          </button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-background/40 text-text-primary backdrop-blur hover:border-border-hover"
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span className={cn('absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-200', open && 'translate-y-1.5 rotate-45')} />
              <span className={cn('absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity duration-200', open && 'opacity-0')} />
              <span className={cn('absolute left-0 top-3 h-px w-4 bg-current transition-transform duration-200', open && '-translate-y-1.5 -rotate-45')} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={drawerRef}
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background"
          >
            <nav aria-label="Mobile section navigation" className="container-custom py-6 [@media(max-height:500px)]:py-3">
              <ul className="border-t border-border [@media(max-height:500px)]:grid [@media(max-height:500px)]:grid-cols-2 [@media(max-height:500px)]:gap-x-8 [@media(max-height:500px)]:border-t-0">
                {navItems.map((item, i) => (
                  <li key={item.href} className="border-b border-border">
                    <a
                      href={item.href}
                      onClick={() => close(false)}
                      className="flex items-baseline gap-4 py-4 font-display text-2xl font-semibold text-text-primary [@media(max-height:500px)]:py-2.5 [@media(max-height:500px)]:text-lg"
                    >
                      <span className="font-mono text-xs text-text-muted">0{i + 1}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3">
                <a
                  href={CV.onePage.href}
                  download={CV.onePage.filename}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-solid px-5 py-3.5 font-semibold text-solid-ink"
                >
                  <Download size={17} aria-hidden="true" />
                  Download CV ({CV.onePage.pages} page)
                </a>
                <a
                  href={CV.full.href}
                  download={CV.full.filename}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 font-medium text-text-primary"
                >
                  <Download size={17} aria-hidden="true" />
                  Full CV ({CV.full.pages} pages)
                </a>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 font-medium text-text-primary"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  Message on WhatsApp
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>

              <div className="mt-8">
                <p id="drawer-theme-label" className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                  Theme
                </p>
                <div role="group" aria-labelledby="drawer-theme-label" className="grid grid-cols-3 gap-2 rounded-xl border border-border p-1">
                  {LOOKS.map(({ id, label }) => {
                    const Icon = LOOK_ICONS[id]
                    const active = look === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setLook(id)}
                        aria-pressed={active}
                        className={cn(
                          'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors',
                          active ? 'bg-surface-2 text-text-primary' : 'text-text-secondary',
                        )}
                      >
                        <Icon size={15} aria-hidden="true" />
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
