import { formatDistanceToNow } from 'date-fns'

export type EpochResults = {
	local: string
	utc: string
	iso: string
	relative: string
}

export type DateResults = {
	seconds: number
	millis: number
}

type Converted<T> = { results: T | null; error: string | null }

// A Unix timestamp with 12+ digits is assumed to be in milliseconds
const MILLISECONDS_DIGITS = 12

export function convertEpoch(value: string): Converted<EpochResults> {
	const trimmed = value.trim()
	if (!value) return { results: null, error: null }

	const num = Number(trimmed)
	if (Number.isNaN(num)) return { results: null, error: 'Invalid number value' }

	const date = new Date(trimmed.length >= MILLISECONDS_DIGITS ? num : num * 1000)
	if (Number.isNaN(date.getTime())) {
		return { results: null, error: 'Date conversion failed. Out of range?' }
	}

	return {
		results: {
			local: date.toString(),
			utc: date.toUTCString(),
			iso: date.toISOString(),
			relative: formatDistanceToNow(date, { addSuffix: true }),
		},
		error: null,
	}
}

export function convertDate(value: string): Converted<DateResults> {
	if (!value) return { results: null, error: null }

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return { results: null, error: 'Invalid Date format' }

	return {
		results: { seconds: Math.floor(date.getTime() / 1000), millis: date.getTime() },
		error: null,
	}
}

export function currentEpochSeconds(): number {
	return Math.floor(Date.now() / 1000)
}
