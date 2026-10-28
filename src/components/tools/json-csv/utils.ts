export type Delimiter = ',' | ';' | '\t' | '|'

export type JsonToCsvOptions = {
	delimiter: Delimiter
	includeHeader: boolean
	/** Turns nested objects into dotted columns (`a.b`) instead of JSON strings. */
	flatten: boolean
}

export type CsvToJsonOptions = {
	delimiter: Delimiter
	hasHeader: boolean
	/** Converts numbers, booleans and `null` instead of keeping every value a string. */
	inferTypes: boolean
}

const BOM = '﻿'
const NUMBER_PATTERN = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Parses RFC 4180 CSV: quoted fields, escaped quotes, newlines inside quotes, CRLF and a BOM. */
export function parseCsv(text: string, delimiter: Delimiter): string[][] {
	const input = text.startsWith(BOM) ? text.slice(1) : text
	const rows: string[][] = []
	let row: string[] = []
	let field = ''
	let isQuoted = false
	let wasQuoted = false

	const endField = () => {
		row.push(field)
		field = ''
		wasQuoted = false
	}
	const endRow = () => {
		endField()
		// Skip blank lines (a single empty, unquoted field)
		if (row.length > 1 || row[0] !== '') rows.push(row)
		row = []
	}

	for (let i = 0; i < input.length; i++) {
		const char = input.charAt(i)

		if (isQuoted) {
			if (char !== '"') {
				field += char
			} else if (input.charAt(i + 1) === '"') {
				field += '"'
				i++
			} else {
				isQuoted = false
			}
		} else if (char === '"' && field === '' && !wasQuoted) {
			isQuoted = true
			wasQuoted = true
		} else if (char === delimiter) {
			endField()
		} else if (char === '\n' || char === '\r') {
			if (char === '\r' && input.charAt(i + 1) === '\n') i++
			endRow()
		} else {
			field += char
		}
	}

	if (isQuoted) throw new Error('Unterminated quoted field: a quote was opened but never closed')
	if (field !== '' || wasQuoted || row.length > 0) endRow()
	return rows
}

function quoteField(value: string, delimiter: Delimiter): string {
	const needsQuotes =
		value.includes(delimiter) || value.includes('"') || value.includes('\n') || value.includes('\r')
	return needsQuotes ? `"${value.replaceAll('"', '""')}"` : value
}

export function stringifyCsv(rows: string[][], delimiter: Delimiter): string {
	return rows
		.map((row) => row.map((value) => quoteField(value, delimiter)).join(delimiter))
		.join('\n')
}

function cellToString(value: unknown): string {
	if (value === null || value === undefined) return ''
	if (typeof value === 'string') return value
	if (typeof value === 'object') return JSON.stringify(value)
	if (typeof value === 'number' || typeof value === 'boolean') return String(value)
	return ''
}

function flattenRecord(record: Record<string, unknown>, prefix = ''): Record<string, unknown> {
	const flat: Record<string, unknown> = {}
	for (const [key, value] of Object.entries(record)) {
		const path = prefix ? `${prefix}.${key}` : key
		if (isRecord(value) && Object.keys(value).length > 0)
			Object.assign(flat, flattenRecord(value, path))
		else flat[path] = value
	}
	return flat
}

export function jsonToCsv(text: string, options: JsonToCsvOptions): string {
	const parsed: unknown = JSON.parse(text)
	const items: unknown[] = Array.isArray(parsed) ? parsed : [parsed]
	if (items.length === 0) return ''

	if (items.every(Array.isArray)) {
		const rows = (items as unknown[][]).map((row) => row.map(cellToString))
		return stringifyCsv(rows, options.delimiter)
	}

	if (items.every(isRecord)) {
		const records = (items as Record<string, unknown>[]).map((record) =>
			options.flatten ? flattenRecord(record) : record,
		)
		const header: string[] = []
		for (const record of records) {
			for (const key of Object.keys(record)) if (!header.includes(key)) header.push(key)
		}
		const rows = records.map((record) => header.map((key) => cellToString(record[key])))
		return stringifyCsv(options.includeHeader ? [header, ...rows] : rows, options.delimiter)
	}

	if (items.every((item) => !Array.isArray(item) && !isRecord(item))) {
		const rows = items.map((item) => [cellToString(item)])
		return stringifyCsv(options.includeHeader ? [['value'], ...rows] : rows, options.delimiter)
	}

	throw new Error('Array items must all be objects, all be arrays, or all be plain values')
}

function inferValue(value: string): unknown {
	if (value === 'true') return true
	if (value === 'false') return false
	if (value === 'null') return null
	if (NUMBER_PATTERN.test(value)) {
		const number = Number(value)
		// Keep huge integers as strings so no digits are silently lost
		if (Number.isFinite(number) && (!/^-?\d+$/.test(value) || Number.isSafeInteger(number)))
			return number
	}
	return value
}

function uniqueHeaders(headerRow: string[], columnCount: number): string[] {
	const seen = new Map<string, number>()
	return Array.from({ length: columnCount }, (_, index) => {
		const base = headerRow[index]?.trim() || `column_${index + 1}`
		const count = (seen.get(base) ?? 0) + 1
		seen.set(base, count)
		return count === 1 ? base : `${base}_${count}`
	})
}

export function csvToJson(text: string, options: CsvToJsonOptions, indent = 2): string {
	const rows = parseCsv(text, options.delimiter)
	if (rows.length === 0) return '[]'

	const convert = (value: string) => (options.inferTypes ? inferValue(value) : value)
	const columnCount = Math.max(...rows.map((row) => row.length))

	if (!options.hasHeader) {
		const padded = rows.map((row) =>
			Array.from({ length: row.length }, (_, i) => convert(row[i] ?? '')),
		)
		return JSON.stringify(padded, null, indent)
	}

	const [headerRow = [], ...dataRows] = rows
	const headers = uniqueHeaders(headerRow, columnCount)
	const records = dataRows.map((row) =>
		Object.fromEntries(headers.map((header, index) => [header, convert(row[index] ?? '')])),
	)
	return JSON.stringify(records, null, indent)
}
