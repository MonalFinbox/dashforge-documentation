export const siteConfig = {
  name: 'Dashforge Docs',
  shortName: 'Dashforge',
  description:
    'Build the screens your team uses to work a loan, without writing code. The complete guide to the Dashforge UI Builder.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  org: 'Finbox',
} as const

export type SiteConfig = typeof siteConfig
