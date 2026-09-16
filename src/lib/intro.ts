const KEY = 'intro-played'

// decided once at module load, so a StrictMode double-mount cannot consume the intro
function decide() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (sessionStorage.getItem(KEY)) return false
    sessionStorage.setItem(KEY, '1')
    return true
  } catch {
    return false
  }
}

export const PLAY_INTRO = typeof window !== 'undefined' && decide()

export const INTRO_SECONDS = 1.6

// hero copy waits for the sky to start opening before it arrives
export const INTRO_CONTENT_DELAY = PLAY_INTRO ? 0.55 : 0
