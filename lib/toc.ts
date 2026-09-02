import GithubSlugger from 'github-slugger'

export interface TocEntry {
  id: string
  title: string
  level: 2 | 3
}

const HEADING_PATTERN = /^(#{2,3})\s+(.+?)\s*$/gm
const FENCE_PATTERN = /^```[\s\S]*?^```$/gm
const INLINE_MARKDOWN_PATTERN = /(\*\*|__|\*|_|`)/g

/**
 * Slugs are generated with the same algorithm rehype-slug uses, so anchors
 * produced here always match the ids rendered into the document.
 */
export function extractToc(source: string): TocEntry[] {
  const slugger = new GithubSlugger()
  const withoutCodeBlocks = source.replace(FENCE_PATTERN, '')
  const entries: TocEntry[] = []

  for (const match of withoutCodeBlocks.matchAll(HEADING_PATTERN)) {
    const [, hashes, rawTitle] = match
    const title = rawTitle.replace(INLINE_MARKDOWN_PATTERN, '').trim()

    if (!title) continue

    entries.push({
      id: slugger.slug(title),
      title,
      level: hashes.length === 2 ? 2 : 3,
    })
  }

  return entries
}
