import { CloudSun, Moon, Sun } from 'lucide-react'
import { LOOKS, setLook, useLook, type Look } from '@/lib/look'
import { cn } from '@/lib/utils'

const ICONS: Record<Look, typeof Sun> = { morning: Sun, dusk: CloudSun, night: Moon }

// the swatches stay identical in every look so the control reads as a constant
const SWATCH: Record<Look, string> = {
  morning: 'bg-[radial-gradient(circle_at_32%_28%,#f7f9fa,#f1cf9c)] text-[#7a5a1c]',
  dusk: 'bg-[radial-gradient(circle_at_32%_28%,#ff9d6c,#3a1f3f)] text-white',
  night: 'bg-[radial-gradient(circle_at_32%_28%,#34405a,#070a10)] text-white',
}

export default function LookSwitch({ className }: { className?: string }) {
  const look = useLook()

  return (
    <div
      role="group"
      aria-label="Time of day theme"
      className={cn('items-center gap-1 rounded-full border border-border bg-background/40 p-1 backdrop-blur', className)}
    >
      {LOOKS.map(({ id, label }) => {
        const Icon = ICONS[id]
        const active = look === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setLook(id)}
            aria-pressed={active}
            aria-label={`${label} theme`}
            title={label}
            className={cn(
              'grid h-7 w-7 place-items-center rounded-full transition-[transform,box-shadow] duration-200 hover:scale-110',
              SWATCH[id],
              active ? 'ring-2 ring-accent-hover ring-offset-1 ring-offset-background' : 'opacity-80 hover:opacity-100',
            )}
          >
            <Icon size={13} strokeWidth={2.2} aria-hidden="true" className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]" />
          </button>
        )
      })}
    </div>
  )
}
