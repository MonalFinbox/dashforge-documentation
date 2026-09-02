import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'

import { Callout } from '@/components/content/callout'
import { Screenshot } from '@/components/content/screenshot'
import { VideoPlayer } from '@/components/content/video-player'
import { cn } from '@/lib/utils'

type HeadingProps = React.ComponentPropsWithoutRef<'h2'>

function AnchoredHeading({
  as: Tag,
  className,
  children,
  id,
  ...props
}: HeadingProps & { as: 'h2' | 'h3' | 'h4' }) {
  return (
    <Tag id={id} className={cn('group scroll-mt-24', className)} {...props}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          #
        </a>
      )}
    </Tag>
  )
}

export const mdxComponents: MDXComponents = {
  h2: props => (
    <AnchoredHeading
      as="h2"
      {...props}
      className="mt-12 mb-4 border-t border-line pt-10 text-xl font-semibold tracking-tight text-ink first:mt-0 first:border-0 first:pt-0"
    />
  ),
  h3: props => (
    <AnchoredHeading
      as="h3"
      {...props}
      className="mt-8 mb-3 text-base font-semibold tracking-tight text-ink"
    />
  ),
  h4: props => (
    <AnchoredHeading
      as="h4"
      {...props}
      className="mt-6 mb-2 text-sm font-semibold text-ink"
    />
  ),

  a: ({ href = '', children, ...props }) => {
    const isInternal = href.startsWith('/') || href.startsWith('#')

    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      )
    }

    return (
      <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
        {children}
      </a>
    )
  },

  code: props => (
    <code
      {...props}
      className="rounded-[5px] border border-line bg-subtle px-[0.3em] py-[0.15em] font-mono text-[0.85em] text-ink"
    />
  ),

  pre: props => (
    <pre
      {...props}
      className="scrollbar-slim my-6 overflow-x-auto rounded-xl border border-line bg-subtle p-4 font-mono text-[0.8125rem] leading-relaxed text-ink [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[inherit]"
    />
  ),

  blockquote: props => (
    <blockquote
      {...props}
      className="my-6 border-l-2 border-line-strong pl-4 text-ink-muted italic"
    />
  ),

  hr: () => <hr className="my-10 border-t border-line" />,

  table: props => (
    <div className="scrollbar-slim my-6 overflow-x-auto rounded-xl border border-line">
      <table {...props} className="w-full border-collapse text-sm" />
    </div>
  ),
  thead: props => <thead {...props} className="bg-subtle" />,
  th: props => (
    <th
      {...props}
      className="border-b border-line px-4 py-2.5 text-left text-xs font-semibold tracking-wide text-ink whitespace-nowrap"
    />
  ),
  td: props => (
    <td
      {...props}
      className="border-b border-line px-4 py-2.5 align-top text-ink-secondary last:border-r-0"
    />
  ),
  tbody: props => <tbody {...props} className="[&>tr:last-child>td]:border-b-0" />,

  Callout,
  Screenshot,
  Video: VideoPlayer,
}
