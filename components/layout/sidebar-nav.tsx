'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navigation } from '@/config/navigation'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Documentation">
      {navigation.map((section, index) => (
        <div key={section.title} className={cn(index > 0 && 'mt-7')}>
          <h2 className="px-3 text-xxs font-bold tracking-[0.12em] text-ink uppercase">
            {section.title}
          </h2>

          <ul className="mt-2 space-y-px">
            {section.items.map(item => {
              const href = `/docs/${item.slug}`
              const isActive = pathname === href

              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'block rounded-md px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-accent-subtle font-medium text-accent'
                        : 'text-ink-secondary hover:bg-subtle hover:text-ink'
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
