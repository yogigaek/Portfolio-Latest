import { useEffect } from 'react'
import { useNavigationType } from 'react-router-dom'
import Topbar from './Topbar'
import Footer from './Footer'
import Hero from '@/components/sections/Hero'
import Outcomes from '@/components/sections/Outcomes'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import WorkExperience from '@/components/sections/WorkExperience'
import TechStack from '@/components/sections/TechStack'
import Services from '@/components/sections/Services'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'

const SCROLL_KEY = 'home-scroll'

export default function MainLayout() {
  const navigationType = useNavigationType()

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = sessionStorage.getItem(SCROLL_KEY)
    } catch {
      // storage unavailable: fall back to hash handling only
    }

    const { hash } = window.location
    const target = hash ? document.getElementById(hash.slice(1)) : null
    let realign: (() => void) | null = null

    if (navigationType === 'POP' && saved !== null) {
      // Back from a project page: the browser's own restore would be capped by the shorter page that was mounted
      const top = Number(saved)
      realign = () => window.scrollTo({ top, behavior: 'instant' })
    } else if (target) {
      // arriving from another route, the target section only exists after this first render
      realign = () => target.scrollIntoView({ behavior: 'instant' })
    }

    // web fonts and late layout reflow the page after mount; re-apply until the visitor takes over
    // (scrollY can't tell who moved it: scroll anchoring also shifts it during the reflow)
    let stopRealign = () => {}
    if (realign) {
      const apply = realign
      const userInput = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
      const timers = [150, 600].map((ms) => window.setTimeout(apply, ms))
      stopRealign = () => {
        timers.forEach((t) => window.clearTimeout(t))
        document.fonts?.removeEventListener('loadingdone', apply)
        window.removeEventListener('load', apply)
        userInput.forEach((type) => window.removeEventListener(type, stopRealign))
      }
      apply()
      document.fonts?.addEventListener('loadingdone', apply)
      window.addEventListener('load', apply, { once: true })
      userInput.forEach((type) => window.addEventListener(type, stopRealign, { once: true, passive: true }))
    }

    const saveScroll = () => {
      try {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
      } catch {
        // ignore
      }
    }
    // scroll fires many times per frame on trackpads; a synchronous storage write per event is wasted work
    let scrollFrame = 0
    const onScroll = () => {
      if (scrollFrame) return
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0
        saveScroll()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    // capture phase runs before the router navigates, so a click right after a scroll still records the final offset
    window.addEventListener('click', saveScroll, true)
    const stopTimer = window.setTimeout(() => stopRealign(), 4000)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(scrollFrame)
      window.removeEventListener('click', saveScroll, true)
      window.clearTimeout(stopTimer)
      stopRealign()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the navigation that mounted the page matters
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Topbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Outcomes />
        <About />
        <Projects />
        <WorkExperience />
        <TechStack />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
