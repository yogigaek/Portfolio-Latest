import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { ArrowUpRight, CheckCircle2, Send } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'
import Button from '@/components/ui/Button'
import { AVAILABILITY, CONTACT_INFO, EMAILJS_CONFIG, LOCATION, capitalize, whatsappLink } from '@/data'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

const inputClass =
  // 16px on phones: iOS Safari zooms the page when a smaller field is focused
  'w-full rounded-xl border border-border-hover bg-background px-4 py-3 text-base sm:text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors duration-200 hover:border-text-muted focus:border-accent/70 focus:ring-2 focus:ring-accent/50'

const channels = [
  {
    label: 'WhatsApp',
    value: CONTACT_INFO.phone,
    href: whatsappLink(),
    external: true,
  },
  {
    label: 'Email',
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
    external: false,
  },
  {
    label: 'LinkedIn',
    value: CONTACT_INFO.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
    href: CONTACT_INFO.linkedin,
    external: true,
  },
]

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    // `required` accepts whitespace-only values, so blank-looking fields are rejected here
    for (const name of ['from_name', 'message']) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null
      field?.setCustomValidity(field.value.trim() ? '' : 'Please fill out this field.')
    }
    if (!form.reportValidity()) return

    setStatus('sending')
    try {
      await emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, form, {
        publicKey: EMAILJS_CONFIG.publicKey,
      })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-padding border-t border-border section-tinted">
      <div className="container-custom">
        <SectionHeader
          id="contact-title"
          index="08"
          eyebrow="Contact"
          title="Let's talk about your backend role or project"
          subtitle="Reach me directly on WhatsApp or email, or send a message with the form."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <Reveal className="lg:h-full">
            <ul className="flex h-full flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
              {channels.map((channel) => (
                <li key={channel.label} className="flex-1">
                  <a
                    href={channel.href}
                    {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex h-full items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                        {channel.label}
                      </span>
                      <span className="mt-1 block truncate text-sm font-medium text-text-primary">{channel.value}</span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary"
                    />
                    {channel.external && <span className="sr-only">(opens in new tab)</span>}
                  </a>
                </li>
              ))}
              <li className="flex-1 px-5 py-4">
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Location</span>
                <span className="mt-1 block text-sm font-medium text-text-primary">
                  {LOCATION.city}, {LOCATION.country}
                </span>
                <span className="mt-0.5 block text-xs text-text-secondary">
                  {LOCATION.timezoneName} · {LOCATION.timezone} — available for remote collaboration
                </span>
              </li>
              <li className="flex-1 px-5 py-4">
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Open to</span>
                <span className="mt-1 block text-sm font-medium text-text-primary">
                  {capitalize(AVAILABILITY.join(' · '))}
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-surface p-5 sm:p-6 md:p-8"
              aria-describedby="contact-form-note"
              onInput={(e) => {
                const field = e.target as HTMLInputElement
                field.setCustomValidity?.('')
                if (status === 'success' || status === 'error') setStatus('idle')
              }}
            >
              <p id="contact-form-note" className="mb-6 text-sm text-text-secondary">
                All fields are required.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="from_name"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="from_email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell me about the role or project…"
                  className={`${inputClass} resize-y min-h-[140px]`}
                />
              </div>

              <div role="status" aria-live="polite" className="mt-4 empty:hidden">
                {status === 'success' && (
                  <p className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                    <CheckCircle2 size={16} aria-hidden="true" />
                    Message sent — thank you. I&apos;ll get back to you soon.
                  </p>
                )}
              </div>
              <div role="alert" className="mt-4 empty:hidden">
                {status === 'error' && (
                  <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                    Sending failed. Please email{' '}
                    <a href={`mailto:${CONTACT_INFO.email}`} className="underline underline-offset-2">
                      {CONTACT_INFO.email}
                    </a>{' '}
                    or{' '}
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                      message me on WhatsApp
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                    .
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="solid"
                size="lg"
                loading={status === 'sending'}
                className="mt-6 w-full"
              >
                <Send size={16} aria-hidden="true" />
                Send message
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
