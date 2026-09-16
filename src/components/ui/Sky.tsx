import { useState } from 'react'
import type { Look } from '@/lib/look'
import GLSky from './sky/GLSky'
import CanvasSky from './sky/CanvasSky'

// painted underneath: what shows before the first WebGL frame lands, and the fallback's base
const SKY_GRADIENT: Record<Look, string> = {
  morning:
    'radial-gradient(circle at 80% 14%, rgba(255,238,196,0.95), rgba(255,238,196,0) 38%), linear-gradient(180deg, #9fc4e3 0%, #c7ddee 34%, #e9e7df 72%, rgb(246 242 234) 100%)',
  dusk:
    'radial-gradient(ellipse 70% 55% at 88% 74%, rgba(255,146,92,0.62), rgba(236,92,104,0.22) 42%, rgba(236,92,104,0) 70%), linear-gradient(180deg, #120a24 0%, #2b1440 34%, #5b2448 64%, rgb(22 14 26) 100%)',
  night:
    'radial-gradient(ellipse 55% 45% at 80% 14%, rgba(118,138,222,0.22), rgba(118,138,222,0) 70%), linear-gradient(180deg, #03050f 0%, #0a0f2a 42%, rgb(8 9 14) 100%)',
}

const LOOK_KEYS: Look[] = ['morning', 'dusk', 'night']

// a feature check only: creating a probe context here would cost a whole extra context; GLSky reports onFail if the real one is refused
function supportsWebGL2() {
  return typeof WebGL2RenderingContext !== 'undefined'
}

export default function Sky({ look }: { look: Look }) {
  const [useGL, setUseGL] = useState(supportsWebGL2)

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {LOOK_KEYS.map((key) => (
        <div
          key={key}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
          style={{ background: SKY_GRADIENT[key], opacity: look === key ? 1 : 0 }}
        />
      ))}

      {useGL ? <GLSky look={look} onFail={() => setUseGL(false)} /> : <CanvasSky look={look} />}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_68%_72%_at_24%_55%,rgb(var(--background)/0.6),rgb(var(--background)/0)_74%)]" />
      {/* Dusk's horizon glow sits behind the lower-left CTA links, beyond the reach of the shelter above */}
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--background)/0)_18%,rgb(var(--background)/0.62)_48%,rgb(var(--background)/0.62)_100%)] transition-opacity lg:bg-[radial-gradient(ellipse_62%_46%_at_22%_80%,rgb(var(--background)/0.72),rgb(var(--background)/0)_78%)] duration-[1200ms] ease-out"
        style={{ opacity: look === 'dusk' ? 1 : 0 }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-background/0 to-background" />
    </div>
  )
}
