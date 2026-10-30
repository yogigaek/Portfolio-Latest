// Renders public/og-image.png (1200×630 link preview). Run: npm run og-image
import { chromium } from 'playwright'

const OUT = new URL('../../public/og-image.png', import.meta.url).pathname
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #0a0a0a; font-family: 'Inter', sans-serif;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; }
  h1 { color: #fafafa; font-size: 92px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
  .role { margin-top: 30px; color: #6366f1; font-size: 46px; font-weight: 400; }
  .facts { margin-top: 44px; color: #71717a; font-size: 30px; }
  .url { position: absolute; bottom: 40px; color: #6366f1; font-size: 24px; }
</style></head><body>
  <h1>Muhammad Yogi</h1>
  <p class="role">Backend / Full-Stack Engineer</p>
  <p class="facts">4+ Years · 150+ APIs · 50+ Integrations</p>
  <p class="url">muhammadyogi.vercel.app</p>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: OUT })
await browser.close()
console.log('og-image ->', OUT)
