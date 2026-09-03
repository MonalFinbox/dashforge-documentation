import { describe, expect, test } from 'bun:test'

import { extractToc } from '@/lib/toc'

describe('extractToc', () => {
  test('extracts h2 and h3 headings with the right level', () => {
    const toc = extractToc('## Section One\n\nbody\n\n### Sub Section\n')

    expect(toc).toEqual([
      { id: 'section-one', title: 'Section One', level: 2 },
      { id: 'sub-section', title: 'Sub Section', level: 3 },
    ])
  })

  test('ignores h1 and h4+', () => {
    const toc = extractToc('# Title\n\n## Real Heading\n\n#### Too Deep\n')

    expect(toc).toEqual([{ id: 'real-heading', title: 'Real Heading', level: 2 }])
  })

  test('strips inline markdown from the title but keeps the slug consistent', () => {
    const toc = extractToc('## The **Publish** Button and `code`\n')

    expect(toc).toEqual([
      {
        id: 'the-publish-button-and-code',
        title: 'The Publish Button and code',
        level: 2,
      },
    ])
  })

  test('ignores headings inside fenced code blocks', () => {
    const toc = extractToc('## Real\n\n```md\n## Not A Real Heading\n```\n')

    expect(toc).toEqual([{ id: 'real', title: 'Real', level: 2 }])
  })

  test('does not match a heading marker inside an indented code block', () => {
    // 4-space indentation means the line does not start with "#", so the
    // heading regex (anchored at column 0) never matches it in the first place.
    const toc = extractToc('## Real\n\n    ## indented, not a heading\n')

    expect(toc).toEqual([{ id: 'real', title: 'Real', level: 2 }])
  })

  test('does not detect setext-style headings (known limitation)', () => {
    // extractToc only recognises ATX (#) headings. A setext heading (text
    // underlined with === or ---) still renders as an <h1>/<h2> via remark,
    // so rehype-slug will anchor it, but it will not appear in the TOC.
    // Content in this guide should stick to ATX headings.
    const toc = extractToc('Setext Heading\n==============\n')

    expect(toc).toEqual([])
  })

  test('deduplicates slugs the same way github-slugger does for repeated titles', () => {
    const toc = extractToc('## Overview\n\n## Overview\n')

    expect(toc.map(entry => entry.id)).toEqual(['overview', 'overview-1'])
  })

  test('drops a heading that is empty after stripping markdown', () => {
    const toc = extractToc('## ****\n')

    expect(toc).toEqual([])
  })

  test('returns an empty list for content with no headings', () => {
    expect(extractToc('just a paragraph, no headings here')).toEqual([])
  })
})
