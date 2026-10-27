import { describe, expect, it } from 'vite-plus/test'

import { deduplicate } from './utils'

describe('deduplicate', () => {
	it('removes duplicates, trims and drops empty lines', () => {
		expect(deduplicate('a\n b \na\n\nb', true, true, true, 'none', 'newline')).toBe('a\nb')
	})

	it('is case insensitive when requested', () => {
		expect(deduplicate('A\na\nB', false, true, true, 'none', 'newline')).toBe('A\nB')
	})

	it('sorts and joins with the chosen separator', () => {
		expect(deduplicate('b,a,c', true, true, true, 'asc', 'comma')).toBe('a, b, c')
	})
})
