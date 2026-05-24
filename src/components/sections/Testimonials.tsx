import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { Quote } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/pagination'
import SectionHeader from '@/components/ui/SectionHeader'
import { testimonials } from '@/data'

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Kind Words"
          title="Testimonials"
          subtitle="What colleagues and collaborators say about working with me."
        />

        <div className="max-w-4xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 } }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="pb-12"
            style={{ alignItems: 'stretch' }}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id} style={{ height: 'auto' }}>
                <div className="bg-surface border border-border rounded-2xl p-7 md:p-8 h-full flex flex-col">
                  <Quote
                    size={32}
                    className="text-accent/40 mb-5 flex-shrink-0"
                    strokeWidth={1.5}
                  />

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-amber-400"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed flex-1 italic mb-6">
                    "{t.review}"
                  </p>

                  <div className="flex items-center gap-3 pt-5 border-t border-border">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-accent/20"
                      width={44}
                      height={44}
                      loading="lazy"
                    />
                    <div>
                      <p className="text-text-primary font-semibold text-sm">{t.name}</p>
                      <p className="text-text-muted text-xs">{t.role}</p>
                      <p className="text-accent-hover text-xs font-medium">{t.company}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet {
          background: #6366f1 !important;
          opacity: 0.4;
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </section>
  )
}
