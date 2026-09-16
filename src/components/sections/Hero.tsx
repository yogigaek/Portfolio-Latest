import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowUpRight, Download, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Sky from '@/components/ui/Sky'
import { useLook } from '@/lib/look'
import { INTRO_CONTENT_DELAY } from '@/lib/intro'
import {
  AVAILABILITY,
  CONSULTING_ONEPAGER,
  CORE_STACK,
  CONTACT_INFO,
  LOCATION,
  CV,
  getOutcome,
  whatsappLink,
  workExperiences,
  yearsOfExperience,
} from '@/data'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: delay + INTRO_CONTENT_DELAY, ease: [0.22, 1, 0.36, 1] },
})

const REST_TILT = { x: 2, y: -6 }

export default function Hero() {
  const reduce = useReducedMotion()
  const look = useLook()
  const [canTilt, setCanTilt] = useState(false)
  const rotateX = useSpring(useMotionValue(REST_TILT.x), { stiffness: 120, damping: 18 })
  const rotateY = useSpring(useMotionValue(REST_TILT.y), { stiffness: 120, damping: 18 })

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
    const update = () => setCanTilt(query.matches && !reduce)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [reduce])

  const apis = getOutcome('apis')
  const integrations = getOutcome('integrations')
  const reporting = getOutcome('reporting')
  const projects = getOutcome('projects')
  const currentJob = workExperiences.find((job) => job.current) ?? workExperiences[0]

  const proofList = workExperiences.flatMap((job) =>
    job.client ? [job.company, `${job.client} (client)`] : [job.company],
  )

  // pointermove can fire far above 60Hz; coalesce to one layout read per frame
  const tiltFrame = useRef(0)
  useEffect(() => () => cancelAnimationFrame(tiltFrame.current), [])

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!canTilt || tiltFrame.current) return
    const target = e.currentTarget
    const { clientX, clientY } = e
    tiltFrame.current = requestAnimationFrame(() => {
      tiltFrame.current = 0
      const rect = target.getBoundingClientRect()
      const dx = ((clientX - rect.left) / rect.width) * 2 - 1
      const dy = ((clientY - rect.top) / rect.height) * 2 - 1
      rotateY.set(REST_TILT.y + dx * 5)
      rotateX.set(REST_TILT.x - dy * 4)
    })
  }

  const onPointerLeave = () => {
    cancelAnimationFrame(tiltFrame.current)
    tiltFrame.current = 0
    rotateX.set(REST_TILT.x)
    rotateY.set(REST_TILT.y)
  }

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      <Sky look={look} />

      <div className="container-custom relative z-10 flex w-full flex-1 flex-col justify-center">
        <div className="grid grid-cols-1 items-center gap-14 py-14 md:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div>
            <motion.div
              {...fadeUp(0.05)}
              className="mb-8 flex items-start gap-3 font-mono text-[11px] leading-relaxed text-text-secondary sm:text-xs"
            >
              <span className="relative mt-[0.45em] flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {/* one flowing line: a non-breaking space keeps every "·" attached to the phrase before it */}
              <p>
                {[`${LOCATION.city}, ${LOCATION.country} (${LOCATION.timezone})`, ...AVAILABILITY.map((item, i) => (i === 0 ? `open to ${item}` : item))].map((item, i) => (
                  <span key={item}>
                    {i > 0 && <span aria-hidden="true" className="text-text-muted">{'\u00a0· '}</span>}
                    {item}
                  </span>
                ))}
              </p>
            </motion.div>

            <h1 id="hero-title" className="font-display">
              <motion.span
                {...fadeUp(0.12)}
                className="mb-5 block font-mono text-xs font-medium uppercase tracking-[0.32em] text-accent-hover"
              >
                Muhammad Yogi
              </motion.span>
              <motion.span
                {...fadeUp(0.2)}
                // Chrome skips opacity:0 elements as LCP candidates; this is the page's LCP text
                initial={{ opacity: 0.01, y: 20 }}
                className="block text-balance text-[1.95rem] font-bold leading-[1.08] tracking-tight text-text-primary sm:text-[2.6rem] lg:text-[3.1rem] [@media(max-height:500px)]:text-[1.95rem]"
              >
                Backend systems for fintech &amp; healthcare,{' '}
                <span className="text-metric">{apis.value} production APIs</span>
              </motion.span>
              <motion.span
                {...fadeUp(0.28)}
                className="mt-3 block text-lg font-semibold leading-tight tracking-tight text-text-secondary sm:text-2xl"
              >
                built from architecture to production.
              </motion.span>
            </h1>

            <motion.p {...fadeUp(0.36)} className="mt-7 text-base font-medium text-text-primary sm:text-lg">
              {/* a non-breaking space before each separator keeps a wrapped line from starting with "·" */}
              Backend Software Engineer&nbsp;<span className="text-text-muted" aria-hidden="true">·</span>{' '}
              {yearsOfExperience} years&nbsp;<span className="text-text-muted" aria-hidden="true">·</span> Fintech &amp; Healthcare
            </motion.p>

            <motion.p {...fadeUp(0.42)} className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary sm:text-base">
              Primary backend engineer for {projects.value} financial service systems at {currentJob.company}
              {'\u00a0· '}
              {integrations.value} system integrations
              {'\u00a0· '}
              {reporting.value} faster reporting on a healthcare platform
            </motion.p>

            <motion.div {...fadeUp(0.5)} className="mt-9 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
              <Button href={CV.onePage.href} download={CV.onePage.filename} variant="solid" size="lg">
                <Download size={18} aria-hidden="true" />
                Download CV ({CV.onePage.pages} page)
              </Button>
              <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
                <MessageCircle size={18} aria-hidden="true" />
                Message on WhatsApp
                <span className="sr-only">(opens in new tab)</span>
              </Button>
            </motion.div>

            <motion.ul {...fadeUp(0.58)} className="mt-3 flex flex-wrap items-center gap-x-5 font-mono text-xs">
              <li>
                <a
                  href={CV.full.href}
                  download={CV.full.filename}
                  className="inline-flex min-h-11 items-center gap-1 text-text-secondary underline decoration-border-hover underline-offset-4 transition-colors hover:text-text-primary hover:decoration-accent-hover"
                >
                  Full CV ({CV.full.pages} pages)
                  <Download size={13} aria-hidden="true" />
                </a>
              </li>
              {[
                { label: 'GitHub', href: CONTACT_INFO.github },
                { label: 'GitLab', href: CONTACT_INFO.gitlab },
                { label: 'LinkedIn', href: CONTACT_INFO.linkedin },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 text-text-secondary underline decoration-border-hover underline-offset-4 transition-colors hover:text-text-primary hover:decoration-accent-hover"
                  >
                    {link.label}
                    <ArrowUpRight size={13} aria-hidden="true" />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="inline-flex min-h-11 items-center text-text-secondary underline decoration-border-hover underline-offset-4 transition-colors hover:text-text-primary hover:decoration-accent-hover"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
            </motion.ul>

            <motion.p {...fadeUp(0.64)} className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
              Scaling a business and need software built?{' '}
              <a
                href="#services"
                className="-my-3 inline-block whitespace-nowrap py-3 font-medium text-accent-hover underline decoration-accent/40 underline-offset-4 transition-colors hover:text-text-primary"
              >
                See services &amp; proven outcomes <span aria-hidden="true">→</span>
              </a>
              <br />
              <a
                href={CONSULTING_ONEPAGER.en.href}
                download={CONSULTING_ONEPAGER.en.filename}
                className="-my-3 inline-block whitespace-nowrap py-3 font-medium text-accent-hover underline decoration-accent/40 underline-offset-4 transition-colors hover:text-text-primary"
              >
                Consulting one-pager (PDF)
              </a>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 + INTRO_CONTENT_DELAY * 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              style={canTilt ? { rotateX, rotateY, transformPerspective: 1400 } : undefined}
              className="w-full max-w-[460px]"
            >
              <TerminalCard animate={!reduce} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom relative z-10 w-full pb-10">
        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:gap-8">
          <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
            Production systems built at
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {proofList.map((name) => (
              <li key={name} className="font-display text-sm font-semibold text-text-secondary sm:text-base">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const COMMAND = 'curl -i muhammadyogi.vercel.app/whoami.json'
// on the narrowest phones the command wraps; let it break before the path, never inside a word
const COMMAND_BREAK = COMMAND.indexOf('/whoami')

const k = (text: string) => <span className="text-term-key">&quot;{text}&quot;</span>
const s = (text: string) => <span className="text-term-string">&quot;{text}&quot;</span>
const p = (text: string) => <span className="text-term-muted">{text}</span>
const m = (text: string) => <span className="text-term-metric">&quot;{text}&quot;</span>

// pretty-prints a JSON array across short rows so every line fits a 320px-wide terminal
function arrayLines(key: string, items: string[], firstRow: number, rowSize: number, value: (text: string) => React.ReactNode) {
  const rows = [items.slice(0, firstRow)]
  for (let i = firstRow; i < items.length; i += rowSize) rows.push(items.slice(i, i + rowSize))
  const indent = ' '.repeat(key.length + 7)

  return rows.map((row, r) => (
    <>
      {r === 0 ? <>  {k(key)}{p(': [')}</> : indent}
      {row.map((item, i) => (
        <span key={item}>
          {i > 0 && ' '}
          {value(item)}
          {i < row.length - 1 || r < rows.length - 1 ? p(',') : p('],')}
        </span>
      ))}
    </>
  ))
}

function TerminalCard({ animate }: { animate: boolean }) {
  const apis = getOutcome('apis')
  const integrations = getOutcome('integrations')

  const lines: React.ReactNode[] = [
    <><span className="text-term-muted">HTTP/1.1</span> <span className="text-term-ok">200 OK</span></>,
    <span className="text-term-muted">content-type: application/json</span>,
    <>&nbsp;</>,
    p('{'),
    <>  {k('name')}{p(':')} {s('Muhammad Yogi')}{p(',')}</>,
    <>  {k('role')}{p(':')} {s('backend software engineer')}{p(',')}</>,
    <>  {k('location')}{p(':')} {s(`${LOCATION.city}, ${LOCATION.countryCode} · ${LOCATION.timezone}`)}{p(',')}</>,
    ...arrayLines('core', CORE_STACK, 1, 2, s),
    ...arrayLines('domains', ['fintech', 'healthcare'], 1, 1, s),
    ...arrayLines('scale', [`${apis.value} APIs`, `${integrations.value} integrations`], 1, 1, m),
    <>  {k('status')}{p(':')} <span className="text-term-ok">&quot;open_to_opportunities&quot;</span></>,
    p('}'),
  ]

  const [typed, setTyped] = useState(animate ? 0 : COMMAND.length)
  const [shown, setShown] = useState(animate ? 0 : lines.length)
  const lineCount = lines.length

  useEffect(() => {
    if (!animate) {
      setTyped(COMMAND.length)
      setShown(lineCount)
      return
    }

    setTyped(0)
    setShown(0)
    const typingStart = 500 + INTRO_CONTENT_DELAY * 1600
    const timers: number[] = []
    for (let i = 1; i <= COMMAND.length; i++) {
      timers.push(window.setTimeout(() => setTyped(i), typingStart + i * 24))
    }
    const responseStart = typingStart + COMMAND.length * 24 + 220
    for (let i = 1; i <= lineCount; i++) {
      timers.push(window.setTimeout(() => setShown(i), responseStart + i * 65))
    }
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [animate, lineCount])

  const done = shown >= lineCount

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent/25 via-transparent to-accent/10 blur-2xl" />
      <div
        role="img"
        aria-label={`Terminal: curl muhammadyogi.vercel.app/whoami.json returns a JSON profile — Muhammad Yogi, backend software engineer in ${LOCATION.city}, ${LOCATION.country} (${LOCATION.timezone}); core stack ${CORE_STACK.join(', ')}; fintech and healthcare; ${apis.value} APIs and ${integrations.value} integrations; open to ${AVAILABILITY.join(', ')}.`}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-term-bg/90 shadow-[0_40px_100px_-30px_rgb(var(--shadow)/0.7)] ring-1 ring-black/5 backdrop-blur-md"
      >
        <div aria-hidden="true" className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[11px] text-term-muted">yogi@{LOCATION.city.toLowerCase()}:~</span>
        </div>

        <pre aria-hidden="true" className="overflow-hidden whitespace-pre px-4 py-5 font-mono sm:px-5 text-[11px] leading-[1.85] text-term-fg sm:text-[12.5px]">
          <code>
            {/* the full command is laid out invisibly so a wrap on 320px screens is reserved before typing starts */}
            <span className="relative block whitespace-pre-wrap">
              <span className="invisible">
                $ {COMMAND.slice(0, COMMAND_BREAK)}
                <wbr />
                {COMMAND.slice(COMMAND_BREAK)}
              </span>
              <span className="absolute inset-0">
                <span className="text-term-muted">$</span> {COMMAND.slice(0, Math.min(typed, COMMAND_BREAK))}
                {typed > COMMAND_BREAK && (
                  <>
                    <wbr />
                    {COMMAND.slice(COMMAND_BREAK, typed)}
                  </>
                )}
                {typed < COMMAND.length && <Cursor />}
              </span>
            </span>
            {lines.map((line, i) => (
              <span
                key={i}
                className={`block transition-opacity duration-300 ${i < shown ? 'opacity-100' : 'opacity-0'}`}
              >
                {line}
              </span>
            ))}
            <span className={`block transition-opacity duration-300 ${done ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-term-muted">$</span> <Cursor />
            </span>
          </code>
        </pre>
      </div>
    </div>
  )
}

function Cursor() {
  return <span className="inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-pulse-dot bg-term-key" />
}
