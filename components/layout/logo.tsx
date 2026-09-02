import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex items-center justify-center rounded-md bg-accent text-[0.6875rem] font-bold text-white',
        className
      )}
    >
      D
    </span>
  )
}
