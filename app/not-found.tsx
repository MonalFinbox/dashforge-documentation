import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { flatNavigation } from '@/config/navigation'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
        The page you&apos;re looking for may have been renamed or moved.
      </p>
      <Link
        href={`/docs/${flatNavigation[0].slug}`}
        className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Go to the guide
        <ArrowRight className="size-4" />
      </Link>
    </main>
  )
}
