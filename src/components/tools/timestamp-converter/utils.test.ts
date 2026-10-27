import { describe, expect, it } from 'vite-plus/test'

import { convertDate, convertEpoch } from './utils'

describe('convertEpoch', () => {
	it('treats short values as seconds', () => {
		expect(convertEpoch('0').results?.iso).toBe('1970-01-01T00:00:00.000Z')
	})

	it('treats 12+ digit values as milliseconds', () => {
		expect(convertEpoch('1700000000000').results?.iso).toBe('2023-11-14T22:13:20.000Z')
	})

	it('rejects non numeric input', () => {
		expect(convertEpoch('abc')).toEqual({ results: null, error: 'Invalid number value' })
	})

	it('returns nothing for empty input', () => {
		expect(convertEpoch('')).toEqual({ results: null, error: null })
	})
})

describe('convertDate', () => {
	it('converts an ISO date to seconds and millis', () => {
		expect(convertDate('1970-01-01T00:01:00Z').results).toEqual({ seconds: 60, millis: 60000 })
	})

	it('rejects invalid dates', () => {
		expect(convertDate('nope').error).toBe('Invalid Date format')
	})
})
