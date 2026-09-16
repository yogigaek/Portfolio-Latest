import type { Config } from 'tailwindcss'

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: token('background'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        tinted: token('tinted'),
        border: {
          DEFAULT: token('border'),
          hover: token('border-hover'),
        },
        accent: {
          DEFAULT: token('accent'),
          hover: token('accent-hover'),
        },
        text: {
          primary: token('text-primary'),
          secondary: token('text-secondary'),
          muted: token('text-muted'),
        },
        metric: token('metric'),
        success: token('success'),
        danger: token('danger'),
        solid: {
          DEFAULT: token('solid'),
          ink: token('solid-ink'),
        },
        shade: token('shadow'),
        term: {
          bg: token('term-bg'),
          fg: token('term-fg'),
          muted: token('term-muted'),
          key: token('term-key'),
          string: token('term-string'),
          metric: token('term-metric'),
          ok: token('term-ok'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      keyframes: {
        pulse_dot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'pulse-dot': 'pulse_dot 1.1s steps(1, end) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
