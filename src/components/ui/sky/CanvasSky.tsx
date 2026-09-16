import { useEffect, useRef } from 'react'
import type { Look } from '@/lib/look'
import { cn } from '@/lib/utils'
import { LOOK_KEYS, METEOR_LIFE, orbLayout, startSkyLoop, type SkyFrame } from './loop'

const CLOUD_TINT: Record<Look, [number, number, number]> = {
  morning: [255, 255, 255],
  dusk: [255, 176, 160],
  night: [118, 132, 176],
}

const CLOUD_ALPHA: Record<Look, number> = { morning: 0.92, dusk: 0.5, night: 0.2 }

interface Star {
  x: number
  y: number
  r: number
  phase: number
  speed: number
}

interface Cloud {
  x: number
  y: number
  scale: number
  speed: number
  depth: number
  alpha: number
}

function seeded(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCloudSprite([r, g, b]: [number, number, number]) {
  const canvas = document.createElement('canvas')
  canvas.width = 420
  canvas.height = 180
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  const puffs = [
    [120, 110, 70],
    [190, 90, 85],
    [270, 100, 72],
    [330, 118, 55],
    [80, 125, 50],
    [220, 128, 80],
  ]
  for (const [x, y, radius] of puffs) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
    grad.addColorStop(0, `rgba(${r},${g},${b},0.55)`)
    grad.addColorStop(0.6, `rgba(${r},${g},${b},0.22)`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  return canvas
}

// fallback when WebGL2 is unavailable: sprite clouds, drawn stars, CSS orbs
export default function CanvasSky({ look }: { look: Look }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLCanvasElement>(null)
  const frontRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<HTMLDivElement>(null)
  const morningRef = useRef<HTMLDivElement>(null)
  const duskRef = useRef<HTMLDivElement>(null)
  const moonRef = useRef<HTMLDivElement>(null)
  const lookRef = useRef(look)
  const redrawRef = useRef<() => void>(() => {})

  useEffect(() => {
    lookRef.current = look
    redrawRef.current()
  }, [look])

  useEffect(() => {
    const host = hostRef.current
    const back = backRef.current
    const front = frontRef.current
    const orbs = orbsRef.current
    const bctx = back?.getContext('2d')
    const fctx = front?.getContext('2d')
    if (!host || !back || !front || !orbs || !bctx || !fctx) return

    const sprites = Object.fromEntries(LOOK_KEYS.map((k) => [k, makeCloudSprite(CLOUD_TINT[k])])) as Record<Look, HTMLCanvasElement>
    let stars: Star[] = []
    let clouds: Cloud[] = []

    const onResize = (width: number, height: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      for (const canvas of [back, front]) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
      }
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const layout = orbLayout(width, height)
      const place = (el: HTMLDivElement | null, pos: { x: number; y: number }) => {
        if (!el) return
        el.style.left = `${pos.x}px`
        el.style.top = `${pos.y}px`
        el.style.setProperty('--orb-scale', String(layout.scale))
      }
      place(morningRef.current, layout.morning)
      place(duskRef.current, layout.dusk)
      place(moonRef.current, layout.moon)

      const rand = seeded(7)
      stars = Array.from({ length: Math.round(Math.min(280, (width * height) / 4800)) }, () => ({
        x: rand(),
        y: Math.pow(rand(), 1.6) * 0.8,
        r: rand() < 0.08 ? 1.4 + rand() * 0.6 : 0.4 + rand() * 0.8,
        phase: rand() * Math.PI * 2,
        speed: 0.6 + rand() * 1.8,
      }))
      clouds = Array.from({ length: width < 640 ? 5 : 8 }, (_, i) => ({
        x: rand(),
        y: 0.06 + rand() * 0.5,
        scale: (width < 640 ? 0.55 : 0.8) + rand() * 1.1,
        speed: 4 + rand() * 10,
        depth: i % 2 === 0 ? 0.7 : 1.4,
        alpha: 0.55 + rand() * 0.45,
      }))
    }

    const draw = ({ width, height, elapsed, weights, pointer, scroll, meteor, reduce }: SkyFrame) => {
      orbs.style.transform = `translate3d(${pointer.x * -14}px, ${pointer.y * -10 + scroll * 60}px, 0)`

      bctx.clearRect(0, 0, width, height)
      const starVisibility = weights.night + weights.dusk * 0.3
      if (starVisibility > 0.01) {
        const ox = pointer.x * -4
        const oy = pointer.y * -3 + scroll * 20
        for (const star of stars) {
          const twinkle = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(elapsed * star.speed + star.phase)
          const alpha = starVisibility * twinkle * (1 - star.y / 0.85)
          if (alpha < 0.02) continue
          bctx.globalAlpha = alpha
          bctx.fillStyle = star.r > 1.3 ? '#e6ecff' : '#ffffff'
          bctx.beginPath()
          bctx.arc(star.x * width + ox, star.y * height + oy, star.r, 0, Math.PI * 2)
          bctx.fill()
        }
      }

      if (meteor) {
        const alpha = Math.max(0, 1 - meteor.age / METEOR_LIFE) * weights.night
        const tailX = meteor.x - meteor.vx * 0.14
        const tailY = meteor.y - meteor.vy * 0.14
        const grad = bctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        bctx.globalAlpha = 1
        bctx.strokeStyle = grad
        bctx.lineWidth = 1.4
        bctx.beginPath()
        bctx.moveTo(meteor.x, meteor.y)
        bctx.lineTo(tailX, tailY)
        bctx.stroke()
      }

      fctx.clearRect(0, 0, width, height)
      for (const key of LOOK_KEYS) {
        const weight = weights[key]
        if (weight < 0.01) continue
        const sprite = sprites[key]
        for (const cloud of clouds) {
          const w = sprite.width * cloud.scale
          const h = sprite.height * cloud.scale
          const span = width + w
          const drift = reduce ? 0 : elapsed * cloud.speed
          const x = ((((cloud.x * span + drift) % span) + span) % span) - w + pointer.x * -12 * cloud.depth
          const y = cloud.y * height + pointer.y * -6 * cloud.depth + scroll * 40 * cloud.depth
          fctx.globalAlpha = weight * CLOUD_ALPHA[key] * cloud.alpha
          fctx.drawImage(sprite, x, y, w, h)
        }
      }
      fctx.globalAlpha = 1
    }

    const loop = startSkyLoop(host, () => lookRef.current, draw, { onResize })
    redrawRef.current = loop.redraw

    return () => {
      loop.stop()
      redrawRef.current = () => {}
    }
  }, [])

  return (
    <div ref={hostRef} className="absolute inset-0">
      <canvas ref={backRef} className="absolute inset-0 h-full w-full" />

      <div ref={orbsRef} className="absolute inset-0 will-change-transform">
        <Orb innerRef={morningRef} active={look === 'morning'}>
          <span className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,228,168,0.6),rgba(255,228,168,0)_65%)]" />
          <span className="absolute left-1/2 top-1/2 h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_40%_38%,#fffef8,#fff1c8_55%,#ffd98c)] shadow-[0_0_90px_36px_rgba(255,214,140,0.55)]" />
        </Orb>
        <Orb innerRef={duskRef} active={look === 'dusk'}>
          <span className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,140,90,0.5),rgba(255,94,98,0.14)_45%,rgba(255,94,98,0)_70%)]" />
          <span className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_42%_36%,#ffe9c9,#ffa566_52%,#ee5d3f)] shadow-[0_0_120px_48px_rgba(255,118,72,0.5)]" />
        </Orb>
        <Orb innerRef={moonRef} active={look === 'night'}>
          <span className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(205,218,250,0.2),rgba(205,218,250,0)_62%)]" />
          <span className="absolute left-1/2 top-1/2 h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-full shadow-[inset_22px_-4px_0_0_#eef2fb] [filter:drop-shadow(0_0_22px_rgba(214,226,255,0.55))]" />
        </Orb>
      </div>

      <canvas ref={frontRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}

function Orb({
  innerRef,
  active,
  children,
}: {
  innerRef: React.Ref<HTMLDivElement>
  active: boolean
  children: React.ReactNode
}) {
  return (
    <div
      ref={innerRef}
      style={{ transform: `scale(var(--orb-scale, 1)) translateY(${active ? 0 : 40}px)` }}
      className={cn('absolute h-0 w-0 transition-[opacity,transform] duration-[1400ms] ease-out', active ? 'opacity-100' : 'opacity-0')}
    >
      {children}
    </div>
  )
}
