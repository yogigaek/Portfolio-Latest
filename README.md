# Muhammad Yogi — Portfolio

Personal portfolio website for **Muhammad Yogi**, Backend Software Engineer. Built with modern web technologies to showcase professional experience, technical skills, and projects.

**Live:** [muhammadyogi.vercel.app](https://muhammadyogi.vercel.app)

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite 5 |
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Carousel | Swiper |
| Contact Form | EmailJS (`@emailjs/browser`) |
| Routing | React Router v6 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Development

```bash
npm run dev
# → http://localhost:5173
```

### Production Build

```bash
npm run build
# Output: dist/
```

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Nav, Footer, MainLayout
│   ├── sections/        # Hero, About, WorkExperience, Education,
│   │                    # TechStack, Projects, Testimonials, Contact
│   ├── pages/           # ProjectDetail (lazy loaded)
│   └── ui/              # Button, Badge, SectionHeader, AnimatedCounter, GitHubIcon
├── data/
│   └── index.ts         # All site content (single source of truth)
├── hooks/
│   ├── useInView.ts     # IntersectionObserver for scroll animations
│   └── useScrollSpy.ts  # Active nav section tracking
├── types/
│   └── index.ts         # TypeScript interfaces
└── lib/
    └── utils.ts         # cn() utility (clsx + tailwind-merge)
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Main portfolio (all sections) |
| `/projects/mern-ecommerce` | MERN e-commerce project detail |
| `/projects/php-ecommerce` | PHP e-commerce project detail |
| `/detail` | Redirects to `/projects/mern-ecommerce` |
| `/detail2` | Redirects to `/projects/php-ecommerce` |
| `*` | Redirects to `/` |

---

## Sections

1. **Hero** — Name, title, tagline, CTA buttons, social links
2. **About** — Profile photo, key metrics (4+ yrs, 150+ APIs, etc.), bio
3. **Work Experience** — Timeline: PT 360 Teknologi Indonesia, Assist.id
4. **Education** — Universitas Lancang Kuning, Eduwork Bootcamp
5. **Tech Stack** — 64 skills across 9 categories, filterable
6. **Projects** — 4 enterprise (NDA) + 2 personal (public)
7. **Testimonials** — 2 colleague recommendations
8. **Contact** — EmailJS contact form + direct contact links

---

## Updating Content

All site content lives in **`src/data/index.ts`**. To update:

- **Personal info / social links** → `CONTACT_INFO`
- **Work experience** → `workExperiences` array
- **Skills** → `skills` array
- **Projects** → `projects` array
- **Testimonials** → `testimonials` array
- **Stats (About section)** → `stats` array

---

## License

Personal portfolio — all rights reserved.
