import { defineConfig, createServer, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const alias = { '@': path.resolve(__dirname, './src') }

// Shapes read from src/lib/seo.ts at build time (tsconfig.node.json only covers this file, so they're restated).
type PageHead = Record<'title' | 'description' | 'ogDescription' | 'twitterDescription' | 'url' | 'ogType', string>
type Project = { id: string; experienceId?: string }

// Crawlers and link previews (LinkedIn, Slack) don't run JavaScript, so every project page also gets a static
// copy of index.html with its own title, description and canonical, and the sitemap is written from the same
// project list. Vercel serves these files before the SPA rewrite; ProjectDetail sets the same tags in-app.
// Known cost: loading src/data pulls in its asset imports, so this adds a moment to every build.
function projectPages(): Plugin {
  let config: ResolvedConfig
  let failed = false
  const escape = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return {
    name: 'project-pages',
    apply: 'build',
    configResolved(resolved) {
      config = resolved
    },
    buildEnd(error) {
      failed = !!error
    },
    async closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir)
      const indexPath = path.join(outDir, 'index.html')
      // a failed build never wrote index.html; stay quiet so its real error is the one in the log
      if (failed || !fs.existsSync(indexPath)) return

      const server = await createServer({
        configFile: false,
        root: config.root,
        define: config.define,
        logLevel: 'error',
        appType: 'custom',
        server: { middlewareMode: true, hmr: false },
        resolve: { alias },
      })
      try {
        const { projects } = (await server.ssrLoadModule('/src/data/index.ts')) as { projects: Project[] }
        const seo = await server.ssrLoadModule('/src/lib/seo.ts')
        const template = fs.readFileSync(indexPath, 'utf8')

        const titlePattern = /<title>([^<]*)<\/title>/
        const tagPatterns = (seo.HEAD_TAGS as { field: keyof PageHead; tag: string; key: string; id: string }[]).map(
          (t) => ({
            field: t.field,
            pattern: new RegExp(`(<${t.tag}\\s+${t.key}="${t.id}"\\s+${t.tag === 'link' ? 'href' : 'content'}=")([^"]*)`),
          }),
        )

        // HOME_HEAD (restored by ProjectDetail on the way out) must match what index.html actually ships
        const home = seo.HOME_HEAD as PageHead
        const shipped = [
          { field: 'title' as const, value: template.match(titlePattern)?.[1] },
          ...tagPatterns.map(({ field, pattern }) => ({ field, value: template.match(pattern)?.[2] })),
        ]
        for (const { field, value } of shipped) {
          if (value === undefined) throw new Error(`project-pages: no "${field}" tag found in index.html`)
          if (value !== escape(home[field])) {
            throw new Error(`project-pages: HOME_HEAD.${field} in src/lib/seo.ts differs from index.html`)
          }
        }

        const pages = projects
          .filter((p) => seo.hasProjectPage(p))
          .map((project) => ({ project, head: seo.projectHead(project) as PageHead }))
        for (const { project, head } of pages) {
          // a replacer function, so "$" in a title or description is never read as a replacement pattern
          let html = template.replace(titlePattern, () => `<title>${escape(head.title)}</title>`)
          for (const { field, pattern } of tagPatterns) {
            html = html.replace(pattern, (_, start: string) => `${start}${escape(head[field])}`)
          }
          // projects/<id>.html, served at /projects/<id> through `cleanUrls` in vercel.json (a folder index would
          // depend on how the host treats the missing trailing slash)
          const file = path.join(outDir, `${seo.projectPath(project)}.html`)
          fs.mkdirSync(path.dirname(file), { recursive: true })
          fs.writeFileSync(file, html)
        }

        const urls = [
          { loc: home.url, changefreq: 'monthly', priority: '1.0' },
          ...pages.map(({ project, head }) => ({
            loc: head.url,
            changefreq: 'yearly',
            priority: project.experienceId ? '0.7' : '0.5',
          })),
        ]
        const sitemap = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls.map(
            (u) =>
              `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
          ),
          '</urlset>',
          '',
        ].join('\n')
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
      } finally {
        await server.close()
      }
    },
  }
}

export default defineConfig({
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: false, quality: 80 },
    }),
    projectPages(),
  ],
  resolve: {
    alias,
  },
})
