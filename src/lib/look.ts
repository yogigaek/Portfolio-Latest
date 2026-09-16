import { useSyncExternalStore } from 'react'

export type Look = 'morning' | 'dusk' | 'night'

export const LOOKS: { id: Look; label: string }[] = [
  { id: 'morning', label: 'Day' },
  { id: 'dusk', label: 'Dusk' },
  { id: 'night', label: 'Night' },
]

const STORAGE_KEY = 'look'
const EVENT = 'lookchange'

function isLook(value: unknown): value is Look {
  return value === 'morning' || value === 'dusk' || value === 'night'
}

// the initial look is stamped on <html> by the inline boot script in index.html
function readLook(): Look {
  const value = document.documentElement.getAttribute('data-look')
  return isLook(value) ? value : 'night'
}

function syncThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]')
  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
  if (meta && rgb) meta.setAttribute('content', `rgb(${rgb.split(/\s+/).join(',')})`)
}

export function setLook(look: Look) {
  const root = document.documentElement
  if (readLook() === look) return

  try {
    localStorage.setItem(STORAGE_KEY, look)
  } catch {
    // private mode or blocked storage: the choice just won't persist
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce) {
    root.classList.add('is-switching')
    window.setTimeout(() => root.classList.remove('is-switching'), 700)
  }

  root.setAttribute('data-look', look)
  syncThemeColor()
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  return () => window.removeEventListener(EVENT, onChange)
}

export function useLook(): Look {
  return useSyncExternalStore(subscribe, readLook, () => 'night')
}

export function initLook() {
  syncThemeColor()
}
