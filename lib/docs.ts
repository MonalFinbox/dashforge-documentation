import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

import { flatNavigation } from '@/config/navigation'
import { extractToc, type TocEntry } from '@/lib/toc'

const DOCS_DIRECTORY = path.join(process.cwd(), 'content', 'docs')

export interface DocFrontmatter {
  title: string
  description: string
}

export interface Doc extends DocFrontmatter {
  slug: string
  content: string
  toc: TocEntry[]
}

function assertFrontmatter(
  data: Record<string, unknown>,
  slug: string
): DocFrontmatter {
  const { title, description } = data

  if (typeof title !== 'string' || !title) {
    throw new Error(`Doc "${slug}" is missing a "title" in its frontmatter`)
  }

  if (typeof description !== 'string' || !description) {
    throw new Error(
      `Doc "${slug}" is missing a "description" in its frontmatter`
    )
  }

  return { title, description }
}

export async function getDoc(slug: string): Promise<Doc | null> {
  const filePath = path.join(DOCS_DIRECTORY, `${slug}.mdx`)

  let raw: string
  try {
    raw = await fs.readFile(filePath, 'utf8')
  } catch {
    return null
  }

  const { data, content } = matter(raw)

  return {
    slug,
    ...assertFrontmatter(data, slug),
    content,
    toc: extractToc(content),
  }
}

export async function getAllDocs(): Promise<Doc[]> {
  const docs = await Promise.all(
    flatNavigation.map(item => getDoc(item.slug))
  )

  return docs.filter((doc): doc is Doc => doc !== null)
}

export function getDocSlugs(): string[] {
  return flatNavigation.map(item => item.slug)
}
