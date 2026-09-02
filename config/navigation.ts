export interface NavItem {
  title: string
  slug: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

/**
 * Single source of truth for sidebar order, breadcrumbs, and prev/next paging.
 * Every slug here must have a matching file at content/docs/<slug>.mdx.
 */
export const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Welcome to Dashforge', slug: 'welcome' },
      { title: 'Creating a Dashboard', slug: 'creating-a-dashboard' },
      { title: 'Dashboard Overview', slug: 'dashboard-overview' },
      { title: 'The Builder Workspace', slug: 'the-workspace' },
    ],
  },
  {
    title: 'Building the UI',
    items: [
      { title: 'Tabs and Components', slug: 'tabs-and-components' },
      { title: 'Creating a Tab', slug: 'creating-a-tab' },
      { title: 'Creating a Component', slug: 'creating-a-component' },
      { title: 'Sections', slug: 'sections' },
      { title: 'Fields', slug: 'fields' },
      { title: 'Field Actions', slug: 'field-actions' },
      { title: 'Line Items', slug: 'line-items' },
      { title: 'Documents', slug: 'documents' },
      { title: 'Tab Actions', slug: 'tab-actions' },
      { title: 'Components', slug: 'components' },
      { title: 'Cloning a Dashboard', slug: 'cloning-a-dashboard' },
    ],
  },
  {
    title: 'Publishing',
    items: [{ title: 'Preview and Publish', slug: 'preview-and-publish' }],
  },
  {
    title: 'FAQ',
    items: [{ title: 'Frequently Asked Questions', slug: 'faq' }],
  },
]

export const flatNavigation: NavItem[] = navigation.flatMap(
  section => section.items
)

export function getSectionForSlug(slug: string): NavSection | undefined {
  return navigation.find(section =>
    section.items.some(item => item.slug === slug)
  )
}

export function getPager(slug: string): {
  previous: NavItem | null
  next: NavItem | null
} {
  const index = flatNavigation.findIndex(item => item.slug === slug)

  if (index === -1) return { previous: null, next: null }

  return {
    previous: index > 0 ? flatNavigation[index - 1] : null,
    next:
      index < flatNavigation.length - 1 ? flatNavigation[index + 1] : null,
  }
}
