import { describe, expect, it } from 'vite-plus/test'

import { findMatches } from './utils'

describe('findMatches', () => {
	it('returns all matches with the g flag', () => {
		const { matches, error } = findMatches('\\d+', 'g', 'a 1 b 22')
		expect(error).toBeNull()
		expect(matches.map((m) => m.text)).toEqual(['1', '22'])
	})

	it('returns only the first match without the g flag', () => {
		expect(findMatches('\\d+', '', 'a 1 b 22').matches).toHaveLength(1)
	})

	it('terminates on empty matches', () => {
		expect(findMatches('x*', 'g', 'ab').matches.length).toBeGreaterThan(0)
	})

	it('reports capture groups and names', () => {
		const [match] = findMatches('(?<word>\\w+)\\s(\\d+)', 'g', 'hello 123').matches
		expect(match?.groups).toEqual([
			{ index: 1, content: 'hello', name: 'word' },
			{ index: 2, content: '123', name: undefined },
		])
	})

	it('ignores parentheses in character classes and non-capturing groups', () => {
		const [match] = findMatches('(?:a)[(](?<n>b)', '', 'a(b').matches
		expect(match?.groups).toEqual([{ index: 1, content: 'b', name: 'n' }])
	})

	it('returns an error for invalid patterns', () => {
		expect(findMatches('(', 'g', 'x').error).toBeTruthy()
	})
})
