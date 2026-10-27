const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'
const PREFIX_BASES: Record<string, number> = { '0x': 16, '0b': 2, '0o': 8 }

export const MIN_BASE = 2
export const MAX_BASE = 36

/**
 * Parses `text` as an integer in `base`. Returns null for empty input and throws a readable
 * error for invalid digits. Accepts a sign, a matching 0x/0b/0o prefix, and `_` or spaces as separators.
 */
export function parseInBase(text: string, base: number): bigint | null {
	let cleaned = text.replace(/[\s_]/g, '').toLowerCase()
	if (!cleaned) return null

	let isNegative = false
	if (cleaned.startsWith('-') || cleaned.startsWith('+')) {
		isNegative = cleaned.startsWith('-')
		cleaned = cleaned.slice(1)
	}

	const prefix = cleaned.slice(0, 2)
	if (PREFIX_BASES[prefix] === base) cleaned = cleaned.slice(2)
	if (!cleaned) return null

	const bigBase = BigInt(base)
	let value = 0n
	for (const char of cleaned) {
		const digit = DIGITS.indexOf(char)
		if (digit === -1 || digit >= base) {
			throw new Error(`Invalid digit "${char}" for base ${base}`)
		}
		value = value * bigBase + BigInt(digit)
	}
	return isNegative ? -value : value
}

/** Inserts a space every `groupSize` digits, counting from the right. The sign is preserved. */
export function groupDigits(text: string, groupSize: number): string {
	const sign = text.startsWith('-') ? '-' : ''
	const digits = sign ? text.slice(1) : text
	const groups: string[] = []
	for (let end = digits.length; end > 0; end -= groupSize) {
		groups.unshift(digits.slice(Math.max(0, end - groupSize), end))
	}
	return sign + groups.join(' ')
}

export function formatInBase(value: bigint, base: number, groupSize = 0): string {
	const text = value.toString(base).toUpperCase()
	return groupSize > 0 ? groupDigits(text, groupSize) : text
}

/** Number of bits needed for the magnitude of `value` (0 needs 1 bit). */
export function bitLength(value: bigint): number {
	const magnitude = value < 0n ? -value : value
	return magnitude.toString(2).length
}
