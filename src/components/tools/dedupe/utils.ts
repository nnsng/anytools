export type SortOrder = 'none' | 'asc' | 'desc'
export type Separator = 'newline' | 'comma' | 'semicolon'

export function deduplicate(
	text: string,
	caseSensitive: boolean,
	trimWhitespace: boolean,
	removeEmpty: boolean,
	sortOrder: SortOrder,
	separator: Separator,
): string {
	if (!text) return ''

	let items: string[] = []
	if (separator === 'comma') {
		items = text.split(',')
	} else if (separator === 'semicolon') {
		items = text.split(';')
	} else {
		items = text.split(/\r?\n/)
	}

	if (trimWhitespace) {
		items = items.map((item) => item.trim())
	}

	if (removeEmpty) {
		items = items.filter((item) => item.length > 0)
	}

	const seen = new Set<string>()
	const result: string[] = []

	for (const item of items) {
		const key = caseSensitive ? item : item.toLowerCase()
		if (!seen.has(key)) {
			seen.add(key)
			result.push(item)
		}
	}

	if (sortOrder === 'asc') {
		result.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
	} else if (sortOrder === 'desc') {
		result.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }))
	}

	if (separator === 'comma') {
		return result.join(', ')
	}
	if (separator === 'semicolon') {
		return result.join('; ')
	}
	return result.join('\n')
}
