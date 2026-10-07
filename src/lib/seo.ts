import { LOCATION, ROLE, getOutcome } from '@/data'
import type { Project } from '@/types'

// Shared by ProjectDetail (client-side head tags) and the build step in vite.config.ts that writes a static HTML
// file per project page and the sitemap, so crawlers and link previews that skip JavaScript see the same tags.

export const SITE = 'https://muhammadyogi.vercel.app'

export interface PageHead {
  title: string
  description: string
  ogDescription: string
  twitterDescription: string
  url: string
  /** "profile" for the home page, "article" for a project page */
  ogType: string
}

// "4+ years" stays literal on purpose: the computed yearsOfExperience would change on its own each July and
// then fail the build until index.html is edited by hand.
const STATS = `${getOutcome('apis').value} production APIs, ${getOutcome('integrations').value} system integrations`
const PLACE = `${LOCATION.city}, ${LOCATION.country} (${LOCATION.timezone})`
const OPEN_TO = 'open to full-time roles, international remote work and consulting'

/**
 * The home page's tags, built from the same data as the site. index.html is static and keeps its own copy;
 * the build fails if the two drift apart, so changing ROLE or a stat forces index.html to be updated too.
 */
export const HOME_HEAD: PageHead = {
  title: `Muhammad Yogi — ${ROLE}`,
  description: `${ROLE} with 4+ years building fintech systems on AWS Serverless and healthcare backends — ${STATS}. ${PLACE} — ${OPEN_TO}.`,
  ogDescription: `4+ years building fintech and healthcare backends — ${STATS}. ${PLACE} — ${OPEN_TO}.`,
  twitterDescription: `4+ years building fintech and healthcare backends — ${STATS}. ${PLACE}.`,
  url: `${SITE}/`,
  ogType: 'profile',
}

/** Where each head field lives; `meta[name="title"]`, og:title and twitter:title all carry the page title. */
export const HEAD_TAGS: { field: keyof PageHead; tag: 'link' | 'meta'; key: 'rel' | 'name' | 'property'; id: string }[] = [
  { field: 'title', tag: 'meta', key: 'name', id: 'title' },
  { field: 'title', tag: 'meta', key: 'property', id: 'og:title' },
  { field: 'title', tag: 'meta', key: 'name', id: 'twitter:title' },
  { field: 'description', tag: 'meta', key: 'name', id: 'description' },
  { field: 'ogDescription', tag: 'meta', key: 'property', id: 'og:description' },
  { field: 'twitterDescription', tag: 'meta', key: 'name', id: 'twitter:description' },
  { field: 'url', tag: 'link', key: 'rel', id: 'canonical' },
  { field: 'url', tag: 'meta', key: 'property', id: 'og:url' },
  { field: 'ogType', tag: 'meta', key: 'property', id: 'og:type' },
]

/** Client-side only: writes a head into the live document (the build writes the same fields into HTML files). */
export function applyHead(head: PageHead) {
  document.title = head.title
  for (const { field, tag, key, id } of HEAD_TAGS) {
    document.querySelector(`${tag}[${key}="${id}"]`)?.setAttribute(tag === 'link' ? 'href' : 'content', head[field])
  }
}

/** A project gets its own page when it is an enterprise case study or has a screenshot walkthrough. */
export function hasProjectPage(project: Project): boolean {
  return !!project.experienceId || (project.screenshots?.length ?? 0) > 0
}

/** In-app route. The build writes the page to `${projectPath()}.html`, which Vercel serves here via cleanUrls. */
export function projectPath(project: Project): string {
  return `/projects/${project.id}`
}

export function projectHead(project: Project): PageHead {
  const description = metaDescription(project.description)
  return {
    // "|" rather than another em dash: many project titles already contain one
    title: `${project.title} | Muhammad Yogi`,
    description,
    ogDescription: description,
    twitterDescription: description,
    url: `${SITE}${projectPath(project)}`,
    ogType: 'article',
  }
}

/** Search snippets cut off around 160 characters: end on a whole sentence when one fits, else on a word. */
export function metaDescription(text: string, max = 160): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const sentenceEnd = cut.lastIndexOf('. ')
  if (sentenceEnd >= max / 2) return cut.slice(0, sentenceEnd + 1)
  const wordEnd = cut.lastIndexOf(' ')
  // no usable word break (one long token): cut hard rather than return a stub
  const body = wordEnd >= max / 2 ? cut.slice(0, wordEnd) : cut
  return `${body.replace(/[\s,;:—–-]+$/, '')}…`
}
