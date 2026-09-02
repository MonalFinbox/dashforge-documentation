import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { getPager } from '@/config/navigation'

interface PagerProps {
  slug: string
}

export function Pager({ slug }: PagerProps) {
  const { previous, next } = getPager(slug)

  if (!previous && !next) return null

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/docs/${previous.slug}`}
          className="group flex flex-col gap-1 rounded-xl border border-line px-4 py-3.5 transition-colors hover:border-line-strong hover:bg-subtle"
        >
          <span className="flex items-center gap-1.5 text-xs text-ink-muted">
            <ArrowLeft className="size-3.5" />
            Previous
          </span>
          <span className="text-sm font-medium text-ink transition-colors group-hover:text-accent">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next && (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-col items-end gap-1 rounded-xl border border-line px-4 py-3.5 text-right transition-colors hover:border-line-strong hover:bg-subtle sm:col-start-2"
        >
          <span className="flex items-center gap-1.5 text-xs text-ink-muted">
            Next
            <ArrowRight className="size-3.5" />
          </span>
          <span className="text-sm font-medium text-ink transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  )
}
