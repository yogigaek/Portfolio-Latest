import { motion } from 'framer-motion'
import { Linkedin, Mail, Download, ArrowRight, MapPin } from 'lucide-react'
import GitHubIcon from '@/components/ui/GitHubIcon'
import Button from '@/components/ui/Button'
import { profileHero, cvPdf, CONTACT_INFO, workExperiences, yearsOfExperience } from '@/data'

const currentJob = workExperiences[0]

function calcYearsDuration(start: string): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const [mon, yr] = start.split(' ')
  const startDate = new Date(parseInt(yr), months.indexOf(mon))
  const now = new Date()
  const totalMonths =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth())
  const years = Math.floor(totalMonths / 12)
  const remaining = totalMonths % 12
  return remaining > 0 ? `${years}+ yr` : `${years} yr`
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/[0.12] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/[0.10] rounded-full blur-3xl pointer-events-none" />
      {/* Radial glow behind name */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-64 bg-accent/[0.06] blur-[80px] pointer-events-none" />

      <div className="container-custom w-full relative z-10">
        {/* pb-28 mobile: clearance for fixed bottom nav (~70px) + extra breathing room */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 pb-28 md:pb-20">

          {/* Left: text */}
          <div className="order-2 lg:order-1">

            {/* Status badges row */}
            <motion.div {...fadeUp(0.1)} className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                Open to New Opportunities
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-muted text-xs border border-border px-3 py-1.5 rounded-full">
                <MapPin size={11} />
                Jakarta, Indonesia · Remote / Hybrid
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.2)}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
            >
              <span className="gradient-text">Muhammad</span>
              <br />
              <span className="gradient-text">Yogi</span>
            </motion.h1>

            <motion.h2
              {...fadeUp(0.3)}
              className="text-text-secondary text-xl md:text-2xl font-medium mb-6"
            >
              Backend Software Engineer
            </motion.h2>

            <motion.p
              {...fadeUp(0.4)}
              className="text-text-secondary text-base md:text-lg leading-relaxed max-w-lg mb-8"
            >
              {yearsOfExperience} years delivering mission-critical financial & healthcare systems at enterprise scale.
              Across cloud-native architectures —{' '}
              <span className="text-text-primary font-medium">150+ production APIs</span>
              {', '}
              <span className="text-text-primary font-medium">50+ system integrations</span>.
            </motion.p>

            {/* Primary CTAs */}
            <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-3 mb-6">
              <Button href={cvPdf} download="CV_Muhammad-Yogi.pdf" size="lg">
                <Download size={18} />
                Download CV
              </Button>
              <Button href="#contact" variant="secondary" size="lg">
                Get In Touch
                <ArrowRight size={18} />
              </Button>
            </motion.div>

            {/* Social links row — GitHub most prominent */}
            <motion.div {...fadeUp(0.6)} className="flex items-center gap-3">
              <a
                href={CONTACT_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center gap-2 bg-surface border border-border hover:border-accent/40 hover:bg-accent/5 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary transition-all duration-200"
              >
                <GitHubIcon size={16} />
                GitHub
              </a>
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center gap-2 bg-surface border border-border hover:border-accent/40 hover:bg-accent/5 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary transition-all duration-200"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                aria-label="Email"
                className="w-10 h-10 rounded-xl border border-border hover:border-border-hover flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-200"
              >
                <Mail size={16} />
              </a>
            </motion.div>
          </div>

          {/* Right: photo */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-accent/20 via-transparent to-purple-600/10 blur-2xl" />
              <div className="relative w-64 h-72 md:w-80 md:h-96 rounded-3xl overflow-hidden border border-accent/20 shadow-2xl shadow-accent/10">
                <img
                  src={profileHero}
                  alt="Muhammad Yogi — Backend Software Engineer"
                  className="w-full h-full object-cover object-top"
                  width={320}
                  height={384}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              {/* Floating: Current Role — hidden on small screens to prevent overflow */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="hidden sm:block absolute -right-4 top-8 bg-surface border border-border rounded-2xl px-4 py-3 shadow-xl"
              >
                <p className="text-xs text-text-muted font-medium">Current Role</p>
                <p className="text-sm text-text-primary font-semibold mt-0.5">PT 360 Teknologi</p>
                <p className="text-xs text-text-secondary">Client: Indogrosir · {calcYearsDuration(currentJob.periodStart)}</p>
              </motion.div>

              {/* Floating: Production APIs — hidden on small screens to prevent overflow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="hidden sm:block absolute -left-4 bottom-12 bg-surface border border-border rounded-2xl px-4 py-3 shadow-xl"
              >
                <p className="text-xs text-text-muted font-medium">Production APIs</p>
                <p className="text-2xl font-display font-bold gradient-text-accent">150+</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
