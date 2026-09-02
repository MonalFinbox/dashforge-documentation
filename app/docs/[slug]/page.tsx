import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { getDoc, getDocSlugs } from '@/lib/docs'
import { getSectionForSlug } from '@/config/navigation'
import { mdxComponents } from '@/components/content/mdx-components'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Pager } from '@/components/layout/pager'
import { TableOfContents } from '@/components/layout/table-of-contents'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getDocSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = await getDoc(slug)

  if (!doc) return {}

  return {
    title: doc.title,
    description: doc.description,
    openGraph: { title: doc.title, description: doc.description },
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params
  const doc = await getDoc(slug)

  if (!doc) notFound()

  const section = getSectionForSlug(slug)

  return (
    <>
      <main className="min-w-0 flex-1 py-10 lg:px-10">
        <article className="mx-auto max-w-(--layout-content-width)">
          {section && <Breadcrumbs section={section.title} page={doc.title} />}

          <h1 className="mt-3 text-[2rem] leading-tight font-semibold tracking-tight text-ink">
            {doc.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            {doc.description}
          </p>

          <div className="doc-prose mt-10">
            <MDXRemote
              source={doc.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>

          <Pager slug={slug} />
        </article>
      </main>

      <aside className="hidden w-(--layout-toc-width) shrink-0 xl:block">
        <div className="scrollbar-slim sticky top-(--layout-header-height) max-h-[calc(100vh-var(--layout-header-height))] overflow-y-auto py-10">
          <TableOfContents entries={doc.toc} />
        </div>
      </aside>
    </>
  )
}
