import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { Mail, Linkedin, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react'
import GitHubIcon from '@/components/ui/GitHubIcon'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import useInView from '@/hooks/useInView'
import { EMAILJS_CONFIG, CONTACT_INFO } from '@/data'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

const contactOptions = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: CONTACT_INFO.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
    href: CONTACT_INFO.linkedin,
  },
  {
    icon: GitHubIcon,
    label: 'GitHub',
    value: CONTACT_INFO.github.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
    href: CONTACT_INFO.github,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: CONTACT_INFO.phone,
    href: CONTACT_INFO.whatsapp,
  },
]

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<FormStatus>('idle')
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return

    setStatus('sending')
    try {
      await emailjs.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        formRef.current,
        { publicKey: EMAILJS_CONFIG.publicKey },
      )
      setStatus('success')
      formRef.current.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" ref={ref} className="section-padding border-t border-border section-tinted">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Let's Connect"
          title="Get In Touch"
          subtitle="Open to new opportunities — remote. Let's build something great together."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact options */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="mb-6">
              <p className="text-text-secondary text-sm leading-relaxed">
                I'm currently open to backend engineering roles across any domain. If your
                team is building systems that matter, let's talk.
              </p>
            </div>

            {contactOptions.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target={option.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-surface border border-border hover:border-border-hover rounded-2xl p-5 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-200">
                  <option.icon size={18} />
                </div>
                <div>
                  <p className="text-text-muted text-xs font-medium">{option.label}</p>
                  <p className="text-text-primary text-sm font-medium">{option.value}</p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="from_name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full bg-surface border border-border focus:border-accent/60 focus:ring-2 focus:ring-accent/20 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted text-sm outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="from_email"
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="w-full bg-surface border border-border focus:border-accent/60 focus:ring-2 focus:ring-accent/20 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted text-sm outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about the role or project..."
                  className="w-full bg-surface border border-border focus:border-accent/60 focus:ring-2 focus:ring-accent/20 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted text-sm outline-none transition-all duration-200 resize-none"
                />
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <CheckCircle size={16} />
                  Message sent! I'll get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle size={16} />
                  Something went wrong. Please try emailing me directly.
                </div>
              )}

              <Button
                type="submit"
                loading={status === 'sending'}
                disabled={status === 'success'}
                className="w-full"
                size="lg"
              >
                <Send size={16} />
                {status === 'success' ? 'Message Sent!' : 'Send Message'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
