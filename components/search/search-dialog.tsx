'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Search } from 'lucide-react'

import type { SearchRecord } from '@/lib/search'
import { searchRecords } from '@/lib/search-score'
import { cn } from '@/lib/utils'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const index = useSearchIndex(open)

  const results = searchRecords(index, query)

  const close = useCallback(() => {
    onOpenChange(false)
    setQuery('')
    setHighlighted(0)
  }, [onOpenChange])

  const goTo = useCallback(
    (slug: string) => {
      router.push(`/docs/${slug}`)
      close()
    },
    [router, close]
  )

  useEffect(() => {
    setHighlighted(0)
  }, [query])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setHighlighted(current => Math.min(current + 1, results.length - 1))
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setHighlighted(current => Math.max(current - 1, 0))
        return
      }

      if (event.key === 'Enter' && results[highlighted]) {
        event.preventDefault()
        goTo(results[highlighted].slug)
      }

      if (event.key === 'Tab') trapFocus(event, panelRef.current)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, results, highlighted, close, goTo])

  useEffect(() => {
    if (!open) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 cursor-default bg-ink/20 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line bg-canvas shadow-2xl shadow-ink/10"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-ink-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search the guide..."
            aria-label="Search the guide"
            className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          />
        </div>

        <div className="scrollbar-slim max-h-80 overflow-y-auto p-2">
          {query && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-ink-muted">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {!query && (
            <p className="px-3 py-6 text-center text-sm text-ink-muted">
              Search across every chapter of the guide.
            </p>
          )}

          {results.map((record, position) => (
            <button
              key={record.slug}
              type="button"
              onClick={() => goTo(record.slug)}
              onMouseEnter={() => setHighlighted(position)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                position === highlighted ? 'bg-accent-subtle' : 'bg-transparent'
              )}
            >
              <FileText
                className={cn(
                  'mt-0.5 size-4 shrink-0',
                  position === highlighted ? 'text-accent' : 'text-ink-muted'
                )}
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">
                  {record.title}
                </span>
                <span className="block truncate text-xs text-ink-muted">
                  {record.section} · {record.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function useSearchIndex(enabled: boolean): SearchRecord[] {
  const [index, setIndex] = useState<SearchRecord[]>([])
  const requested = useRef(false)

  useEffect(() => {
    if (!enabled || requested.current) return
    requested.current = true

    fetch('/api/search')
      .then(response => (response.ok ? response.json() : []))
      .then(setIndex)
      .catch(() => setIndex([]))
  }, [enabled])

  return index
}

/** Keeps Tab/Shift+Tab cycling within the dialog instead of reaching the page behind it */
function trapFocus(event: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return

  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  )
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}
