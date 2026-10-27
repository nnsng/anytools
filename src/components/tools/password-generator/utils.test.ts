import { describe, expect, it } from 'vite-plus/test'

import { calculateStrength, generatePassword, type PasswordOptions } from './utils'

const ALL: PasswordOptions = {
	length: 24,
	uppercase: true,
	lowercase: true,
	digits: true,
	symbols: true,
	avoidAmbiguous: false,
}

describe('generatePassword', () => {
	it('honours length', () => {
		expect(generatePassword({ ...ALL, length: 40 })).toHaveLength(40)
	})

	it('only uses enabled character sets', () => {
		const password = generatePassword({
			...ALL,
			uppercase: false,
			lowercase: false,
			symbols: false,
		})
		expect(password).toMatch(/^[0-9]+$/)
	})

	it('excludes ambiguous characters when requested', () => {
		const password = generatePassword({ ...ALL, length: 500, avoidAmbiguous: true })
		expect(password).not.toMatch(/[IOlo01|]/)
	})

	it('returns an empty string when nothing is enabled', () => {
		expect(
			generatePassword({
				...ALL,
				uppercase: false,
				lowercase: false,
				digits: false,
				symbols: false,
			}),
		).toBe('')
	})
})

describe('calculateStrength', () => {
	it('is empty for an empty password', () => {
		expect(calculateStrength('', ALL).label).toBe('Empty')
	})

	it('rates short simple passwords as weak and long mixed ones as secure', () => {
		expect(calculateStrength('abc', ALL).label).toBe('Weak')
		expect(calculateStrength('Abcdefghijk1234!@#', ALL).label).toBe('Secure')
	})
})
