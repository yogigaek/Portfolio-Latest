import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    // the SPA rewrite answers unknown URLs with 200, so keep them out of search results explicitly
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previousRobots = robots?.content
    const previousTitle = document.title
    robots?.setAttribute('content', 'noindex')
    document.title = 'Page not found — Muhammad Yogi'
    return () => {
      if (robots && previousRobots) robots.setAttribute('content', previousRobots)
      document.title = previousTitle
    }
  }, [])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center text-center px-4">
      <div>
        <p className="text-8xl font-mono font-semibold text-accent-hover mb-4">404</p>
        <h1 className="text-2xl font-display font-bold text-text-primary mb-3">Page Not Found</h1>
        <p className="text-text-secondary mb-8">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-solid hover:bg-solid/90 text-solid-ink px-6 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
        >
          Back to Portfolio
        </a>
      </div>
    </main>
  )
}
