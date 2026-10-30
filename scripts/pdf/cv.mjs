// Builds both CVs from portfolio data (src/data/index.ts + the user's previous CV). No invented facts.
// Run: npm run cv (optional output folder as the first argument). Exits 1 when a check below fails.
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const OUT_DIR = process.argv[2] || new URL('../../public', import.meta.url).pathname

// labels, not raw URLs: the link targets stay clickable in the PDF
const contact = [
  ['Pekanbaru, Indonesia (UTC+7)', null],
  ['Email', 'mailto:yogikgaek@gmail.com'],
  ['WhatsApp', 'https://wa.me/6282169713434'],
  ['LinkedIn', 'https://www.linkedin.com/in/yogigaek'],
  ['GitHub', 'https://github.com/yogigaek'],
  ['GitLab', 'https://gitlab.com/yogigaek'],
  ['LeetCode', 'https://leetcode.com/u/yogigaek/'],
  ['Portfolio', 'https://muhammadyogi.vercel.app'],
]

const link = (text, href) => (href ? `<a href="${href}">${text}</a>` : `<span>${text}</span>`)

// typography measured from a reference CV (LibreOffice export): 11pt Liberation Serif body (Times metrics),
// 12pt section heads, 16pt name, bullets hanging at 18pt/33pt. The full CV uses the same layout scaled down.
const page = (title, body, variant) => {
  const k = variant === 'one' ? 1 : 0.93
  const pt = (n) => `${(n * k).toFixed(2)}pt`
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title>
<style>
  @page { size: A4; margin: ${variant === 'one' ? '28pt 42.8pt 24pt' : '30pt 42.8pt 30pt'}; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; }
  body { margin: 0; font-family: 'Times New Roman', Times, serif; color: #000; font-size: ${pt(11)}; line-height: ${pt(15)}; }
  a { color: #1155cc; text-decoration: underline; text-decoration-thickness: 0.5pt; text-underline-offset: 1.2pt; white-space: nowrap; }
  header { text-align: center; }
  h1 { margin: 0; font-size: ${pt(16)}; line-height: ${pt(19)}; font-weight: 700; text-transform: uppercase; }
  .headline { font-size: ${pt(11)}; line-height: ${pt(14)}; }
  .contact { font-size: ${pt(11)}; line-height: ${pt(15)}; }
  .contact > * + *::before { content: ' • '; white-space: pre; color: #000; display: inline-block; }
  h2 { margin: ${pt(variant === 'one' ? 11 : 8)} 0 ${pt(5)}; padding-bottom: ${pt(1.5)}; border-bottom: ${pt(1)} solid #000; font-size: ${pt(12)}; line-height: ${pt(14)};
       font-weight: 700; text-transform: uppercase; break-after: avoid; }
  p { margin: 0; text-align: justify; }
  .job { break-inside: avoid-page; }
  .job + .job { margin-top: ${variant === 'one' ? 0 : pt(4)}; }
  .summary { text-align: left; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: ${pt(12)}; line-height: ${pt(12.8)}; }
  .org { font-weight: 700; text-transform: uppercase; }
  .client { font-weight: 400; text-transform: none; }
  .where { font-weight: 700; font-size: ${pt(10)}; color: #666; text-transform: uppercase; white-space: nowrap; }
  .role { font-weight: 700; }
  .role i { font-weight: 700; }
  .when { font-weight: 700; white-space: nowrap; }
  ul { list-style: none; margin: ${pt(1)} 0 0; padding-left: ${pt(18)}; }
  /* hanging bullet kept in the text flow: an absolutely placed one is written after all other text, so ATS read each job's bullets after the next heading */
  li { padding-left: ${pt(15.2)}; text-indent: ${pt(-15.2)}; line-height: ${pt(15)}; }
  li::before { content: '●'; display: inline-block; width: ${pt(15.2)}; text-indent: 0; line-height: 1; font-family: Arial, Helvetica, sans-serif; font-size: ${pt(10)}; }
  .skills { display: grid; grid-template-columns: ${pt(72)} 1fr; line-height: ${pt(12.75)}; }
  .skills b { font-weight: 700; }
  .skills > span { display: flex; }
  /* its own flex item: a wrapped value lines up under the first word, not under the colon */
  .skills > span::before { content: ': '; white-space: pre; flex: none; }
  .stack { font-size: ${pt(10)}; color: #333; line-height: ${pt(13)}; }
  .nobreak { white-space: nowrap; }
</style></head><body>${body}</body></html>`
}

const header = (headline) => `<header>
  <h1>Muhammad Yogi</h1>
  ${headline ? `<div class="headline">${headline}</div>` : ''}
  <div class="contact">${contact.map(([t, h]) => link(t, h)).join('')}</div>
</header>`

const job = ({ org, where, role, when, bullets, stack }) => `<div class="job">
  <div class="row"><span class="org">${org}</span><span class="where">${where}</span></div>
  <div class="row"><span class="role">${role}</span><span class="when">${when}</span></div>
  <ul>${bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
  ${stack ? `<div class="stack"><b>Stack:</b> ${stack}</div>` : ''}
</div>`

const skills = (rows) => `<div class="skills">${rows.map(([k, v]) => `<b>${k}</b><span><span>${v}</span></span>`).join('')}</div>`

// ---------------------------------------------------------------- 1 page
const one = page(
  'Muhammad Yogi — Backend / Full-Stack Engineer — CV',
  `${header('Backend / Full-Stack Engineer | Fintech &amp; Healthcare | Node.js · NestJS · PHP/Laravel · Go · Python · AWS')}
<h2>Summary</h2>
<p class="summary">Backend / Full-Stack Engineer with 4+ years building production systems that move money: 150+ APIs and 50+ system
integrations across fintech and healthcare. Backend engineer for 10+ financial service projects on AWS Serverless
(Node.js/NestJS, PHP/Laravel). Led a <span class="nobreak">Lambda-to-NestJS</span> platform migration, built an internal operations platform from
scratch, and made healthcare reporting 700% faster. Open to full-time backend and <span class="nobreak">full-stack</span> roles and consulting.</p>

<h2>Experience</h2>
${job({
  org: 'PT 360 Teknologi Indonesia <span class="client">· Client: Indogrosir</span>',
  where: 'Jakarta, ID (Remote)',
  role: 'Backend Software Engineer | Full-time',
  when: 'Jun 2023 – Present',
  bullets: [
    'Owned 10+ financial service projects end to end, typically shipped in about half the planned time',
    'Engineered 100+ production REST APIs in Node.js/TypeScript on AWS Lambda, SQS, SNS, and S3',
    'Architected event-driven payment systems on AWS Serverless with RabbitMQ for high throughput',
    'Integrated 40+ banks and partners with zero missed deadlines (OAuth 2.0, HMAC, JWT, AES-256)',
    'Led migration of 3 Lambda projects into one NestJS platform: 50+ APIs rebuilt, OpenTelemetry added',
    'Built the settlement pipeline: API Gateway, Lambda, PostgreSQL, bank APIs, S3, and MFT file exchange',
    'Built 2 internal platforms from scratch (Laravel, React), incl. a payment integration platform',
    'Refactored 10+ legacy services to clean architecture, improving testability and reliability',
    'Backed services with Jest/Supertest tests, k6 load tests, and Prometheus/Grafana monitoring',
  ],
})}
${job({
  org: 'PT Teknologi Media Medika (Assist.id)',
  where: 'Pekanbaru, ID (On-site)',
  role: 'Backend Software Engineer | Full-time',
  when: 'Jul 2022 – Apr 2023',
  bullets: [
    'Made reporting 700% faster by rewriting MongoDB aggregation pipelines with materialized views',
    'Built 50+ REST APIs for the AUDY healthcare platform (Node.js, LoopBack, Express.js, MongoDB)',
    'Automated cleanup of 10,000+ appointment records with zero data loss, removing manual work',
    'Integrated 10+ third-party services (insurance, notifications); resolved 30+ production issues',
    'Refactored legacy backend modules, improving maintainability and deployment reliability',
  ],
})}

<h2>Skills</h2>
${skills([
  ['Languages', 'TypeScript/JavaScript, PHP, Go (Golang), Python'],
  ['Backend', 'Node.js, NestJS, Express.js, Laravel, LoopBack, Lambda Function'],
  ['DevOps/Cloud', 'AWS (Lambda, SQS, SNS, API Gateway, S3, ECR), Serverless, Docker, Kubernetes, CI/CD'],
  ['Databases', 'PostgreSQL, MySQL, MongoDB, Redis, Prisma ORM, query optimization, schema design'],
  ['Messaging', 'RabbitMQ, WebSocket, webhooks, MFT file exchange'],
  ['Architecture', 'REST API design, microservices, event-driven, clean architecture, distributed systems'],
  ['Security', 'OAuth 2.0, JWT (RS256), HMAC-SHA256, RSA, AES-256-GCM'],
  ['Testing', 'Jest, Supertest, k6, Postman, Swagger/OpenAPI'],
  ['Tools', 'OpenTelemetry, Prometheus &amp; Grafana, CloudWatch, Git, <span class="nobreak">AI-assisted</span> development'],
  ['Frontend', 'React, React Native (Expo), Inertia.js, Tailwind CSS, Material UI'],
])}

<h2>Education</h2>
<div class="job">
  <div class="row"><span class="org">Universitas Lancang Kuning</span><span class="where">Pekanbaru, ID</span></div>
  <div class="row"><span class="role"><i>Bachelor of Computer Science, Informatics Engineering</i></span><span class="when">2017 – 2021</span></div>
</div>
<div class="job">
  <div class="row"><span class="org">Eduwork</span><span class="where">Yogyakarta, ID</span></div>
  <div class="row"><span class="role"><i>Full-Stack Web Development Bootcamp (MERN, REST APIs)</i></span><span class="when">Jan 2022 – Jul 2022</span></div>
</div>

<h2>Projects</h2>
<ul>
  <li><b>Enterprise case studies (NDA)</b>: NestJS migration, serverless payments, operations platform — ${link('Portfolio', 'https://muhammadyogi.vercel.app')}</li>
  <li><b>Rakit (NestJS, React, React Native)</b>: e-bike store, 3D configurator, Android app — ${link('Live demo', 'https://yogi-store.vercel.app')} · ${link('GitHub', 'https://github.com/yogigaek/gear-store')}</li>
  <li><b>Webhook Relay (Go)</b>: idempotent payment webhooks, HMAC, retries, dead-letter — ${link('GitHub', 'https://github.com/yogigaek/webhook-relay')}</li>
  <li><b>Problem solving</b>: 200+ algorithm challenges on LeetCode, HackerRank, and Codeforces — ${link('LeetCode', 'https://leetcode.com/u/yogigaek/')}</li>
</ul>`,
  'one',
)

// ---------------------------------------------------------------- full
const full = page(
  'Muhammad Yogi — Backend / Full-Stack Engineer — CV (full)',
  `${header('Backend / Full-Stack Engineer | Fintech &amp; Healthcare | Node.js · NestJS · PHP/Laravel · Go · Python · AWS')}
<h2>Summary</h2>
<p class="summary">Backend / Full-Stack Engineer with 4+ years building production systems that move money: 150+ APIs and 50+ system
integrations across fintech and healthcare. Backend engineer for 10+ financial service projects on AWS Serverless
(Node.js/NestJS, PHP/Laravel), with 40+ bank and partner integrations and zero missed deadlines. Led a
<span class="nobreak">Lambda-to-NestJS</span> platform migration, built an internal operations platform from scratch, and made healthcare reporting
700% faster. Open to full-time backend and <span class="nobreak">full-stack</span> roles and consulting.</p>

<h2>Experience</h2>
${job({
  org: 'PT 360 Teknologi Indonesia <span class="client">· Client: Indogrosir</span>',
  where: 'Jakarta, ID (Remote)',
  role: 'Backend Software Engineer | Full-time',
  when: 'Jun 2023 – Present',
  bullets: [
    'Owned the full lifecycle of 10+ financial service systems, from system architecture and implementation to production deployment and ongoing maintenance',
    'Engineered 100+ production REST APIs across payment processing, credit facilities, and POS systems',
    'Integrated 40+ internal and external systems (banks, payment networks, enterprise platforms), meeting all contractual SLAs with zero missed deadlines across a multi-year engagement, and secured each per partner requirements: OAuth 2.0, HMAC-SHA256, JWT RS256, RSA, and AES-256-GCM',
    'Delivered projects ahead of schedule, typically in about half the planned time, enabling early partner onboarding and accelerating revenue timelines',
    'Architected cloud-native, event-driven financial systems on AWS Serverless (Lambda, SQS, SNS, API Gateway, S3, Secrets Manager) with RabbitMQ, designed for high-throughput transaction processing',
    'Built the full settlement pipeline: client apps through API Gateway, Lambda processing, PostgreSQL persistence, outbound bank API calls, S3 document storage, and MFT settlement file exchange',
    'Led and architected the migration of 3 standalone Lambda projects, each serving a distinct financial partner, into one NestJS platform: 50+ of the platform APIs rebuilt in TypeScript with Prisma ORM, authentication flows <span class="nobreak">re-engineered</span>, and OpenTelemetry observability added while preserving every integration contract',
    'Designed and built an internal monitoring and operations platform from scratch (Laravel, React + Inertia.js, PostgreSQL, MySQL): 150+ features, with multi-database switching, AWS integration (S3, SES, SQS, QuickSight), and vendor/bank API connectivity, replacing fragmented legacy tools',
    'Designed and built Application Gateway from scratch (Laravel, React + TypeScript, PostgreSQL): an internal platform for managing payment integrations, credentials, and client API keys across environments, with role-based access, two-factor authentication, audit logging, and 800+ automated tests',
    'Refactored 10+ legacy services to clean architecture, improving code maintainability, testability, and <span class="nobreak">deployment reliability</span>',
    'Backed services with Jest and Supertest tests, k6 load tests, Swagger/OpenAPI documentation, and Prometheus, Grafana, and CloudWatch monitoring',
  ],
  stack: 'Node.js, NestJS, TypeScript, Laravel, PHP, React, AWS Lambda/SQS/SNS/API Gateway/S3/ECR, Serverless Framework, PostgreSQL, MySQL, Redis, Prisma ORM, RabbitMQ, Docker, Kubernetes, OpenTelemetry',
})}
${job({
  org: 'PT Teknologi Media Medika (Assist.id)',
  where: 'Pekanbaru, ID (On-site)',
  role: 'Backend Software Engineer | Full-time',
  when: 'Jul 2022 – Apr 2023',
  bullets: [
    'Owned API development, performance engineering, and service integrations for AUDY, a healthcare management platform for clinics and hospitals',
    'Built 50+ REST APIs spanning core platform operations, reporting pipelines, third-party integrations, and insurance notification delivery with EJS-templated messages',
    'Achieved a 700% improvement in reporting performance by fully rewriting MongoDB aggregation pipelines and introducing materialized views',
    'Engineered automated cleanup jobs (node-cron) that processed 10,000+ appointment records with zero data loss, eliminating manual operations overhead',
    'Integrated 10+ third-party services, including insurance providers, notification services, and external APIs',
    'Resolved 30+ production issues while maintaining system stability and uptime, and refactored legacy backend modules to improve maintainability and deployment reliability',
  ],
  stack: 'Node.js, JavaScript, LoopBack, Express.js, MongoDB, Mongoose, Redis, JWT, node-cron, EJS',
})}

<h2>Selected Case Studies <span style="font-weight:400;text-transform:none;font-size:9.8pt">(enterprise, under NDA — details in the ${link('Portfolio', 'https://muhammadyogi.vercel.app')})</span></h2>
<ul>
  <li><b>Credit Facility Platform — NestJS Migration</b>: 3 Lambda projects → 1 NestJS monolith · 50+ APIs migrated · auth re-engineered · full observability</li>
  <li><b>Financial Platform — AWS Serverless</b>: payment, credit &amp; POS · 100+ production APIs · 40+ system integrations · typically ~2x faster than planned</li>
  <li><b>Application Gateway</b>: payment integration platform · built solo · 800+ automated tests · 2FA &amp; audit log</li>
  <li><b>Internal Monitoring Core Platform</b>: built from scratch · 150+ features · replaced a legacy platform</li>
  <li><b>AUDY Healthcare System</b>: 700% faster reporting · 10,000+ records automated · 30+ issues resolved · <span class="nobreak">zero data loss</span></li>
</ul>

<h2>Technical Skills</h2>
${skills([
  ['Languages', 'TypeScript/JavaScript, PHP, Go (Golang), Python'],
  ['Backend', 'Node.js, NestJS, Express.js, Laravel, LoopBack, Lambda Function, Zod, class-validator'],
  ['DevOps/Cloud', 'AWS Lambda, SQS, SNS, API Gateway, S3, ECR, Secrets Manager, CloudWatch, Serverless Framework, Docker, Kubernetes'],
  ['Databases', 'PostgreSQL, MySQL, MongoDB, Redis, Prisma ORM, Mongoose, query optimization, schema design'],
  ['Messaging', 'RabbitMQ, WebSocket, API integration, webhook integration, MFT file exchange'],
  ['Architecture', 'REST API design, system design, clean architecture, microservices, distributed systems, event-driven'],
  ['Security', 'OAuth 2.0, JWT (RS256), HMAC-SHA256, AES-256-GCM, RSA encryption'],
  ['Testing', 'Unit/integration testing, Jest, Supertest, k6, Postman, Swagger/OpenAPI'],
  ['Tools', 'OpenTelemetry, Prometheus &amp; Grafana, Git, CI/CD, performance tuning, <span class="nobreak">AI-assisted</span> development'],
  ['Frontend', 'React, React Native (Expo), Inertia.js, Tailwind CSS, Material UI'],
])}

<h2>Education</h2>
<div class="job">
  <div class="row"><span class="org">Universitas Lancang Kuning</span><span class="where">Pekanbaru, ID</span></div>
  <div class="row"><span class="role"><i>Bachelor of Computer Science, Informatics Engineering</i></span><span class="when">2017 – 2021</span></div>
  <ul><li>Coursework: Data Structures, Algorithms, Database Systems, Software Engineering, Computer Networks</li></ul>
</div>
<div class="job">
  <div class="row"><span class="org">Eduwork</span><span class="where">Yogyakarta, ID</span></div>
  <div class="row"><span class="role"><i>Full-Stack Web Development Bootcamp</i></span><span class="when">Jan 2022 – Jul 2022</span></div>
  <ul>
    <li>Built full-stack MERN applications and REST APIs through hands-on projects, including a full-featured <span class="nobreak">e-commerce</span> platform</li>
    <li>Solved 200+ algorithm challenges on LeetCode, HackerRank, and Codeforces</li>
  </ul>
</div>

<h2>Personal Projects</h2>
<ul>
  <li><b>Rakit — e-bike parts store (open source)</b> — ${link('Live demo', 'https://yogi-store.vercel.app')} · ${link('GitHub', 'https://github.com/yogigaek/gear-store')}: React storefront with a 3D bike configurator drawn in three.js and a NestJS API on PostgreSQL. Prices, compatibility rules, and stock are decided on the server; checkout takes each part’s stock with a guarded update in one transaction and is idempotent, Midtrans notifications are accepted only with a valid SHA-512 signature and the exact amount, and unpaid orders expire and release their stock; API tests against a real database and Playwright browser tests in CI. Also an Android app (React Native, Expo). <span class="stack">TypeScript, React, three.js, NestJS, Prisma, PostgreSQL, Midtrans, Playwright, GitHub Actions</span></li>
  <li><b>Webhook Relay (Go, open source)</b> — ${link('GitHub', 'https://github.com/yogigaek/webhook-relay')}: receives payment-provider webhooks, verifies HMAC signatures with a replay window, stores each event once in PostgreSQL (safe under concurrent duplicates), and relays it with retries, exponential backoff, and a dead-letter state; OpenTelemetry tracing and CI against a real database. <span class="stack">Go, PostgreSQL, pgx, OpenTelemetry, Docker, GitHub Actions</span></li>
  <li><b>E-Commerce Platform (MERN)</b> — ${link('GitHub', 'https://github.com/yogigaek/ecommerce-app')}: product search and filtering, cart, checkout, order history with invoices, customer dashboard, and an Express API with JWT auth and admin-only product management. <span class="stack">React, Node.js, Express.js, MongoDB, JWT, Redux</span></li>
  <li><b>E-Commerce Platform (PHP)</b> — ${link('GitHub', 'https://github.com/yogigaek/App-Market-Place')}: marketplace with catalog, category management, admin CRUD, and a WhatsApp-based purchase flow. <span class="stack">PHP, MySQL, CKEditor</span></li>
</ul>

<h2>Recommendations</h2>
<ul>
  <li>“… He has a very broad knowledge of system architecture, performance optimization, and security. Yogi is always passionate about completing projects, and his excellent communication skills make collaboration smooth.” — <b>Fajri Illahi</b>, Tech Lead, IFG Life</li>
  <li>“… Yogi has a strong understanding of databases, APIs, and system integration. When working with him, I always see dedication in creating efficient and scalable solutions.” — <b>Fadhlillah I.</b>, Backend Engineer, PT Bank Danamon Indonesia, Tbk.</li>
</ul>`,
  'full',
)

// the PDF's text area (A4 less the side margins), and for the 1-page CV the height it must fill
const TEXT_WIDTH_PT = 595.28 - 2 * 42.8
const ONE_PAGE_ROOM_PT = 841.89 - 28 - 24

// Layout rules checked on a screen render at the PDF's text width, which wraps every line the same way.
function layoutIssues({ width, room }) {
  document.body.style.width = `${width}pt`
  const issues = []
  // a positioned or floated box is painted after the text flow, so the PDF (and an ATS) reads it out of order
  for (const el of document.body.querySelectorAll('*')) {
    const cs = getComputedStyle(el)
    if (cs.position !== 'static' || cs.float !== 'none') {
      issues.push(`out of reading order (${cs.position}/${cs.float}): ${el.textContent.trim().slice(0, 50)}`)
    }
  }
  const hidden = document.body.innerText.match(/[\p{Cf}\u00AD]/gu)
  if (hidden) issues.push(`hidden characters: ${[...new Set(hidden)].map((c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(' ')}`)
  for (const el of document.querySelectorAll('li, p, .skills > span')) {
    const tops = []
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      for (const m of n.data.matchAll(/\S+/g)) {
        const r = document.createRange()
        r.setStart(n, m.index)
        r.setEnd(n, m.index + m[0].length)
        tops.push(r.getBoundingClientRect().top)
      }
    }
    // lines are 15pt apart; words of one line differ by a few px when their font sizes differ
    const lines = []
    for (const t of tops) if (!lines.length || t > lines.at(-1).top + 8) lines.push({ top: t, words: 1 }); else lines.at(-1).words++
    const text = el.textContent.trim().slice(0, 60)
    if (room && el.matches('li') && lines.length > 1) issues.push(`bullet wraps to ${lines.length} lines: ${text}`)
    if (lines.length > 1 && lines.at(-1).words < 2) issues.push(`one word alone on the last line: ${text}`)
  }
  if (room) {
    const free = room - document.body.getBoundingClientRect().height * 0.75
    if (free < 0 || free > 15) issues.push(`page not full: ${free.toFixed(1)}pt free at the bottom (keep it under one line, 15pt)`)
  }
  return issues
}

const browser = await chromium.launch()
for (const [name, html, pages] of [['Muhammad-Yogi-CV', one, 1], ['Muhammad-Yogi-CV-Full', full, 2]]) {
  const p = await browser.newPage()
  await p.setContent(html, { waitUntil: 'load' })
  await p.pdf({ path: `${OUT_DIR}/${name}.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true })
  const count = (readFileSync(`${OUT_DIR}/${name}.pdf`, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
  const issues = await p.evaluate(layoutIssues, { width: TEXT_WIDTH_PT, room: pages === 1 ? ONE_PAGE_ROOM_PT : 0 })
  if (count !== pages) issues.unshift(`${count} pages, expected ${pages}`)
  console.log(`${name}.pdf: ${count} page${count > 1 ? 's' : ''}, ${issues.length ? 'FAILED' : 'all checks passed'}`)
  for (const issue of issues) console.log(`  - ${issue}`)
  if (issues.length) process.exitCode = 1
  await p.close()
}
await browser.close()
