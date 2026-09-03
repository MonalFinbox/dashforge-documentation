import type { SearchRecord } from '@/lib/search'

const MAX_RESULTS = 8

/**
 * Field-weighted substring match. The corpus is a handful of chapters, so a
 * scored linear scan stays well under a frame and avoids an index dependency.
 *
 * Kept in its own module, separate from lib/search.ts, because this runs in
 * the browser (the search dialog is a client component). lib/search.ts pulls
 * in lib/docs.ts, which reads from the filesystem, that chain must never end
 * up in a client bundle.
 */
export function searchRecords(
  records: SearchRecord[],
  query: string
): SearchRecord[] {
  const term = query.trim().toLowerCase()
  if (!term) return []

  const scored = records
    .map(record => {
      let score = 0

      if (record.title.toLowerCase().includes(term)) score += 10
      if (record.description.toLowerCase().includes(term)) score += 4
      if (record.headings.some(h => h.toLowerCase().includes(term))) score += 3
      if (record.body.toLowerCase().includes(term)) score += 1

      return { record, score }
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, MAX_RESULTS).map(entry => entry.record)
}
