export type MatchGroup = {
	index: number
	content: string
	name: string | undefined
}

export type MatchDetail = {
	index: number
	text: string
	groups: MatchGroup[]
}

export type RegexFlags = {
	g: boolean
	i: boolean
	m: boolean
	s: boolean
	u: boolean
	y: boolean
}

export type FindMatchesResult = {
	matches: MatchDetail[]
	error: string | null
}

export const MAX_MATCHES = 5000

export function toFlagsString(flags: RegexFlags): string {
	return Object.entries(flags)
		.filter(([, isActive]) => isActive)
		.map(([flag]) => flag)
		.join('')
}

/** Maps capture-group position to its name by scanning the pattern source in order. */
function getGroupNames(pattern: string): Map<number, string> {
	const names = new Map<number, string>()
	let groupIndex = 0
	let isInClass = false

	for (let i = 0; i < pattern.length; i++) {
		const char = pattern[i]
		if (char === '\\') {
			i++
		} else if (isInClass) {
			if (char === ']') isInClass = false
		} else if (char === '[') {
			isInClass = true
		} else if (char === '(') {
			if (pattern[i + 1] !== '?') {
				groupIndex++
				continue
			}
			const named = /^\(\?<([A-Za-z_$][\w$]*)>/.exec(pattern.slice(i))
			if (named) {
				groupIndex++
				names.set(groupIndex, named[1] ?? '')
			}
		}
	}
	return names
}

function toMatchDetail(match: RegExpExecArray, groupNames: Map<number, string>): MatchDetail {
	const groups: MatchGroup[] = []
	for (let i = 1; i < match.length; i++) {
		groups.push({ index: i, content: match[i] ?? '', name: groupNames.get(i) })
	}
	return { index: match.index, text: match[0], groups }
}

export function findMatches(pattern: string, flags: string, text: string): FindMatchesResult {
	if (!pattern) return { matches: [], error: null }

	let regex: RegExp
	try {
		regex = new RegExp(pattern, flags)
	} catch (err) {
		return {
			matches: [],
			error: err instanceof Error ? err.message : 'Invalid regular expression',
		}
	}

	const matches: MatchDetail[] = []
	const isGlobal = regex.global
	const groupNames = getGroupNames(pattern)

	let match = regex.exec(text)
	while (match !== null && matches.length < MAX_MATCHES) {
		matches.push(toMatchDetail(match, groupNames))
		if (!isGlobal) break
		// Advance past empty matches so the loop always makes progress
		if (match[0].length === 0) regex.lastIndex++
		match = regex.exec(text)
	}

	return { matches, error: null }
}
