import { ChevronRight } from 'lucide-react'

interface BreadcrumbsProps {
  section: string
  page: string
}

export function Breadcrumbs({ section, page }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-xs text-ink-muted">
        <li>{section}</li>
        <li aria-hidden="true">
          <ChevronRight className="size-3.5" />
        </li>
        <li className="font-medium text-ink-secondary">{page}</li>
      </ol>
    </nav>
  )
}
