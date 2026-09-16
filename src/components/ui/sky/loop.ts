import type { Look } from '@/lib/look'

export const LOOK_KEYS: Look[] = ['morning', 'dusk', 'night']

export interface Meteor {
  x: number
  y: number
  vx: number
  vy: number
  age: number
}

export const METEOR_LIFE = 0.9

export interface SkyFrame {
  width: number
  height: number
  dt: number
  // real time since the previous frame, uncapped: dt is clamped for animation, this is for perf monitoring
  interval: number
  elapsed: number
  weights: Record<Look, number>
  pointer: { x: number; y: number }
  scroll: number
  meteor: Meteor | null
  reduce: boolean
}

export interface OrbLayout {
  morning: { x: number; y: number }
  dusk: { x: number; y: number }
  moon: { x: number; y: number }
  scale: number
}

// css px from the hero's top-left; below lg the hero is one tall column of copy, so the orbs pin to the
// top-right corner instead of a percentage that would land behind the headline
export function orbLayout(width: number, height: number): OrbLayout {
  if (width < 1024) {
    return {
      morning: { x: width * 0.86, y: 112 },
      dusk: { x: width * 0.86, y: height * 0.68 },
      moon: { x: width * 0.86, y: 118 },
      scale: width < 768 ? 0.62 : 0.8,
    }
  }
  return {
    morning: { x: width * 0.8, y: height * 0.15 },
    dusk: { x: width * 0.84, y: height * 0.68 },
    moon: { x: width * 0.8, y: height * 0.17 },
    scale: 1,
  }
}

interface LoopOptions {
  fps?: number
  onResize?: (width: number, height: number) => void
}

export function startSkyLoop(
  host: HTMLElement,
  getLook: () => Look,
  draw: (frame: SkyFrame) => void,
  { fps = 60, onResize }: LoopOptions = {},
) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const weights: Record<Look, number> = { morning: 0, dusk: 0, night: 0 }
  weights[getLook()] = 1

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const frame: SkyFrame = {
    width: 0,
    height: 0,
    dt: 0,
    interval: 0,
    elapsed: 0,
    weights,
    pointer: { x: 0, y: 0 },
    scroll: 0,
    meteor: null,
    reduce,
  }

  let nextMeteorAt = 5
  let raf = 0
  let running = false
  let visible = true
  let last = 0
  let sinceDraw = 0
  const frameBudget = 1 / fps

  const step = (dt: number, interval = dt) => {
    frame.interval = interval
    const target = getLook()
    const ease = reduce ? 1 : 1 - Math.exp(-dt * 2.2)
    for (const key of LOOK_KEYS) weights[key] += ((key === target ? 1 : 0) - weights[key]) * ease

    const follow = reduce ? 1 : 1 - Math.exp(-dt * 3)
    pointer.x += (pointer.tx - pointer.x) * follow
    pointer.y += (pointer.ty - pointer.y) * follow

    frame.dt = dt
    frame.elapsed = (frame.elapsed + dt) % 3600
    frame.pointer.x = pointer.x
    frame.pointer.y = pointer.y
    frame.scroll = Math.min(window.scrollY / Math.max(frame.height, 1), 1)

    if (!reduce && weights.night > 0.7) {
      if (!frame.meteor && frame.elapsed > nextMeteorAt) {
        frame.meteor = {
          x: frame.width * (0.35 + Math.random() * 0.5),
          y: frame.height * (0.04 + Math.random() * 0.16),
          vx: -(520 + Math.random() * 260),
          vy: 200 + Math.random() * 120,
          age: 0,
        }
      }
      if (frame.meteor) {
        frame.meteor.age += dt
        frame.meteor.x += frame.meteor.vx * dt
        frame.meteor.y += frame.meteor.vy * dt
        if (frame.meteor.age > METEOR_LIFE) {
          frame.meteor = null
          nextMeteorAt = frame.elapsed + 6 + Math.random() * 8
        }
      }
    } else {
      frame.meteor = null
    }

    draw(frame)
  }

  const loop = (now: number) => {
    raf = window.requestAnimationFrame(loop)
    const dt = (now - last) / 1000
    last = now
    sinceDraw += dt
    // small tolerance so a 60Hz display is not throttled to 30fps by rAF jitter
    if (sinceDraw + 0.002 < frameBudget) return
    step(Math.min(sinceDraw, 0.05), sinceDraw)
    sinceDraw = 0
  }

  const start = () => {
    if (running || reduce || !visible || document.hidden) return
    running = true
    last = performance.now()
    sinceDraw = frameBudget
    raf = window.requestAnimationFrame(loop)
  }

  const stop = () => {
    running = false
    window.cancelAnimationFrame(raf)
  }

  const resize = () => {
    const rect = host.getBoundingClientRect()
    frame.width = rect.width
    frame.height = rect.height
    onResize?.(rect.width, rect.height)
    step(reduce ? 1 : 0)
  }

  const onPointerMove = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  }

  const onScroll = () => {
    if (reduce) step(1)
  }

  const onVisibility = () => (document.hidden ? stop() : start())

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
    else stop()
  })
  intersection.observe(host)

  if (finePointer && !reduce) window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)

  resize()
  start()

  return {
    redraw: () => {
      if (reduce) step(1)
    },
    stop: () => {
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    },
  }
}
