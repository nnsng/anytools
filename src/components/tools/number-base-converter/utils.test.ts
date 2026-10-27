import { describe, expect, it } from 'vite-plus/test'

import { bitLength, formatInBase, groupDigits, parseInBase } from './utils'

describe('parseInBase', () => {
	it('parses each common base', () => {
		expect(parseInBase('1010', 2)).toBe(10n)
		expect(parseInBase('777', 8)).toBe(511n)
		expect(parseInBase('255', 10)).toBe(255n)
		expect(parseInBase('ff', 16)).toBe(255n)
		expect(parseInBase('zz', 36)).toBe(1295n)
	})

	it('is case insensitive and accepts separators and a matching prefix', () => {
		expect(parseInBase('0xFF', 16)).toBe(255n)
		expect(parseInBase('0b1111_0000', 2)).toBe(240n)
		expect(parseInBase('1111 0000', 2)).toBe(240n)
		expect(parseInBase('0o17', 8)).toBe(15n)
	})

	it('handles signs', () => {
		expect(parseInBase('-ff', 16)).toBe(-255n)
		expect(parseInBase('+10', 10)).toBe(10n)
	})

	it('is exact above Number.MAX_SAFE_INTEGER', () => {
		expect(parseInBase('9007199254740993', 10)).toBe(9007199254740993n)
		expect(parseInBase('ffffffffffffffffffff', 16)).toBe(2n ** 80n - 1n)
	})

	it('returns null for empty input', () => {
		expect(parseInBase('', 10)).toBeNull()
		expect(parseInBase('  ', 2)).toBeNull()
		expect(parseInBase('-', 10)).toBeNull()
	})

	it('names the invalid digit', () => {
		expect(() => parseInBase('12', 2)).toThrow('Invalid digit "2" for base 2')
		expect(() => parseInBase('0xff', 10)).toThrow('Invalid digit "x" for base 10')
	})
})

describe('formatInBase', () => {
	it('formats with uppercase digits', () => {
		expect(formatInBase(255n, 16)).toBe('FF')
		expect(formatInBase(-255n, 2)).toBe('-11111111')
	})

	it('groups digits from the right', () => {
		expect(formatInBase(255n, 2, 4)).toBe('1111 1111')
		expect(formatInBase(0x1234567n, 16, 4)).toBe('123 4567')
		expect(groupDigits('-12345', 3)).toBe('-12 345')
	})

	it('round-trips with parseInBase', () => {
		for (const base of [2, 8, 10, 16, 36]) {
			expect(parseInBase(formatInBase(123456789012345678901234567890n, base), base)).toBe(
				123456789012345678901234567890n,
			)
		}
	})
})

describe('bitLength', () => {
	it('counts bits of the magnitude', () => {
		expect(bitLength(0n)).toBe(1)
		expect(bitLength(255n)).toBe(8)
		expect(bitLength(256n)).toBe(9)
		expect(bitLength(-255n)).toBe(8)
	})
})
