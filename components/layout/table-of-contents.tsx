'use client'

import { useEffect, useState } from 'react'

import type { TocEntry } from '@/lib/toc'
import { cn } from '@/lib/utils'

interface TableOfContentsProps {
  entries: TocEntry[]
}

export function TableOfContents({ entries }: TableOfContentsProps) {
  const activeId = useActiveHeading(entries)

  if (entries.length === 0) return null

  return (
    <nav aria-label="On this page">
      <h2 className="text-xxs font-semibold tracking-[0.12em] text-ink-muted uppercase">
        On this page
      </h2>

      <ul className="mt-3 space-y-2 border-l border-line">
        {entries.map(entry => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l py-0.5 text-[0.8125rem] leading-snug transition-colors',
                entry.level === 3 ? 'pr-2 pl-6' : 'pr-2 pl-3',
                activeId === entry.id
                  ? 'border-accent font-medium text-accent'
                  : 'border-transparent text-ink-muted hover:text-ink'
              )}
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Tracks the heading nearest the top of the reading area. rootMargin pins the
 * detection band just under the sticky header so the highlighted entry matches
 * what the reader actually sees.
 */
function useActiveHeading(entries: TocEntry[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (entries.length === 0) return

    const elements = entries
      .map(entry => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      observed => {
        for (const entry of observed) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }

        const firstVisible = entries.find(entry => visible.has(entry.id))
        if (firstVisible) setActiveId(firstVisible.id)
      },
      { rootMargin: '-88px 0px -70% 0px', threshold: 0 }
    )

    for (const element of elements) observer.observe(element)

    return () => observer.disconnect()
  }, [entries])

  return activeId
}
