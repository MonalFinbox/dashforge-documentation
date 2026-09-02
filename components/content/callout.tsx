import { Info, Lightbulb, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

type CalloutType = 'note' | 'tip' | 'warning'

const VARIANTS: Record<
  CalloutType,
  { icon: typeof Info; container: string; icon_color: string }
> = {
  note: {
    icon: Info,
    container: 'border-note-line bg-note',
    icon_color: 'text-note-ink',
  },
  tip: {
    icon: Lightbulb,
    container: 'border-emerald-200 bg-emerald-50',
    icon_color: 'text-emerald-700',
  },
  warning: {
    icon: TriangleAlert,
    container: 'border-amber-200 bg-amber-50',
    icon_color: 'text-amber-700',
  },
}

interface CalloutProps {
  type?: CalloutType
  children: React.ReactNode
}

export function Callout({ type = 'note', children }: CalloutProps) {
  const variant = VARIANTS[type]
  const Icon = variant.icon

  return (
    <aside
      className={cn(
        'my-6 flex gap-3 rounded-xl border px-4 py-3.5',
        variant.container
      )}
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', variant.icon_color)} />
      <div className="min-w-0 text-[0.875rem] leading-relaxed text-ink-secondary [&>*+*]:mt-2">
        {children}
      </div>
    </aside>
  )
}
