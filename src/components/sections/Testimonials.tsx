import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import { testimonials } from '@/data'

export default function Testimonials() {
  return (
    <section id="recommendations" aria-labelledby="recommendations-title" className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeader
          id="recommendations-title"
          index="07"
          eyebrow="Recommendations"
          title="Recommendations from colleagues and peers"
          subtitle="From LinkedIn."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-7 md:p-8">
                <span aria-hidden="true" className="font-display text-5xl leading-none text-accent/50">
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-text-primary md:text-base">
                  {t.review}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                  <img
                    src={t.avatar}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover ring-1 ring-border-hover"
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-text-primary">{t.name}</span>
                    <span className="text-xs text-text-muted">
                      {t.role} · {t.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
