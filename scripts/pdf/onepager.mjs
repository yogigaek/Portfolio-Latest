// Builds the consulting one-pagers (EN + ID) into public/. Run: npm run onepager
import { chromium } from 'playwright'

const OUT_DIR = new URL('../../public', import.meta.url).pathname

const contact = {
  location: 'Pekanbaru, Indonesia',
  phone: '+62 821 6971 3434',
  email: 'yogikgaek@gmail.com',
  wa: 'wa.me/6282169713434',
  site: 'muhammadyogi.vercel.app',
  linkedin: 'linkedin.com/in/yogigaek',
  github: 'github.com/yogigaek',
}

const copy = {
  id: {
    lang: 'id',
    pdfName: 'Muhammad-Yogi-Layanan-Backend',
    tagline: 'Backend Engineering untuk Sistem Fintech &amp; Bisnis',
    availability: 'Remote (internasional) · Pekanbaru (WIB · UTC+7)',
    sections: {
      what: 'Apa yang saya kerjakan',
      outcomes: 'Hasil terbukti',
      services: 'Layanan',
      proof: 'Bukti yang bisa dicek',
      how: 'Cara saya bekerja',
    },
    what: 'Backend / Full-Stack Engineer dengan pengalaman 4+ tahun. Saya membangun dan mengoperasikan sistem backend produksi untuk fintech di atas AWS Serverless serta backend healthcare — payment, credit facility, POS, dan 40+ integrasi dengan bank, partner, dan platform enterprise sebagai backend engineer di PT 360 Teknologi Indonesia (klien: Indogrosir). Terbuka untuk peran full-time, remote internasional, dan konsultasi.',
    outcomes: [
      ['Skala', '150+ API produksi dan 50+ integrasi sistem dengan bank, partner, dan platform enterprise di fintech dan healthcare'],
      ['Kepemilikan', '10+ proyek layanan finansial ditangani end-to-end — arsitektur, implementasi, hingga produksi'],
      ['Kecepatan', 'proyek umumnya selesai dalam sekitar separuh waktu yang direncanakan selama engagement enterprise multi-tahun; 40+ integrasi tanpa deadline terlewat'],
      ['Efisiensi', 'pembuatan laporan dipercepat 700% lewat MongoDB query tuning dan materialized views pada platform healthcare'],
      ['Keandalan', 'pembersihan otomatis 10.000+ data janji temu (appointment) tanpa data hilang; 30+ masalah produksi diselesaikan'],
      ['Modernisasi', 'memimpin migrasi 3 proyek AWS Lambda menjadi satu platform NestJS — 50+ API dibangun ulang, autentikasi dirancang ulang, observability OpenTelemetry'],
    ],
    services: [
      ['API Backend', 'REST API dan layanan backend — Node.js, NestJS, Express.js, Laravel, TypeScript'],
      ['Integrasi', 'Bank, payment, dan partner dengan OAuth 2.0, JWT, HMAC, RSA, AES-256; webhook'],
      ['AWS Serverless', 'Lambda, SQS, SNS, API Gateway, S3; Docker, Kubernetes, RabbitMQ'],
      ['Database', 'Query tuning, desain skema, caching — PostgreSQL, MySQL, MongoDB, Redis'],
      ['Modernisasi', 'Refactor 10+ layanan legacy ke clean architecture; migrasi Lambda ke NestJS'],
      ['Platform internal', 'Dashboard operasional 150+ fitur & platform integrasi pembayaran — Laravel + React'],
      ['Konsultasi arsitektur', 'Arsitektur dan pemilihan teknologi berdasarkan pengalaman produksi langsung'],
    ],
    proof: [
      `Studi kasus enterprise (NDA): migrasi NestJS, platform finansial AWS Serverless, platform monitoring internal, Application Gateway, sistem healthcare AUDY — ${contact.site}`,
      'E-Commerce Platform (MERN) — React, Node.js, Express.js, MongoDB — <span class="url">github.com/yogigaek/ecommerce-app</span>',
      'E-Commerce Platform (PHP) — katalog, dashboard admin, alur pembelian via WhatsApp — <span class="url">github.com/yogigaek/App-Market-Place</span>',
      `Portfolio, CV, dan rekomendasi rekan kerja (Tech Lead IFG Life, Backend Engineer Bank Danamon) — ${contact.site}`,
    ],
    how: [
      `Mulai dengan chat WhatsApp singkat atau panggilan perkenalan — ${contact.wa}`,
      'Ruang lingkup, jadwal, dan kepemilikan kode disepakati secara tertulis sebelum pekerjaan dimulai',
      'Pengerjaan mengikuti milestone yang disepakati, dengan tinjauan rutin dan progres transparan',
      'Serah terima lengkap saat selesai: kode sumber, dokumentasi, dan detail deployment',
    ],
  },
  en: {
    lang: 'en',
    pdfName: 'Muhammad-Yogi-Backend-Services',
    tagline: 'Backend Engineering for Fintech &amp; Business Systems',
    availability: 'Remote (international) · Pekanbaru (WIB · UTC+7)',
    sections: {
      what: 'What I do',
      outcomes: 'Proven outcomes',
      services: 'Services',
      proof: 'Verifiable proof',
      how: 'How I work',
    },
    what: 'Backend / Full-Stack Engineer with 4+ years of experience. I build and operate production backend systems — fintech on AWS Serverless and healthcare backends — including payment, credit facility, POS, and 40+ integrations with banks, partners, and enterprise platforms as a backend engineer at PT 360 Teknologi Indonesia (client: Indogrosir). Open to full-time roles, international remote work, and consulting.',
    outcomes: [
      ['Scale', '150+ production APIs and 50+ system integrations with banks, partners, and enterprise platforms across fintech and healthcare'],
      ['Ownership', '10+ financial service projects owned end to end — architecture, implementation, and production delivery'],
      ['Speed', 'projects typically delivered in about half the planned time across a multi-year enterprise engagement; 40+ integrations with zero missed deadlines'],
      ['Efficiency', 'report generation 700% faster through MongoDB query tuning and materialized views on a healthcare platform'],
      ['Reliability', 'automated cleanup of 10,000+ appointment records with zero data loss; 30+ production issues resolved'],
      ['Modernization', 'led the migration of 3 AWS Lambda projects into one NestJS platform — 50+ APIs rebuilt, auth re-engineered, OpenTelemetry observability'],
    ],
    services: [
      ['Backend APIs', 'REST APIs and backend services — Node.js, NestJS, Express.js, Laravel, TypeScript'],
      ['Integrations', 'Bank, payment, and partner systems with OAuth 2.0, JWT, HMAC, RSA, AES-256; webhooks'],
      ['AWS Serverless', 'Lambda, SQS, SNS, API Gateway, S3; Docker, Kubernetes, RabbitMQ'],
      ['Databases', 'Query tuning, schema design, caching — PostgreSQL, MySQL, MongoDB, Redis'],
      ['Modernization', 'Refactored 10+ legacy services to clean architecture; Lambda-to-NestJS migration'],
      ['Internal platforms', '150+ feature ops dashboard & payment integration platform — Laravel + React'],
      ['Architecture consulting', 'Architecture and technology choices grounded in hands-on production delivery'],
    ],
    proof: [
      `Enterprise case studies (NDA): NestJS migration, AWS Serverless financial platform, internal monitoring platform, Application Gateway, AUDY healthcare system — ${contact.site}`,
      'E-Commerce Platform (MERN) — React, Node.js, Express.js, MongoDB — <span class="url">github.com/yogigaek/ecommerce-app</span>',
      'E-Commerce Platform (PHP) — catalog, admin dashboard, WhatsApp purchase flow — <span class="url">github.com/yogigaek/App-Market-Place</span>',
      `Portfolio, CV, and colleague recommendations (Tech Lead at IFG Life, Backend Engineer at Bank Danamon) — ${contact.site}`,
    ],
    how: [
      `Start with a short WhatsApp chat or an introductory call — ${contact.wa}`,
      'Scope, timeline, and code ownership agreed in writing before any work starts',
      'Delivery against agreed milestones, with regular reviews and transparent progress',
      'Complete handover at the end: source code, documentation, and deployment details',
    ],
  },
}

const html = (c) => `<!doctype html>
<html lang="${c.lang}"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 12mm 15mm 10mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2328; font-size: 9.7pt; line-height: 1.36; margin: 0; }
  header { text-align: center; margin-bottom: 6pt; }
  h1 { font-size: 21pt; letter-spacing: 0.02em; margin: 0 0 4pt; font-weight: 800; }
  .tagline { font-weight: 700; font-size: 11pt; margin: 0; }
  .contact { color: #57606a; font-size: 9.2pt; margin: 4pt 0 0; }
  h2 { font-size: 11pt; letter-spacing: 0.08em; text-transform: uppercase; margin: 9pt 0 4pt; padding-bottom: 2.5pt; border-bottom: 1px solid #8c959f; }
  p { margin: 0; }
  ul { margin: 0; padding-left: 12pt; }
  li { margin: 0 0 1.8pt; }
  li strong, dt { font-weight: 700; }
  dl { display: grid; grid-template-columns: max-content 1fr; column-gap: 6pt; row-gap: 1.8pt; margin: 0; }
  dd { margin: 0; }
  a { color: inherit; text-decoration: none; }
  .url { white-space: nowrap; }
</style></head><body>
  <header>
    <h1>MUHAMMAD YOGI</h1>
    <p class="tagline">${c.tagline}</p>
    <p class="tagline">${c.availability}</p>
    <p class="contact">${contact.location} | ${contact.phone} | ${contact.email} | WA: ${contact.wa}</p>
    <p class="contact">${contact.site} | ${contact.linkedin} | ${contact.github}</p>
  </header>
  <h2>${c.sections.what}</h2>
  <p>${c.what}</p>
  <h2>${c.sections.outcomes}</h2>
  <ul>${c.outcomes.map(([k, v]) => `<li><strong>${k}</strong> — ${v}</li>`).join('')}</ul>
  <h2>${c.sections.services}</h2>
  <dl>${c.services.map(([k, v]) => `<dt>${k}</dt><dd>: ${v}</dd>`).join('')}</dl>
  <h2>${c.sections.proof}</h2>
  <ul>${c.proof.map((v) => `<li>${v}</li>`).join('')}</ul>
  <h2>${c.sections.how}</h2>
  <ul>${c.how.map((v) => `<li>${v}</li>`).join('')}</ul>
</body></html>`

const browser = await chromium.launch()
for (const c of Object.values(copy)) {
  const page = await browser.newPage()
  await page.setContent(html(c), { waitUntil: 'load' })
  const pdfPath = `${OUT_DIR}/${c.pdfName}.pdf`
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true })
  const pages = await page.evaluate(() => Math.ceil(document.body.scrollHeight / (297 * 3.78 - (15 + 13) * 3.78)))
  console.log(c.lang, '->', pdfPath, '| approx pages:', pages)
  await page.close()
}
await browser.close()
