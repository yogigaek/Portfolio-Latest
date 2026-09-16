import { Cloud, Compass, Database, Download, LayoutDashboard, MessageCircle, RefreshCw, Server, Workflow, type LucideIcon } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import Button from '@/components/ui/Button'
import TiltCard from '@/components/ui/TiltCard'
import { cn } from '@/lib/utils'
import { CONSULTING_ONEPAGER, services, whatsappLink, workProcess } from '@/data'
import type { ServiceIcon } from '@/types'

const ICONS: Record<ServiceIcon, LucideIcon> = {
  api: Server,
  integration: Workflow,
  cloud: Cloud,
  database: Database,
  modernization: RefreshCw,
  platform: LayoutDashboard,
  consulting: Compass,
}

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-padding border-t border-border section-tinted">
      <div className="container-custom">
        <SectionHeader
          id="services-title"
          index="06"
          eyebrow="Services"
          title="Backend engineering for businesses that need to scale"
          subtitle="Consulting and project work, grounded in the same production systems shown above."
        >
          <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <Button href={CONSULTING_ONEPAGER.en.href} download={CONSULTING_ONEPAGER.en.filename} variant="secondary" size="sm">
              <Download size={15} aria-hidden="true" />
              Download one-pager (PDF)
            </Button>
            <Button href={CONSULTING_ONEPAGER.id.href} download={CONSULTING_ONEPAGER.id.filename} variant="secondary" size="sm">
              <span lang="id">Versi Bahasa Indonesia (PDF)</span>
            </Button>
            <Button
              href={whatsappLink('Hi Yogi, I need backend software built for my business')}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              size="sm"
            >
              <MessageCircle size={15} aria-hidden="true" />
              Chat on WhatsApp
              <span className="sr-only">(opens in new tab)</span>
            </Button>
          </div>
        </SectionHeader>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = ICONS[service.icon]
            // an odd card out spans the last row as a horizontal card instead of leaving a hole in the grid
            const wide = services.length % 3 === 1 && i === services.length - 1
            return (
              <Reveal
                as="li"
                key={service.id}
                delay={Math.min(i, 5) * 0.05}
                className={cn('flex', wide && 'sm:col-span-2 lg:col-span-3')}
              >
                <TiltCard
                  amplitude={wide ? 1.5 : 4}
                  className={cn(
                    'flex w-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-border-hover',
                    wide && 'lg:flex-row lg:items-center lg:gap-8 lg:p-7',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-hover"
                  >
                    <Icon size={18} />
                  </span>
                  <div className={cn('flex flex-1 flex-col', wide && 'lg:flex-none lg:basis-[38%]')}>
                    <h3 className={cn('mt-5 font-display text-lg font-semibold text-text-primary', wide && 'lg:mt-0')}>
                      {service.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{service.description}</p>
                  </div>
                  <p
                    className={cn(
                      'mt-5 flex gap-2 border-t border-border pt-4 text-sm text-text-primary',
                      wide
                        ? 'lg:mt-0 lg:flex-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0'
                        : 'lg:min-h-[5.75rem]',
                    )}
                  >
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-metric" />
                    {service.proof}
                  </p>
                </TiltCard>
              </Reveal>
            )
          })}
        </ul>

        <Reveal className="mt-10 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <h3 className="font-display text-lg font-semibold text-text-primary">How I work</h3>
          <ol className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {workProcess.map((step, i) => (
              <li key={step.title} className="border-t border-border pt-4">
                <span className="font-mono text-xs font-medium text-accent-hover" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="mt-2 text-sm font-semibold text-text-primary">{step.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.description}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
