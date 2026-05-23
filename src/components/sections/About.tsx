import { motion } from 'framer-motion'
import { Zap, Rocket, Link2, CheckCircle2 } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import useInView from '@/hooks/useInView'
import { stats, profileAbout, yearsOfExperience } from '@/data'

const statIcons = [Zap, Rocket, Link2, CheckCircle2]

export default function About() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="about" ref={ref} className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Get To Know"
          title="About Me"
          subtitle="Backend engineer focused on building systems that scale, integrate, and ship — on time, every time."
        />

        {/* Two-column: photo + content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/15 via-transparent to-purple-600/10 blur-2xl" />
              <div className="relative w-72 h-72 lg:w-full lg:h-96 rounded-3xl overflow-hidden border border-accent/20 shadow-2xl shadow-accent/10 bg-gradient-to-b from-accent/10 to-surface">
                <img
                  src={profileAbout}
                  alt="Muhammad Yogi"
                  className="w-full h-full object-cover object-center"
                  width={320}
                  height={320}
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* Stats + Bio */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="bg-surface border border-border rounded-2xl p-4 hover:border-border-hover transition-colors duration-300"
                >
                  {(() => { const Icon = statIcons[i]; return <Icon size={20} className="text-accent mb-2" /> })()}
                  <p className="font-display text-2xl font-bold gradient-text-accent">
                    <AnimatedCounter
                      value={parseInt(stat.value)}
                      suffix={stat.suffix}
                      inView={inView}
                      duration={1200 + i * 150}
                    />
                  </p>
                  <p className="text-text-secondary text-xs font-medium mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Bio */}
            <div className="space-y-4 text-text-secondary text-sm md:text-base leading-relaxed">
              <p>
                Backend Software Engineer with{' '}
                <span className="text-text-primary font-medium">{yearsOfExperience} years</span> building
                mission-critical financial & healthcare systems across cloud-native,
                distributed architectures. Currently at{' '}
                <span className="text-text-primary font-medium">PT 360 Teknologi Indonesia</span>,
                delivering payment platforms, credit facilities, POS integrations, and
                enterprise partner ecosystems for Indogrosir.
              </p>
              <p>
                Passionate about{' '}
                <span className="text-text-primary font-medium">clean architecture</span>,
                performance engineering, and scalable API design. Every project I've
                owned has shipped ahead of schedule.
              </p>
              <p>
                Currently architecting a{' '}
                <span className="text-text-primary font-medium">NestJS platform migration</span>{' '}
                from Lambda microservices — designing the architecture for full platform
                modernization.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
