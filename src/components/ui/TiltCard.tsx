import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  /** maximum lean in degrees at the card edge */
  amplitude?: number
}

// Leans towards the pointer with a soft glare that follows it. Fine pointers only (touch has no hover to lean into),
// off under reduced motion. Only CSS custom properties are written per frame, so React never re-renders on move.
export default function TiltCard({ children, className, amplitude = 4 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const reduce = useReducedMotion()
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(query.matches)
    update()
    query.addEventListener('change', update)
    return () => {
      query.removeEventListener('change', update)
      cancelAnimationFrame(frame.current)
    }
  }, [])

  const enabled = fine && !reduce

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height
      el.style.setProperty('--ry', `${(x * 2 - 1) * amplitude}deg`)
      el.style.setProperty('--rx', `${(1 - y * 2) * amplitude}deg`)
      el.style.setProperty('--mx', `${x * 100}%`)
      el.style.setProperty('--my', `${y * 100}%`)
    })
  }

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    const el = ref.current
    if (!el) return
    for (const name of ['--rx', '--ry', '--mx', '--my']) el.style.removeProperty(name)
  }

  return (
    <div
      ref={ref}
      onPointerMove={enabled ? onPointerMove : undefined}
      onPointerLeave={enabled ? onPointerLeave : undefined}
      className={cn(
        'group/tilt relative',
        enabled &&
          '[transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-transform duration-200 ease-out',
        className,
      )}
    >
      {children}
      {enabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,0%),rgb(var(--accent)/0.12),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        />
      )}
    </div>
  )
}
