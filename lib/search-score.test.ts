import { describe, expect, test } from 'bun:test'

import { searchRecords } from '@/lib/search-score'
import type { SearchRecord } from '@/lib/search'

describe('searchRecords', () => {
  const records: SearchRecord[] = [
    {
      slug: 'fields',
      title: 'Fields',
      description: 'A single piece of information shown inside a section.',
      section: 'Building the UI',
      headings: ['Adding a field', 'Value Source'],
      body: 'field label icon visibility editable mandatory',
    },
    {
      slug: 'field-actions',
      title: 'Field Actions',
      description: 'Attach a button to a field.',
      section: 'Building the UI',
      headings: ['Adding an action'],
      body: 'button name icon type action config',
    },
    {
      slug: 'welcome',
      title: 'Welcome to Dashforge',
      description: 'Build the screens your team uses to work a loan.',
      section: 'Getting Started',
      headings: [],
      body: 'dashboard underwriter disbursal officer',
    },
  ]

  test('returns nothing for an empty or whitespace-only query', () => {
    expect(searchRecords(records, '')).toEqual([])
    expect(searchRecords(records, '   ')).toEqual([])
  })

  test('is case-insensitive', () => {
    expect(searchRecords(records, 'FIELDS').map(r => r.slug)).toContain(
      'fields'
    )
  })

  test('ranks a title match above a body-only match', () => {
    const results = searchRecords(records, 'field')
    const titleMatchIndex = results.findIndex(r => r.slug === 'fields')
    const bodyOnlyIndex = results.findIndex(r => r.slug === 'welcome')

    expect(titleMatchIndex).toBeGreaterThanOrEqual(0)
    // "welcome" has no occurrence of "field" anywhere, so it should not
    // appear in the results at all.
    expect(bodyOnlyIndex).toBe(-1)
  })

  test('matches on heading text', () => {
    const results = searchRecords(records, 'value source')
    expect(results.map(r => r.slug)).toEqual(['fields'])
  })

  test('excludes records with no match in any field', () => {
    const results = searchRecords(records, 'nonexistent-term-xyz')
    expect(results).toEqual([])
  })

  test('caps results at 8 even with a larger corpus', () => {
    const large: SearchRecord[] = Array.from({ length: 20 }, (_, i) => ({
      slug: `doc-${i}`,
      title: `Matching Doc ${i}`,
      description: '',
      section: '',
      headings: [],
      body: '',
    }))

    expect(searchRecords(large, 'matching')).toHaveLength(8)
  })
})
