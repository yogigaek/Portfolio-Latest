import { useEffect, useRef, useState } from 'react'
import type { Look } from '@/lib/look'
import { INTRO_SECONDS, PLAY_INTRO } from '@/lib/intro'
import { cn } from '@/lib/utils'
import { CLOUD_FRAGMENT_SHADER, COMPOSITE_FRAGMENT_SHADER, FRAGMENT_SHADER, VERTEX_SHADER } from './shader'
import { METEOR_LIFE, orbLayout, startSkyLoop, type SkyFrame } from './loop'

const SKY_UNIFORMS = [
  'uRes', 'uCss', 'uTime', 'uLook', 'uSun', 'uMoon', 'uOrb', 'uPointer', 'uScroll', 'uMeteor', 'uOctaves', 'uIntro', 'uClouds',
] as const
const CLOUD_UNIFORMS = [
  'uRes', 'uCss', 'uTime', 'uLook', 'uSun', 'uMoon', 'uPointer', 'uScroll', 'uIntro', 'uFrame', 'uBlend', 'uSteps', 'uNoise', 'uHistory',
] as const

const NOISE_SIZE = 48
const TIER_KEY = 'sky-tier'
const NOISE_WAIT_MS = 900

type Uniforms<T extends string> = Record<T, WebGLUniformLocation | null>

interface Program<T extends string> {
  program: WebGLProgram
  loc: Uniforms<T>
}

interface Target {
  fb: WebGLFramebuffer
  tex: WebGLTexture
  width: number
  height: number
}

interface Volumetric {
  cloud: Program<(typeof CLOUD_UNIFORMS)[number]>
  composite: Program<(typeof SKY_UNIFORMS)[number]>
  noise: WebGLTexture
  targets: Target[]
  floatTargets: boolean
  scale: number
  steps: number
  read: number
  frame: number
  fresh: boolean
  staticKey: string
  benchmarked: boolean
}

// budget for one cloud pass; the composite pass and the page still need the rest of a 60fps frame
const CLOUD_PASS_BUDGET_MS = 9
const VOLUMETRIC_PRESETS = [
  { scale: 0.5, steps: 30 },
  { scale: 0.36, steps: 22 },
]

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[sky] shader compile failed:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function link<T extends string>(gl: WebGL2RenderingContext, vs: WebGLShader, fsSource: string, names: readonly T[]): Program<T> | null {
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSource)
  const program = gl.createProgram()
  if (!fs || !program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[sky] program link failed:', gl.getProgramInfoLog(program))
    return null
  }
  const loc = Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)])) as Uniforms<T>
  return { program, loc }
}

function createTarget(gl: WebGL2RenderingContext, width: number, height: number, float: boolean): Target | null {
  const tex = gl.createTexture()
  const fb = gl.createFramebuffer()
  if (!tex || !fb) return null
  gl.bindTexture(gl.TEXTURE_2D, tex)
  if (float) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null)
  else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  if (!complete) {
    gl.deleteFramebuffer(fb)
    gl.deleteTexture(tex)
    return null
  }
  return { fb, tex, width, height }
}

function volumetricEligible() {
  try {
    if (sessionStorage.getItem(TIER_KEY) === 'lite') return false
  } catch {
    // storage blocked: just decide from the device
  }
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return !coarse && window.innerWidth >= 1024 && (navigator.hardwareConcurrency ?? 4) >= 4
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

interface GLSkyProps {
  look: Look
  onFail: () => void
}

export default function GLSky({ look, onFail }: GLSkyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lookRef = useRef(look)
  const failRef = useRef(onFail)
  const redrawRef = useRef<() => void>(() => {})
  const [ready, setReady] = useState(false)

  failRef.current = onFail

  useEffect(() => {
    lookRef.current = look
    redrawRef.current()
  }, [look])

  useEffect(() => {
    let dispose: (() => void) | undefined
    let timer = 0
    // after the first paint: context creation and shader compiles block the main thread, and the hero text must not wait on them
    const frame = requestAnimationFrame(() => {
      timer = window.setTimeout(() => {
        dispose = init()
      }, 0)
    })
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      dispose?.()
    }

    function init(): (() => void) | undefined {
      const canvas = canvasRef.current
      const host = canvas?.parentElement
      if (!canvas || !host) return

      const gl = canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
      })
      const vs = gl ? compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER) : null
      const lite = gl && vs ? link(gl, vs, FRAGMENT_SHADER, SKY_UNIFORMS) : null
      if (!gl || !vs || !lite) {
        failRef.current()
        return
      }
      gl.bindVertexArray(gl.createVertexArray())

      const coarse = window.matchMedia('(pointer: coarse)').matches
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      let quality = coarse ? 0.5 : 0.75
      let octaves = coarse ? 4 : 5
      let cssWidth = 0
      let cssHeight = 0
      let slowFrames = 0
      let frameEma = 1 / 60
      let warmFrames = 0
      let heavyFrames = 0
      let introStart = 0
      let layoutWidth = -1
      let layoutHeight = -1
      let layout = orbLayout(0, 0)
      let firstFrame = true
      let eligible = volumetricEligible()
      let noiseData: Uint8Array | null = null
      let vol: Volumetric | null = null
      let worker: Worker | null = null
      const mountedAt = performance.now()

      const applySize = () => {
        canvas.width = Math.max(1, Math.round(cssWidth * dpr * quality))
        canvas.height = Math.max(1, Math.round(cssHeight * dpr * quality))
      }

      const rebuildTargets = (v: Volumetric) => {
        for (const target of v.targets) {
          gl.deleteFramebuffer(target.fb)
          gl.deleteTexture(target.tex)
        }
        const width = Math.max(1, Math.round(cssWidth * v.scale))
        const height = Math.max(1, Math.round(cssHeight * v.scale))
        const a = createTarget(gl, width, height, v.floatTargets)
        const b = createTarget(gl, width, height, v.floatTargets)
        v.targets = a && b ? [a, b] : []
        v.fresh = true
        v.staticKey = ''
        return v.targets.length === 2
      }

      const disposeVolumetric = (remember: boolean) => {
        if (!vol) return
        for (const target of vol.targets) {
          gl.deleteFramebuffer(target.fb)
          gl.deleteTexture(target.tex)
        }
        gl.deleteTexture(vol.noise)
        gl.deleteProgram(vol.cloud.program)
        gl.deleteProgram(vol.composite.program)
        vol = null
        eligible = false
        if (remember) {
          try {
            sessionStorage.setItem(TIER_KEY, 'lite')
          } catch {
            // nothing to remember with
          }
        }
      }

      const initVolumetric = () => {
        if (!noiseData || vol || !eligible || gl.isContextLost()) return
        const cloud = link(gl, vs, CLOUD_FRAGMENT_SHADER, CLOUD_UNIFORMS)
        const composite = link(gl, vs, COMPOSITE_FRAGMENT_SHADER, SKY_UNIFORMS)
        const noise = gl.createTexture()
        if (!cloud || !composite || !noise) {
          eligible = false
          return
        }
        gl.bindTexture(gl.TEXTURE_3D, noise)
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
        gl.texImage3D(gl.TEXTURE_3D, 0, gl.RG8, NOISE_SIZE, NOISE_SIZE, NOISE_SIZE, 0, gl.RG, gl.UNSIGNED_BYTE, noiseData)
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT)

        vol = {
          cloud,
          composite,
          noise,
          targets: [],
          floatTargets: Boolean(gl.getExtension('EXT_color_buffer_float')),
          scale: 0.5,
          steps: 30,
          read: 0,
          frame: 0,
          fresh: true,
          staticKey: '',
          benchmarked: false,
        }
        if (!rebuildTargets(vol)) disposeVolumetric(false)
        warmFrames = 0
        frameEma = 1 / 60
      }

      if (eligible) {
        try {
          worker = new Worker(new URL('./noise.worker.ts', import.meta.url), { type: 'module' })
          worker.onmessage = (event: MessageEvent<Uint8Array>) => {
            noiseData = event.data
            worker?.terminate()
            worker = null
            initVolumetric()
            redrawRef.current()
          }
          worker.onerror = () => {
            eligible = false
            worker?.terminate()
            worker = null
          }
          worker.postMessage(NOISE_SIZE)
        } catch {
          eligible = false
        }
      }

      const setSkyUniforms = (loc: Uniforms<(typeof SKY_UNIFORMS)[number]>, frame: SkyFrame, orbs: Orbs, intro: number) => {
        const { morning, dusk, night } = frame.weights
        gl.uniform2f(loc.uRes, canvas.width, canvas.height)
        gl.uniform2f(loc.uCss, frame.width, frame.height)
        gl.uniform1f(loc.uTime, frame.elapsed)
        gl.uniform3f(loc.uLook, morning, dusk, night)
        gl.uniform2f(loc.uSun, orbs.sunX, orbs.sunY)
        gl.uniform2f(loc.uMoon, orbs.moonX, orbs.moonY)
        gl.uniform1f(loc.uOrb, orbs.scale)
        gl.uniform2f(loc.uPointer, frame.pointer.x, frame.pointer.y)
        gl.uniform1f(loc.uScroll, frame.scroll)
        gl.uniform1i(loc.uOctaves, octaves)
        gl.uniform1f(loc.uIntro, intro)
        const meteor = frame.meteor
        if (meteor) {
          const fade = Math.max(0, 1 - meteor.age / METEOR_LIFE) * night
          gl.uniform4f(loc.uMeteor, meteor.x, frame.height - meteor.y, Math.atan2(-meteor.vy, meteor.vx), fade)
        } else {
          gl.uniform4f(loc.uMeteor, 0, 0, 0, 0)
        }
      }

      type Orbs = { sunX: number; sunY: number; moonX: number; moonY: number; scale: number }

      const renderClouds = (v: Volumetric, frame: SkyFrame, orbs: Orbs, intro: number, blend: number) => {
        const write = v.targets[1 - v.read]
        const read = v.targets[v.read]
        const { loc, program } = v.cloud
        gl.bindFramebuffer(gl.FRAMEBUFFER, write.fb)
        gl.viewport(0, 0, write.width, write.height)
        gl.useProgram(program)
        gl.uniform2f(loc.uRes, write.width, write.height)
        gl.uniform2f(loc.uCss, frame.width, frame.height)
        gl.uniform1f(loc.uTime, frame.elapsed)
        gl.uniform3f(loc.uLook, frame.weights.morning, frame.weights.dusk, frame.weights.night)
        gl.uniform2f(loc.uSun, orbs.sunX, orbs.sunY)
        gl.uniform2f(loc.uMoon, orbs.moonX, orbs.moonY)
        gl.uniform2f(loc.uPointer, frame.pointer.x, frame.pointer.y)
        gl.uniform1f(loc.uScroll, frame.scroll)
        gl.uniform1f(loc.uIntro, intro)
        gl.uniform1i(loc.uFrame, v.frame)
        gl.uniform1f(loc.uBlend, blend)
        gl.uniform1i(loc.uSteps, v.steps)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_3D, v.noise)
        gl.uniform1i(loc.uNoise, 0)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, read.tex)
        gl.uniform1i(loc.uHistory, 1)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        v.read = 1 - v.read
        v.frame += 1
      }

      const draw = (frame: SkyFrame) => {
        if (gl.isContextLost()) return
        const now = performance.now()
        // hold the first frame briefly so the volumetric tier opens the page instead of swapping in later
        if (eligible && !vol && now - mountedAt < NOISE_WAIT_MS) return

        if (!introStart) introStart = now
        const intro = PLAY_INTRO && !frame.reduce ? easeOutCubic(Math.min((now - introStart) / 1000 / INTRO_SECONDS, 1)) : 1

        if (!frame.reduce && frame.interval > 0.6) {
          // a gap this long is a backgrounded or throttled tab resuming, not the GPU struggling
          warmFrames = 0
          heavyFrames = 0
          frameEma = 1 / 60
          slowFrames = 0
        } else if (!frame.reduce && frame.interval > 0) {
          if (vol) {
            warmFrames += 1
            frameEma = frameEma * 0.9 + Math.min(frame.interval, 0.25) * 0.1
            if (warmFrames > 5 && frame.interval > 0.2) heavyFrames += 1
            if (heavyFrames >= 3) {
              disposeVolumetric(true)
            } else if (warmFrames > 45 && frameEma > 1 / 38) {
              warmFrames = 0
              frameEma = 1 / 60
              if (vol.scale > 0.38) {
                vol.scale = 0.36
                if (!rebuildTargets(vol)) disposeVolumetric(false)
              } else if (vol.steps > 20) {
                vol.steps = 20
              } else {
                disposeVolumetric(true)
              }
            }
          } else {
            // clouds are soft, so dropping resolution is the cheapest way to hold the frame rate
            slowFrames = frame.interval > (coarse ? 1 / 22 : 1 / 42) ? slowFrames + 1 : Math.max(0, slowFrames - 1)
            if (slowFrames > 45) {
              slowFrames = 0
              if (quality > 0.34) {
                quality *= 0.8
                applySize()
              } else if (octaves > 3) {
                octaves -= 1
              }
            }
          }
        }

        if (frame.width !== layoutWidth || frame.height !== layoutHeight) {
          layout = orbLayout(frame.width, frame.height)
          layoutWidth = frame.width
          layoutHeight = frame.height
        }
        const { morning, dusk } = frame.weights
        const sunShare = dusk / Math.max(morning + dusk, 1e-3)
        const rise = (1 - intro) * 90
        const orbs: Orbs = {
          sunX: layout.morning.x + (layout.dusk.x - layout.morning.x) * sunShare,
          sunY: frame.height - (layout.morning.y + (layout.dusk.y - layout.morning.y) * sunShare + rise),
          moonX: layout.moon.x,
          moonY: frame.height - (layout.moon.y + rise),
          scale: layout.scale,
        }

        if (vol && !vol.benchmarked) {
          vol.benchmarked = true
          // time real cloud passes once, synchronously, and pick the richest preset the GPU can carry
          // gl.finish() may return before the GPU is done; reading a pixel back cannot
          const sync = (v: Volumetric) => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, v.targets[v.read].fb)
            if (v.floatTargets) gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, new Float32Array(4))
            else gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4))
          }
          let chosen = -1
          for (let i = 0; i < VOLUMETRIC_PRESETS.length && chosen < 0; i++) {
            vol.scale = VOLUMETRIC_PRESETS[i].scale
            vol.steps = VOLUMETRIC_PRESETS[i].steps
            if (!rebuildTargets(vol)) break
            renderClouds(vol, frame, orbs, intro, 1)
            sync(vol)
            const started = performance.now()
            renderClouds(vol, frame, orbs, intro, 1)
            sync(vol)
            renderClouds(vol, frame, orbs, intro, 1)
            sync(vol)
            if ((performance.now() - started) / 2 <= CLOUD_PASS_BUDGET_MS) chosen = i
          }
          if (chosen < 0) disposeVolumetric(true)
          else vol.fresh = true
        }

        if (vol) {
          if (frame.reduce) {
            // no motion to accumulate over time, so converge the static frame up front
            const key = `${frame.width}x${frame.height}:${morning.toFixed(2)}:${dusk.toFixed(2)}`
            if (vol.staticKey !== key) {
              vol.staticKey = key
              for (let i = 0; i < 12; i++) renderClouds(vol, frame, orbs, 1, 1 / (i + 1))
            }
          } else {
            renderClouds(vol, frame, orbs, intro, vol.fresh ? 1 : vol.floatTargets ? 0.22 : 0.32)
            vol.fresh = false
          }

          gl.bindFramebuffer(gl.FRAMEBUFFER, null)
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.useProgram(vol.composite.program)
          setSkyUniforms(vol.composite.loc, frame, orbs, intro)
          gl.activeTexture(gl.TEXTURE2)
          gl.bindTexture(gl.TEXTURE_2D, vol.targets[vol.read].tex)
          gl.uniform1i(vol.composite.loc.uClouds, 2)
        } else {
          gl.bindFramebuffer(gl.FRAMEBUFFER, null)
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.useProgram(lite.program)
          setSkyUniforms(lite.loc, frame, orbs, intro)
        }

        gl.drawArrays(gl.TRIANGLES, 0, 3)
        canvas.dataset.skyTier = vol ? `volumetric:${vol.scale}:${vol.steps}` : 'lite'

        if (firstFrame) {
          firstFrame = false
          setReady(true)
        }
      }

      const onContextLost = (e: Event) => {
        e.preventDefault()
        failRef.current()
      }
      canvas.addEventListener('webglcontextlost', onContextLost)

      const loop = startSkyLoop(host, () => lookRef.current, draw, {
        fps: coarse ? 30 : 60,
        onResize: (width, height) => {
          cssWidth = width
          cssHeight = height
          applySize()
          if (vol && !rebuildTargets(vol)) disposeVolumetric(false)
        },
      })
      redrawRef.current = loop.redraw

      // if the noise never arrives in time, let the lite tier paint instead of leaving the sky blank
      const fallbackTimer = window.setTimeout(() => loop.redraw(), NOISE_WAIT_MS + 50)

      return () => {
        loop.stop()
        window.clearTimeout(fallbackTimer)
        worker?.terminate()
        redrawRef.current = () => {}
        // no loseContext(): a StrictMode remount gets the same canvas back and would inherit a dead context
        canvas.removeEventListener('webglcontextlost', onContextLost)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 h-full w-full transition-opacity duration-700', ready ? 'opacity-100' : 'opacity-0')}
    />
  )
}
