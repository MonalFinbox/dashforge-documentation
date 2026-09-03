import { describe, expect, test } from 'bun:test'

import { toPlainText } from '@/lib/search'

describe('toPlainText', () => {
  test('strips fenced code blocks entirely', () => {
    expect(toPlainText('before\n```ts\nconst x = 1\n```\nafter')).toBe(
      'before after'
    )
  })

  test('strips jsx and html tags but keeps their text content separate', () => {
    expect(toPlainText('<Callout>Careful here</Callout>')).toBe('Careful here')
  })

  test('drops images entirely', () => {
    expect(toPlainText('see ![a screenshot](utils/ss.jpg) below')).toBe(
      'see below'
    )
  })

  test('keeps link label text and drops the url', () => {
    expect(toPlainText('read the [Fields](/docs/fields) chapter')).toBe(
      'read the Fields chapter'
    )
  })

  test('strips heading markers and emphasis characters', () => {
    expect(toPlainText('## A **bold** and _italic_ heading')).toBe(
      'A bold and italic heading'
    )
  })

  test('collapses repeated whitespace from stripped markup into single spaces', () => {
    expect(toPlainText('a\n\n\n``` \ncode\n``` \n\nb')).toBe('a b')
  })
})
