import { getAllDocs } from '@/lib/docs'
import { getSectionForSlug } from '@/config/navigation'

export interface SearchRecord {
  slug: string
  title: string
  description: string
  section: string
  headings: string[]
  body: string
}

const MDX_NOISE_PATTERNS: RegExp[] = [
  /```[\s\S]*?```/g, // fenced code
  /<[^>]+>/g, // jsx and html tags
  /!\[[^\]]*\]\([^)]*\)/g, // images
]

const BODY_CHARACTER_LIMIT = 1200

function toPlainText(mdx: string): string {
  let text = mdx

  for (const pattern of MDX_NOISE_PATTERNS) {
    text = text.replace(pattern, ' ')
  }

  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links keep their label
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function buildSearchIndex(): Promise<SearchRecord[]> {
  const docs = await getAllDocs()

  return docs.map(doc => ({
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    section: getSectionForSlug(doc.slug)?.title ?? '',
    headings: doc.toc.map(entry => entry.title),
    body: toPlainText(doc.content).slice(0, BODY_CHARACTER_LIMIT),
  }))
}
