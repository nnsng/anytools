export type PasswordOptions = {
	length: number
	uppercase: boolean
	lowercase: boolean
	digits: boolean
	symbols: boolean
	avoidAmbiguous: boolean
}

export type Strength = {
	label: 'Empty' | 'Weak' | 'Fair' | 'Strong' | 'Secure'
	color: string
	percentage: number
}

export const MIN_LENGTH = 6
export const MAX_LENGTH = 64

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-='

export function clampLength(length: number): number {
	return Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, length))
}

export function buildCharset(options: PasswordOptions): string {
	const { uppercase, lowercase, digits, symbols, avoidAmbiguous } = options
	let charset = ''
	if (uppercase) charset += avoidAmbiguous ? UPPER.replace(/[IO]/g, '') : UPPER
	if (lowercase) charset += avoidAmbiguous ? LOWER.replace(/[lo]/g, '') : LOWER
	if (digits) charset += avoidAmbiguous ? DIGITS.replace(/[01]/g, '') : DIGITS
	if (symbols) charset += avoidAmbiguous ? SYMBOLS.replace(/[|]/g, '') : SYMBOLS
	return charset
}

export function generatePassword(options: PasswordOptions): string {
	const charset = buildCharset(options)
	if (!charset) return ''

	// Reject values from the biased tail so every character is equally likely
	const maxUnbiased = Math.floor(0x100000000 / charset.length) * charset.length
	const buffer = new Uint32Array(1)
	let password = ''
	while (password.length < options.length) {
		crypto.getRandomValues(buffer)
		const value = buffer[0] ?? maxUnbiased
		if (value < maxUnbiased) password += charset.charAt(value % charset.length)
	}
	return password
}

export function calculateStrength(password: string, options: PasswordOptions): Strength {
	if (!password) return { label: 'Empty', color: 'bg-slate-700', percentage: 0 }

	let score = 0
	if (password.length >= 8) score += 1
	if (password.length >= 12) score += 1
	if (password.length >= 16) score += 1

	if (options.uppercase && /[A-Z]/.test(password)) score++
	if (options.lowercase && /[a-z]/.test(password)) score++
	if (options.digits && /[0-9]/.test(password)) score++
	if (options.symbols && /[^A-Za-z0-9]/.test(password)) score++

	if (score <= 3) return { label: 'Weak', color: 'bg-red-500', percentage: 25 }
	if (score <= 5) return { label: 'Fair', color: 'bg-yellow-500', percentage: 50 }
	if (score <= 6) return { label: 'Strong', color: 'bg-blue-500', percentage: 75 }
	return { label: 'Secure', color: 'bg-matrix', percentage: 100 }
}
