import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import { AVAILABILITY, LOCATION, getOutcome, profileAbout, quickFacts, workExperiences, yearsOfExperience } from '@/data'

export default function About() {
  const currentJob = workExperiences.find((job) => job.current) ?? workExperiences[0]
  const apis = getOutcome('apis')
  const integrations = getOutcome('integrations')
  const reporting = getOutcome('reporting')

  return (
    <section id="about" aria-labelledby="about-title" className="section-padding border-t border-border section-tinted">
      <div className="container-custom">
        <SectionHeader
          id="about-title"
          index="02"
          eyebrow="About"
          title="Software Engineer — fintech &amp; healthcare"
        />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,280px)_1fr] lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <Reveal>
            <figure className="mx-auto max-w-[220px] md:mx-0 md:max-w-[320px]">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                <img
                  src={profileAbout}
                  alt="Portrait of Muhammad Yogi"
                  className="aspect-square h-full w-full object-cover"
                  width={320}
                  height={320}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted md:text-left">
                {LOCATION.city}, {LOCATION.country} · {LOCATION.timezoneName} ({LOCATION.timezone})
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08} className="space-y-5 text-[15px] leading-relaxed text-text-secondary md:text-base">
            <p className="font-display text-xl leading-snug text-text-primary md:text-2xl">
              Backend Software Engineer ({yearsOfExperience} yrs) building the systems that move money —{' '}
              {apis.value} production APIs and {integrations.value} system integrations across fintech and healthcare.
            </p>
            <p>
              At {currentJob.company}, primary backend engineer for
              {currentJob.client ? ` ${currentJob.client}` : ' the client'} — payment, credit facility, and POS
              systems on AWS Serverless, every integration secured to the partner&apos;s own standard (OAuth 2.0,
              HMAC, JWT, RSA, AES-256), shipped with zero missed deadlines and typically in about half the
              planned time.
            </p>
            <p>
              Core stack is Node.js/NestJS and PHP/Laravel on AWS, with Go. Led the migration of three Lambda
              projects into a single NestJS platform with OpenTelemetry observability, built an internal
              operations platform from scratch (150+ features for 20+ users), and made reporting on a healthcare
              platform {reporting.value} faster through MongoDB query tuning.
            </p>
            <p className="text-text-primary">
              Open to {AVAILABILITY.join(', ')} — from {LOCATION.city} ({LOCATION.timezone}).
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="bg-surface px-5 py-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">{fact.label}</dt>
                <dd className="mt-1.5 text-sm text-text-primary break-words">
                  {fact.href ? (
                    <a
                      href={fact.href}
                      {...(fact.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="-my-3 inline-block py-3 text-accent-hover underline decoration-accent/30 underline-offset-4 hover:decoration-accent-hover"
                    >
                      {fact.value}
                      {fact.href.startsWith('http') && <span className="sr-only"> (opens in new tab)</span>}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
