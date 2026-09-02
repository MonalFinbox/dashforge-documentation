'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { flatNavigation } from '@/config/navigation'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { SearchDialog } from '@/components/search/search-dialog'
import { Logo } from '@/components/layout/logo'

export function SiteHeader() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen(current => !current)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 h-(--layout-header-height) border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[100rem] items-center gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(current => !current)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            className="-ml-1 rounded-md p-1.5 text-ink-secondary transition-colors hover:bg-subtle hover:text-ink lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link
            href={`/docs/${flatNavigation[0].slug}`}
            className="flex items-center gap-2.5"
          >
            <Logo className="size-6" />
            <span className="text-[0.9375rem] font-semibold tracking-tight text-ink">
              {siteConfig.shortName}
              <span className="ml-1.5 font-normal text-ink-muted">Docs</span>
            </span>
          </Link>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-line bg-subtle py-1.5 pr-1.5 pl-3 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink-secondary"
          >
            <Search className="size-4" />
            <span className="hidden w-32 text-left sm:inline">Search</span>
            <kbd className="hidden rounded border border-line bg-canvas px-1.5 py-0.5 font-sans text-xxs text-ink-muted sm:inline">
              ⌘K
            </kbd>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 top-(--layout-header-height) z-30 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 cursor-default bg-ink/20"
          />
          <div className="scrollbar-slim relative h-full w-72 max-w-[85vw] overflow-y-auto border-r border-line bg-canvas px-3 py-6">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
