import type {
  WorkExperience,
  Skill,
  Project,
  Testimonial,
  Outcome,
  Service,
  WorkStep,
  EducationItem,
  QuickFact,
  NavItem,
} from '@/types'

import profileAbout from '@/assets/profile-about.webp'
import avatarFadhlillah from '@/assets/avatar-fadhlillah.jpeg'
import avatarFajri from '@/assets/avatar-fajri.jpeg'
import cvPdf from '@/assets/cv-muhammad-yogi.pdf'
import cvFullPdf from '@/assets/cv-muhammad-yogi-full.pdf'
import onepagerEn from '@/assets/consulting-onepager-en.pdf'
import onepagerId from '@/assets/consulting-onepager-id.pdf'

// MERN e-commerce screenshots
import mernSs1 from '@/assets/projects/mern-ecommerce/ss1.png'
import mernSs2 from '@/assets/projects/mern-ecommerce/ss2.png'
import mernSs3 from '@/assets/projects/mern-ecommerce/ss3.png'
import mernSs4 from '@/assets/projects/mern-ecommerce/ss4.png'
import mernSs5 from '@/assets/projects/mern-ecommerce/ss5.png'
import mernSs6 from '@/assets/projects/mern-ecommerce/ss6.png'
import mernSs7 from '@/assets/projects/mern-ecommerce/ss7.png'
import mernSs8 from '@/assets/projects/mern-ecommerce/ss8.png'
import mernSs9 from '@/assets/projects/mern-ecommerce/ss9.png'
import mernSs10 from '@/assets/projects/mern-ecommerce/ss10.png'
import mernSs11 from '@/assets/projects/mern-ecommerce/ss11.png'
import mernSs12 from '@/assets/projects/mern-ecommerce/ss12.png'
import mernSs13 from '@/assets/projects/mern-ecommerce/ss13.png'
import mernSs14 from '@/assets/projects/mern-ecommerce/ss14.png'
import mernSs15 from '@/assets/projects/mern-ecommerce/ss15.png'
import mernSs16 from '@/assets/projects/mern-ecommerce/ss16.png'

// PHP e-commerce screenshots
import phpDet1 from '@/assets/projects/php-ecommerce/det1.png'
import phpDet2 from '@/assets/projects/php-ecommerce/det2.png'
import phpDet3 from '@/assets/projects/php-ecommerce/det3.png'
import phpDet4 from '@/assets/projects/php-ecommerce/det4.png'
import phpDet5 from '@/assets/projects/php-ecommerce/det5.png'
import phpDet6 from '@/assets/projects/php-ecommerce/det6.png'
import phpDet7 from '@/assets/projects/php-ecommerce/det7.png'
import phpDet8 from '@/assets/projects/php-ecommerce/det8.png'
import phpDet9 from '@/assets/projects/php-ecommerce/det9.png'
import phpDet10 from '@/assets/projects/php-ecommerce/det10.png'
import phpDet11 from '@/assets/projects/php-ecommerce/det11.png'

export { profileAbout }

export const CV = {
  onePage: { href: cvPdf, filename: 'Muhammad Yogi - Backend Software Engineer - CV.pdf', pages: 1 },
  full: { href: cvFullPdf, filename: 'Muhammad Yogi - Backend Software Engineer - CV (full).pdf', pages: 2 },
}

export const CONSULTING_ONEPAGER = {
  en: { href: onepagerEn, filename: 'Muhammad Yogi - Backend Engineering Services.pdf' },
  id: { href: onepagerId, filename: 'Muhammad Yogi - Layanan Backend Engineering.pdf' },
}

function calcYearsFromStart(start: string): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const [mon, yr] = start.split(' ')
  const startDate = new Date(parseInt(yr), months.indexOf(mon))
  const now = new Date()
  const totalMonths =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth())
  const years = Math.floor(totalMonths / 12)
  const remaining = totalMonths % 12
  return remaining > 0 ? `${years}+` : `${years}`
}

export const yearsOfExperience = calcYearsFromStart('Jul 2022')

export const LOCATION = {
  city: 'Pekanbaru',
  country: 'Indonesia',
  countryCode: 'ID',
  timezone: 'UTC+7',
  timezoneName: 'WIB',
}

export const AVAILABILITY = ['full-time roles', 'international remote work', 'consulting']

export const CORE_STACK = ['Node.js / NestJS', 'PHP / Laravel', 'Go', 'AWS']

export const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export const outcomes: Outcome[] = [
  {
    id: 'apis',
    value: '150+',
    label: 'Production APIs',
    note: 'across payment, credit facility, POS, partner and healthcare services',
  },
  {
    id: 'integrations',
    value: '50+',
    label: 'System integrations',
    note: 'with banks, partners and enterprise platforms across fintech and healthcare',
  },
  {
    id: 'reporting',
    value: '700%',
    label: 'Faster reporting',
    note: 'through MongoDB query tuning and materialized views on a healthcare platform',
  },
  {
    id: 'schedule',
    value: '~2x',
    label: 'Faster than planned',
    note: 'projects typically delivered in about half the planned time across a multi-year enterprise fintech engagement',
  },
  {
    id: 'projects',
    value: '10+',
    label: 'Projects owned end to end',
    note: 'financial service systems, from architecture to production delivery',
  },
  {
    id: 'records',
    value: '10,000+',
    label: 'Records automated',
    note: 'by appointment cleanup jobs that ran with zero data loss',
  },
]

export function getOutcome(id: string): Outcome {
  const outcome = outcomes.find((o) => o.id === id)
  if (!outcome) throw new Error(`Unknown outcome: ${id}`)
  return outcome
}

export const services: Service[] = [
  {
    id: 'api',
    icon: 'api',
    title: 'Backend API Development',
    description: 'Design and build REST APIs and backend services in Node.js, NestJS, Express.js, or Laravel.',
    proof: `${getOutcome('apis').value} production APIs across payment, credit facility, POS, and healthcare services.`,
  },
  {
    id: 'integration',
    icon: 'integration',
    title: 'Bank & Partner Integrations',
    description: 'Connect payment, banking, and partner systems with the auth each one requires — OAuth 2.0, HMAC, JWT, RSA, AES-256.',
    proof: `${getOutcome('integrations').value} system integrations, including 40+ at PT 360 Teknologi Indonesia with zero missed deadlines.`,
  },
  {
    id: 'cloud',
    icon: 'cloud',
    title: 'AWS Serverless & Cloud',
    description: 'Event-driven systems on AWS Lambda, SQS, SNS, API Gateway, and S3, with Docker, Kubernetes, and RabbitMQ.',
    proof: `${getOutcome('projects').value} financial service projects owned end to end, from architecture to production.`,
  },
  {
    id: 'database',
    icon: 'database',
    title: 'Database & Performance',
    description: 'Query tuning, schema design, and caching for PostgreSQL, MySQL, MongoDB, and Redis.',
    proof: `${getOutcome('reporting').value} faster reporting through MongoDB query tuning and materialized views.`,
  },
  {
    id: 'modernization',
    icon: 'modernization',
    title: 'System Modernization',
    description: 'Refactor legacy services to clean architecture and migrate platforms without breaking integration contracts.',
    proof: '3 Lambda projects consolidated into one NestJS platform; 10+ legacy services refactored.',
  },
  {
    id: 'platform',
    icon: 'platform',
    title: 'Internal Platforms',
    description: 'Operations dashboards and admin platforms built from scratch with Laravel, React + Inertia.js, PostgreSQL, and MySQL.',
    proof: 'Replaced a legacy platform with a unified system — 150+ features for 20+ internal users.',
  },
  {
    id: 'consulting',
    icon: 'consulting',
    title: 'Architecture Consulting',
    description: 'Architecture and technology choices grounded in hands-on production delivery.',
    proof: 'Architected the migration of 3 Lambda projects into one NestJS platform while preserving every integration contract.',
  },
]

// confirmed by Yogi as his engagement process; mirrors "How I work" in the consulting one-pager PDFs
export const workProcess: WorkStep[] = [
  { title: 'Intro chat', description: 'Start with a short WhatsApp chat or an introductory call.' },
  { title: 'Agreed in writing', description: 'Scope, timeline, and code ownership agreed in writing before any work starts.' },
  { title: 'Milestone delivery', description: 'Delivery against agreed milestones, with regular reviews and transparent progress.' },
  { title: 'Complete handover', description: 'Source code, documentation, and deployment details handed over at the end.' },
]

export const workExperiences: WorkExperience[] = [
  {
    id: 'indogrosir',
    company: 'PT 360 Teknologi Indonesia',
    client: 'Indogrosir',
    role: 'Backend Software Engineer',
    period: 'Jun 2023 – Present',
    periodStart: 'Jun 2023',
    periodEnd: 'Present',
    current: true,
    type: 'Full-time',
    location: 'Jakarta, Indonesia · Remote',
    summary:
      'Primary backend engineer for 10+ financial service systems — payment, credit facility, and POS platforms on AWS Serverless, owned end to end from architecture to production.',
    achievements: [
      'Delivered 100+ REST APIs for financial platforms covering payment, credit facilities, and POS',
      'Owned 10+ financial service projects end to end — architecture, implementation, and production delivery',
      'Integrated 40+ internal and external systems (banks, partners, enterprise platforms) with zero missed deadlines',
      'Delivered projects ahead of schedule, typically in about half the planned time, across a multi-year enterprise engagement',
      'Built cloud-native systems using AWS Serverless and event-driven architectures (Lambda, SQS, API Gateway)',
      'Secured all integrations with auth standards per requirement: OAuth 2.0, HMAC, JWT, RSA, AES-256',
      'Built an internal monitoring core platform from scratch — Laravel, React + Inertia.js, PostgreSQL & MySQL',
      'Refactored 10+ legacy services to clean architecture, improving long-term maintainability',
      'Initiated and architected NestJS migration from Lambda microservices — established platform modernization blueprint',
    ],
    techStack: [
      'Node.js',
      'NestJS',
      'TypeScript',
      'AWS Lambda',
      'AWS SQS',
      'AWS API Gateway',
      'AWS S3',
      'AWS SNS',
      'AWS ECR',
      'Serverless Framework',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'RabbitMQ',
      'Docker',
      'Kubernetes',
      'Prometheus & Grafana',
      'CloudWatch',
      'Laravel',
      'React',
      'OAuth 2.0',
      'JWT',
    ],
  },
  {
    id: 'audy',
    company: 'PT Teknologi Media Medika (Assist.id)',
    role: 'Backend Software Engineer',
    period: 'Jul 2022 – Apr 2023',
    periodStart: 'Jul 2022',
    periodEnd: 'Apr 2023',
    current: false,
    type: 'Full-time',
    location: 'Pekanbaru, Indonesia · On-site',
    summary:
      'Backend engineer for the AUDY healthcare system — a healthcare appointment and operations platform. Owned API development, performance engineering, and service integrations.',
    achievements: [
      'Built 50+ REST APIs using Node.js, LoopBack, Express.js, and MongoDB',
      'Improved reporting performance by 700% through MongoDB query tuning and materialized views',
      'Designed automated cleanup jobs processing 10,000+ appointment records with zero data loss',
      'Integrated 10+ internal and external services via REST APIs',
      'Resolved 30+ production issues while maintaining system stability and uptime',
      'Refactored legacy backend modules for improved maintainability and deployment reliability',
    ],
    techStack: [
      'Node.js',
      'LoopBack',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'JavaScript',
      'REST API',
      'Query Optimization',
    ],
  },
]

export const education: EducationItem[] = [
  {
    id: 'unilak',
    institution: 'Universitas Lancang Kuning, Pekanbaru',
    degree: 'Bachelor of Computer Science',
    major: 'Informatics Engineering',
    period: '2017 – 2021',
    highlights: [
      'Coursework: Data Structures, Algorithms, Database Systems, Software Engineering, Computer Networks',
      'Focused on backend systems, software architecture, and applied programming',
    ],
  },
  {
    id: 'eduwork',
    institution: 'Eduwork',
    degree: 'Full-Stack Web Development Bootcamp',
    major: 'Full-Stack Web Development',
    period: 'Jan 2022 – Jul 2022',
    highlights: [
      'Built full-stack MERN applications and REST APIs through hands-on projects',
      'Solved 200+ algorithm challenges on LeetCode, HackerRank, and Codeforces',
    ],
  },
]

export const skills: Skill[] = [
  // Languages
  { name: 'TypeScript', level: 'Expert', category: 'Languages' },
  { name: 'JavaScript', level: 'Expert', category: 'Languages' },
  { name: 'PHP', level: 'Advanced', category: 'Languages' },
  { name: 'Go', level: 'Proficient', category: 'Languages' },
  { name: 'Python', level: 'Familiar', category: 'Languages' },
  { name: 'SQL', level: 'Advanced', category: 'Languages' },

  // Backend
  { name: 'Node.js', level: 'Expert', category: 'Backend' },
  { name: 'NestJS', level: 'Advanced', category: 'Backend' },
  { name: 'Express.js', level: 'Expert', category: 'Backend' },
  { name: 'Laravel', level: 'Advanced', category: 'Backend' },
  { name: 'LoopBack', level: 'Advanced', category: 'Backend' },
  { name: 'REST API Design', level: 'Expert', category: 'Backend' },
  { name: 'Zod', level: 'Advanced', category: 'Backend' },
  { name: 'class-validator', level: 'Advanced', category: 'Backend' },

  // Cloud & DevOps
  { name: 'AWS Lambda', level: 'Expert', category: 'Cloud & DevOps' },
  { name: 'AWS SQS', level: 'Expert', category: 'Cloud & DevOps' },
  { name: 'AWS SNS', level: 'Expert', category: 'Cloud & DevOps' },
  { name: 'AWS API Gateway', level: 'Expert', category: 'Cloud & DevOps' },
  { name: 'AWS S3', level: 'Expert', category: 'Cloud & DevOps' },
  { name: 'AWS ECR', level: 'Advanced', category: 'Cloud & DevOps' },
  { name: 'Serverless Framework', level: 'Expert', category: 'Cloud & DevOps' },
  { name: 'Docker', level: 'Advanced', category: 'Cloud & DevOps' },
  { name: 'Kubernetes', level: 'Advanced', category: 'Cloud & DevOps' },
  { name: 'CI/CD', level: 'Advanced', category: 'Cloud & DevOps' },
  { name: 'Git', level: 'Expert', category: 'Cloud & DevOps' },

  // Databases
  { name: 'PostgreSQL', level: 'Expert', category: 'Databases' },
  { name: 'MySQL', level: 'Expert', category: 'Databases' },
  { name: 'MongoDB', level: 'Advanced', category: 'Databases' },
  { name: 'Redis', level: 'Advanced', category: 'Databases' },
  { name: 'Prisma ORM', level: 'Expert', category: 'Databases' },
  { name: 'Mongoose', level: 'Advanced', category: 'Databases' },
  { name: 'Query Optimization', level: 'Expert', category: 'Databases' },
  { name: 'Database Design', level: 'Advanced', category: 'Databases' },

  // Architecture
  { name: 'System Design', level: 'Expert', category: 'Architecture' },
  { name: 'Clean Architecture', level: 'Expert', category: 'Architecture' },
  { name: 'Microservices', level: 'Advanced', category: 'Architecture' },
  { name: 'Distributed Systems', level: 'Advanced', category: 'Architecture' },
  { name: 'Event-Driven Architecture', level: 'Advanced', category: 'Architecture' },
  { name: 'Software Architecture', level: 'Advanced', category: 'Architecture' },

  // Messaging & Integration
  { name: 'RabbitMQ', level: 'Advanced', category: 'Messaging & Integration' },
  { name: 'WebSocket', level: 'Advanced', category: 'Messaging & Integration' },
  { name: 'API Integration', level: 'Expert', category: 'Messaging & Integration' },
  { name: 'Webhook Integration', level: 'Advanced', category: 'Messaging & Integration' },

  // Security & Auth
  { name: 'OAuth 2.0', level: 'Expert', category: 'Security & Auth' },
  { name: 'JWT', level: 'Expert', category: 'Security & Auth' },
  { name: 'HMAC', level: 'Advanced', category: 'Security & Auth' },
  { name: 'AES-256', level: 'Advanced', category: 'Security & Auth' },
  { name: 'RSA Encryption', level: 'Advanced', category: 'Security & Auth' },

  // Testing & Quality
  { name: 'Unit Testing', level: 'Advanced', category: 'Testing & Quality' },
  { name: 'Integration Testing', level: 'Advanced', category: 'Testing & Quality' },
  { name: 'Jest', level: 'Advanced', category: 'Testing & Quality' },
  { name: 'Supertest', level: 'Advanced', category: 'Testing & Quality' },
  { name: 'k6', level: 'Advanced', category: 'Testing & Quality' },
  { name: 'Performance Tuning', level: 'Advanced', category: 'Testing & Quality' },

  // Observability & Tools
  { name: 'Prometheus & Grafana', level: 'Advanced', category: 'Observability & Tools' },
  { name: 'CloudWatch', level: 'Advanced', category: 'Observability & Tools' },
  { name: 'Swagger / OpenAPI', level: 'Advanced', category: 'Observability & Tools' },
  { name: 'Postman', level: 'Advanced', category: 'Observability & Tools' },
  { name: 'AI-Assisted Development', level: 'Advanced', category: 'Observability & Tools' },

  // Frontend
  { name: 'React', level: 'Advanced', category: 'Frontend' },
  { name: 'Inertia.js', level: 'Advanced', category: 'Frontend' },
  { name: 'Tailwind CSS', level: 'Proficient', category: 'Frontend' },
  { name: 'Material UI', level: 'Advanced', category: 'Frontend' },
  { name: 'Bootstrap', level: 'Advanced', category: 'Frontend' },
  { name: 'HTML/CSS', level: 'Advanced', category: 'Frontend' },
]

export const projects: Project[] = [
  {
    id: 'nestjs-migration',
    title: 'Credit Facility Platform — NestJS Migration',
    subtitle: 'Lambda → NestJS Monolith · 3 Projects Consolidated · Credit Facility System',
    description:
      'Architected and led the migration of an enterprise credit facility payment platform — consolidating three standalone AWS Lambda projects, each serving a distinct financial partner integration, into a unified NestJS monolith. Rebuilt 50+ of the platform APIs with TypeScript, refactored authentication flows (OAuth 2.0, JWT RS256, HMAC-SHA256, AES-256-GCM), and introduced full observability via OpenTelemetry. Improved system coherence, developer experience, and operational visibility while preserving all existing integration contracts.',
    type: 'Enterprise',
    status: 'Private · NDA',
    metrics: ['50+ APIs Migrated', '3 Projects → 1 Monolith', 'Auth Re-engineered', 'Full Observability Added'],
    techStack: [
      'Node.js',
      'NestJS',
      'TypeScript',
      'AWS S3',
      'AWS SNS',
      'AWS Lambda',
      'Prisma ORM',
      'PostgreSQL',
      'RabbitMQ',
      'MFT',
      'OAuth 2.0',
      'JWT RS256',
      'HMAC-SHA256',
      'AES-256-GCM',
      'OpenTelemetry',
      'Docker',
      'Kubernetes',
      'Jest',
      'Supertest',
      'k6',
    ],
    featured: true,
    architectureLabel: '3 Lambda Projects → NestJS Monolith · Prisma · OpenTelemetry',
  },
  {
    id: 'financial-platform',
    title: 'Financial Platform — AWS Serverless',
    subtitle: 'Payment, Credit & POS Platform · 40+ System Integrations',
    description:
      'Enterprise-grade financial API platform: payment processing, credit facilities, POS, and 40+ integrations with banks, partners, and enterprise platforms. Full settlement pipeline — client apps through API Gateway, Lambda processing, PostgreSQL persistence, outbound bank API calls, S3 document storage, and MFT settlement file exchange. Built and owned the full system on AWS Serverless — from architecture to production.',
    type: 'Enterprise',
    status: 'Private · NDA',
    metrics: ['100+ Production APIs', '40+ System Integrations', '10+ Projects Delivered', 'Delivered Ahead of Schedule'],
    techStack: [
      'Node.js',
      'JavaScript',
      'AWS Lambda',
      'Serverless Framework',
      'AWS API Gateway',
      'AWS SQS',
      'AWS SNS',
      'AWS S3',
      'AWS Secrets Manager',
      'MFT',
      'RabbitMQ',
      'PostgreSQL',
      'OAuth 2.0',
      'JWT',
      'Swagger / OpenAPI',
      'Jest',
      'Supertest',
      'k6',
    ],
    featured: true,
    architectureLabel: 'Apps → API GW → Lambda → PostgreSQL → Bank APIs → S3 · MFT',
  },
  {
    id: 'monitoring-platform',
    title: 'Internal Monitoring Core Platform',
    subtitle: 'Unified Internal Platform — Built from Scratch · Legacy Consolidation',
    description:
      'Designed and built a unified full-stack internal operations platform from scratch, consolidating and replacing legacy systems to centralize monitoring, reporting, and management workflows. Laravel backend with a React + Inertia.js frontend — featuring multi-database switching, AWS service integration, and vendor/bank API connectivity for financial operations teams.',
    type: 'Enterprise',
    status: 'Private · NDA',
    metrics: ['150+ Features Built', '20+ Internal Users', 'Replaced Legacy Platform', 'Consolidated into 1 System'],
    techStack: [
      'Laravel',
      'PHP',
      'React',
      'Inertia.js',
      'JavaScript',
      'PostgreSQL',
      'MySQL',
      'Tailwind CSS',
      'Material UI',
      'Recharts',
      'AWS S3',
      'AWS SES',
      'AWS SQS',
      'AWS QuickSight',
      'Laravel Sanctum',
      'WebSocket',
      'jsPDF',
    ],
    featured: true,
    architectureLabel: 'Web Admin → Laravel → Multi-DB · AWS · Vendor/Bank APIs',
  },
  {
    id: 'healthcare-system',
    title: 'AUDY Healthcare System',
    subtitle: '50+ APIs · 700% Performance Improvement · 10+ Integrations',
    description:
      'Backend engineer for the AUDY healthcare system — built and maintained 50+ REST APIs spanning core platform operations, reporting pipelines, third-party integrations, and insurance notification delivery with EJS-templated messages. Integrated 10+ internal and external services and delivered 700% reporting performance improvement via MongoDB aggregation pipeline rewrite and materialized views. Automated cleanup of 10,000+ appointment records and resolved 30+ production issues while maintaining system stability.',
    type: 'Enterprise',
    status: 'Private · NDA',
    metrics: ['700% Faster Reporting', '10,000+ Records Automated', '30+ Issues Resolved', 'Zero Data Loss'],
    techStack: ['Node.js', 'JavaScript', 'MongoDB', 'Mongoose', 'LoopBack', 'Redis', 'JWT', 'node-cron', 'Query Optimization', 'Axios', 'EJS'],
    featured: true,
    architectureLabel: 'Apps → LoopBack → MongoDB Aggregation · Redis · node-cron',
  },
  {
    id: 'mern-ecommerce',
    title: 'E-Commerce Platform (MERN)',
    subtitle: 'Full-Stack Shopping Platform — Complete Checkout & Admin Dashboard',
    description:
      'Full-featured e-commerce platform with product browsing, search & filtering, shopping cart, checkout flow, order history, and user account management. Includes an admin dashboard for managing products and orders.',
    type: 'Personal',
    status: 'Public',
    metrics: ['Complete Order Flow', 'Admin Dashboard', 'Role-Based Auth', 'Search & Filter'],
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'Redux', 'Axios'],
    coverImage: mernSs1,
    githubUrl: 'https://github.com/yogigaek/ecommerce-app',
    detailPath: '/projects/mern-ecommerce',
    featured: false,
    screenshots: [
      { title: 'Home Page', image: mernSs1, description: 'Landing page with featured products and hero banner' },
      { title: 'Product Search', image: mernSs2, description: 'Product search with keyword filtering' },
      { title: 'Sign In', image: mernSs3, description: 'User authentication page' },
      { title: 'Sign Up', image: mernSs4, description: 'New user registration flow' },
      { title: 'Home (Authenticated)', image: mernSs5, description: 'Authenticated user home with personalized content' },
      { title: 'Product Search Results', image: mernSs6, description: 'Search results with product cards' },
      { title: 'Products — Filter', image: mernSs7, description: 'Category and price range filtering' },
      { title: 'Products — Pagination', image: mernSs8, description: 'Paginated product listing' },
      { title: 'Product Card Interactions', image: mernSs9, description: 'Product card UI interactions and visual feedback' },
      { title: 'Shopping Cart', image: mernSs10, description: 'Cart management with quantity controls' },
      { title: 'Shipping Address', image: mernSs11, description: 'Delivery address entry form' },
      { title: 'Order Review', image: mernSs12, description: 'Order summary and confirmation before placing order' },
      { title: 'Invoice', image: mernSs13, description: 'Invoice page after successful order' },
      { title: 'Transaction History', image: mernSs14, description: 'User order history and tracking' },
      { title: 'Address Management', image: mernSs15, description: 'Saved addresses management' },
      { title: 'Account Settings', image: mernSs16, description: 'User profile and account information' },
    ],
  },
  {
    id: 'php-ecommerce',
    title: 'E-Commerce Platform (PHP)',
    subtitle: 'PHP Marketplace · WhatsApp-Based Purchase Flow',
    description:
      'PHP-based marketplace with full product catalog, category management, admin dashboard for product/category CRUD, and a WhatsApp-based purchase flow for lightweight checkout without a payment gateway.',
    type: 'Personal',
    status: 'Public',
    metrics: ['WhatsApp Purchase Flow', 'Admin Dashboard', 'Product Management', 'Category System'],
    techStack: ['PHP 7', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'jQuery'],
    coverImage: phpDet1,
    githubUrl: 'https://github.com/yogigaek/App-Market-Place',
    demoUrl: 'https://share.vidyard.com/watch/bn6RHvzhVw7DxAbSPRM3UD',
    demoLabel: 'Demo Video',
    detailPath: '/projects/php-ecommerce',
    featured: false,
    screenshots: [
      { title: 'Home Page', image: phpDet1, description: 'Marketplace home with product listings' },
      { title: 'Latest Products', image: phpDet2, description: 'Newest products section' },
      { title: 'Navigation & Search', image: phpDet3, description: 'Navigation bar with product menu and search functionality' },
      { title: 'Category Filter', image: phpDet4, description: 'Browse products by category' },
      { title: 'Product Detail', image: phpDet5, description: 'Product page with WhatsApp purchase option' },
      { title: 'Admin Login', image: phpDet6, description: 'Admin panel authentication' },
      { title: 'Admin Dashboard', image: phpDet7, description: 'Admin control panel overview' },
      { title: 'Admin Profile Settings', image: phpDet8, description: 'Admin account profile and settings management' },
      { title: 'Category Management', image: phpDet9, description: 'CRUD for product categories' },
      { title: 'Product Management', image: phpDet10, description: 'Product data listing and management' },
      { title: 'Add Product', image: phpDet11, description: 'Form to add new products with image upload' },
    ],
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Fadhlillah I.',
    role: 'Backend Engineer',
    company: 'PT Bank Danamon Indonesia, Tbk.',
    avatar: avatarFadhlillah,
    review:
      'I was very impressed with Muhammad Yogi\'s expertise in backend development. Yogi has a strong understanding of databases, APIs, and system integration. When working with him, I always see dedication in creating efficient and scalable solutions.',
  },
  {
    id: 2,
    name: 'Fajri Illahi',
    role: 'Tech Lead',
    company: 'IFG Life',
    avatar: avatarFajri,
    review:
      'I would like to recommend Muhammad Yogi as a reliable Backend Engineer. He has a very broad knowledge of system architecture, performance optimization, and security. Yogi is always passionate about completing projects, and his excellent communication skills make collaboration smooth.',
  },
]

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string,
}

export const CONTACT_INFO = {
  email: 'yogikgaek@gmail.com',
  linkedin: 'https://www.linkedin.com/in/yogigaek',
  github: 'https://github.com/yogigaek',
  gitlab: 'https://gitlab.com/yogigaek',
  leetcode: 'https://leetcode.com/u/yogigaek/',
  whatsapp: 'https://wa.me/6282169713434',
  phone: '+62 821 6971 3434',
}

export function whatsappLink(message = 'Hi Yogi, I saw your portfolio') {
  return `${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`
}

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const currentJob = workExperiences.find((job) => job.current) ?? workExperiences[0]

export const quickFacts: QuickFact[] = [
  {
    label: 'Current',
    value: `${currentJob.role} — ${currentJob.company}${currentJob.client ? ` (client: ${currentJob.client})` : ''}`,
  },
  { label: 'Core', value: CORE_STACK.join(' · ') },
  { label: 'Experience', value: `${yearsOfExperience} years` },
  { label: 'Education', value: `${education[0].degree} — ${education[0].major}` },
  { label: 'Freelance', value: 'Available' },
  { label: 'Availability', value: capitalize(AVAILABILITY.join(' · ')) },
  { label: 'Email', value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
  { label: 'WhatsApp', value: CONTACT_INFO.phone, href: whatsappLink() },
]
