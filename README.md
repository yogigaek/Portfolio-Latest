<h1 align="center">Muhammad Yogi — Backend Software Engineer</h1>

<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-muhammadyogi.vercel.app-6366f1?style=for-the-badge&labelColor=0b0f17)](https://muhammadyogi.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&labelColor=0b0f17)](https://www.linkedin.com/in/yogigaek)
[![GitHub](https://img.shields.io/badge/GitHub-yogigaek-181717?style=for-the-badge&labelColor=0b0f17)](https://github.com/yogigaek)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&labelColor=0b0f17)](mailto:yogikgaek@gmail.com)

</div>

<h3 align="center">AWS Serverless financial platforms at scale · 150+ production APIs, 50+ system integrations</h3>

[![CI](https://github.com/yogigaek/Portfolio-Latest/actions/workflows/ci.yml/badge.svg)](https://github.com/yogigaek/Portfolio-Latest/actions/workflows/ci.yml)

---

## Professional Profile

Backend Software Engineer (4+ yrs) building mission-critical financial and healthcare systems across
cloud-native, distributed architectures. Currently the primary backend engineer for **10+ financial
service projects end-to-end** at PT 360 Teknologi Indonesia — payment platforms, credit facilities,
POS, and 40+ bank/partner integrations, built on **AWS Serverless** (Lambda, SQS, API Gateway) with
auth secured per requirement (OAuth 2.0, HMAC, JWT, RSA, AES-256). Architected the
**NestJS platform migration** off Lambda microservices, consolidating three standalone projects into
one monolith with full OpenTelemetry observability.

**Highlights:**
- **150+ production APIs** — 100+ for payment, credit facility & POS systems in fintech, 50+ for a healthcare platform
- **50+ system integrations** — 40+ with banks, partners & enterprise platforms (zero missed deadlines), 10+ on the healthcare platform
- **~2x faster than planned** — projects typically delivered in about half the planned time across the engagement
- **700% faster reporting** — MongoDB aggregation rewrite & materialized views (AUDY healthcare platform; 10,000+ records cleaned up automatically, zero data loss)
- **3 Lambda projects → 1 NestJS monolith** — architected & led the credit facility platform migration, 50+ APIs rebuilt with full observability

---

## Tech Stack

|                              |                                                                                                                    |
|------------------------------|--------------------------------------------------------------------------------------------------------------------|
| **Languages** | TypeScript, JavaScript, PHP, Go, Python, SQL |
| **Backend** | Node.js, NestJS, Express.js, Laravel, LoopBack, REST API Design, Zod, class-validator |
| **Cloud & DevOps** | AWS Lambda, SQS, SNS, API Gateway, S3, ECR, Serverless Framework, Docker, Kubernetes, CI/CD, Git |
| **Databases** | PostgreSQL, MySQL, MongoDB, Redis, Prisma ORM, Mongoose, Query Optimization, Database Design |
| **Architecture** | System Design, Clean Architecture, Microservices, Distributed Systems, Event-Driven Architecture, Software Architecture |
| **Messaging & Integration** | RabbitMQ, WebSocket, API Integration, Webhook Integration |
| **Security & Auth** | OAuth 2.0, JWT, HMAC, AES-256, RSA Encryption |
| **Testing & Quality** | Unit Testing, Integration Testing, Jest, Supertest, k6, Performance Tuning |
| **Observability & Tools** | Prometheus & Grafana, CloudWatch, Swagger/OpenAPI, Postman, AI-Assisted Development |
| **Frontend** | React, Inertia.js, Tailwind CSS, Material UI, Bootstrap, HTML/CSS |

---

## About This Repo

Source of my portfolio site, live at **[muhammadyogi.vercel.app](https://muhammadyogi.vercel.app)**.
It's a single-page React + TypeScript site built with Vite and Tailwind CSS: three time-of-day looks
(day, dusk, night — picked from the visitor's local time, switchable from the topbar) with a
dependency-free WebGL2 sky in the hero (raymarched volumetric clouds on capable desktops, a lighter
shader on phones, Canvas 2D fallback; sun, moon, stars, god rays) and a one-time cinematic intro, a sticky topbar with an accessible mobile drawer, a typed `whoami` terminal,
editorial numbered sections, Framer
Motion reveals that respect `prefers-reduced-motion`, and an EmailJS-powered contact form — deployed
to Vercel via its native Git integration and gated by a GitHub Actions CI workflow on every push/PR.

- [`src/data/index.ts`](src/data/index.ts) — **single source of truth** for all site content (location
  & timezone, outcomes, work experience, education, quick facts, skills, projects, testimonials,
  contact info).
- [`src/components/layout/`](src/components/layout/) — Topbar (sticky nav + mobile drawer), Footer,
  MainLayout.
- [`src/components/sections/`](src/components/sections/) — Hero (claim, terminal, proof strip),
  Outcomes, About (quick facts), Projects (enterprise case studies + earlier projects), Work Experience
  (timeline + education), Tech Stack, Services (with EN/ID consulting one-pager PDFs), Testimonials,
  Contact.
- [`src/components/pages/ProjectDetail.tsx`](src/components/pages/ProjectDetail.tsx) — lazy-loaded
  screenshot walkthrough page for each public project.
- [`src/components/ui/`](src/components/ui/) — reusable primitives (Button, Badge, SectionHeader,
  Reveal, GitHubIcon).
- [`src/hooks/useScrollSpy.ts`](src/hooks/useScrollSpy.ts) — active nav section tracking.
- [`src/lib/look.ts`](src/lib/look.ts) + [`src/components/ui/sky/`](src/components/ui/sky/) — look
  state (persisted, synced to `theme-color`) and the hero sky: WebGL2 shader renderer, Canvas 2D
  fallback, and the shared animation loop (pauses offscreen, adaptive resolution, reduced motion). Colours are RGB token triplets
  per look in [`src/index.css`](src/index.css); the initial look is set by an inline script in
  `index.html` before first paint.
- [`vercel.json`](vercel.json) — SPA rewrite so deep links such as `/projects/mern-ecommerce` load
  directly, plus cache and security headers.

### Routes

| Route | Description |
|-------|-------------|
| `/` | Main portfolio (all sections) |
| `/projects/mern-ecommerce` | MERN e-commerce project detail |
| `/projects/php-ecommerce` | PHP e-commerce project detail |
| `/detail`, `/detail2` | Legacy redirects to the routes above |
| `*` | 404 page (`noindex`); unknown `/projects/:id` too |

### Updating Content

Everything lives in `src/data/index.ts` — edit that file, not the section components: location &
timezone (`LOCATION`), availability (`AVAILABILITY`), hero/terminal stack (`CORE_STACK`), social links
(`CONTACT_INFO`), headline numbers (`outcomes`), services (`services`), work experience
(`workExperiences`), education (`education`), About quick facts (`quickFacts`), skills (`skills`),
projects (`projects`), testimonials (`testimonials`).

Enterprise projects (`featured: true`) render as NDA case studies; their architecture panel is derived
from `architectureLabel` (`A → B → C · extra · extra`). Personal projects render under "Earlier
projects".

## Local Development

The project uses npm for dependency and script management, and Vite for development, bundling, and
image optimization.

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint     # ESLint
npx tsc --noEmit # type-check
npm run build    # type-check + production build in dist/
npm run preview  # preview the production build
```

### Environment Variables

Create a `.env.local` file in the root directory for the contact form (EmailJS):

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## Deployment

Vercel is connected to this repository via its native Git integration — every push to `main`
triggers a production build & deploy automatically, and every pull request gets a preview deploy.
No deploy step lives in this repo.

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) is the **CI gate**, not the deploy mechanism:
on every push to `main`/`yogi` and every PR to `main`, it runs type-check, lint, and build to catch
regressions before they reach `main`.

## Contact

- **Email:** [yogikgaek@gmail.com](mailto:yogikgaek@gmail.com)
- **LinkedIn:** [linkedin.com/in/yogigaek](https://www.linkedin.com/in/yogigaek)
- **GitHub:** [github.com/yogigaek](https://github.com/yogigaek)
- **GitLab:** [gitlab.com/yogigaek](https://gitlab.com/yogigaek)
- **LeetCode:** [leetcode.com/u/yogigaek](https://leetcode.com/u/yogigaek/)
- **WhatsApp:** [+62 821 6971 3434](https://wa.me/6282169713434)

Open to full-time roles, international remote work, and consulting.

---

Personal portfolio — all rights reserved.
