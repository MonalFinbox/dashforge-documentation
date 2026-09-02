import { SiteHeader } from '@/components/layout/site-header'
import { SidebarNav } from '@/components/layout/sidebar-nav'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex max-w-[100rem] px-4 sm:px-6">
        <aside className="hidden w-(--layout-sidebar-width) shrink-0 lg:block">
          <div className="scrollbar-slim sticky top-(--layout-header-height) max-h-[calc(100vh-var(--layout-header-height))] overflow-y-auto py-8 pr-6">
            <SidebarNav />
          </div>
        </aside>

        {children}
      </div>
    </div>
  )
}
