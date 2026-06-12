import type React from 'react'
import { useEffect, useState } from 'react'

type MatchGroup = {
	index: number
	content: string
	name: string | undefined
}

export type MatchDetail = {
	index: number
	text: string
	groups: MatchGroup[]
}

type RegexFlags = {
	g: boolean
	i: boolean
	m: boolean
	s: boolean
	u: boolean
	y: boolean
}

type UseRegexMatcherResult = {
	matches: MatchDetail[]
	regexError: string | null
	highlightedNode: React.ReactNode[]
}

export function useRegexMatcher(
	pattern: string,
	flags: RegexFlags,
	subjectText: string,
): UseRegexMatcherResult {
	const [matches, setMatches] = useState<MatchDetail[]>([])
	const [regexError, setRegexError] = useState<string | null>(null)
	const [highlightedNode, setHighlightedNode] = useState<React.ReactNode[]>([])

	useEffect(() => {
		if (!pattern) {
			setMatches([])
			setRegexError(null)
			setHighlightedNode([subjectText])
			return
		}

		const flagsString = Object.entries(flags)
			.filter(([, active]) => active)
			.map(([f]) => f)
			.join('')

		try {
			const regex = new RegExp(pattern, flagsString)
			setRegexError(null)

			const foundMatches: MatchDetail[] = []
			const parts: React.ReactNode[] = []
			let lastIndex = 0

			if (flags.g) {
				let match: RegExpExecArray | null = regex.exec(subjectText)
				let iterations = 0
				const maxIterations = 5000

				while (match !== null && iterations < maxIterations) {
					iterations++
					const matchIndex = match.index
					const matchText = match[0]

					if (matchText.length === 0) regex.lastIndex++

					const groups: MatchGroup[] = []
					for (let i = 1; i < match.length; i++) {
						groups.push({ index: i, content: match[i] || '', name: undefined })
					}

					foundMatches.push({ index: matchIndex, text: matchText, groups })

					if (matchIndex > lastIndex) {
						parts.push(subjectText.substring(lastIndex, matchIndex))
					}
					parts.push(
						<span
							key={matchIndex}
							className="rounded-xs border-matrix border-b bg-matrix/30 px-0.5 font-bold text-matrix-glow"
							title={`Match at index ${matchIndex}`}
						>
							{matchText}
						</span>,
					)
					lastIndex = regex.lastIndex
					match = regex.exec(subjectText)
				}
				if (lastIndex < subjectText.length) {
					parts.push(subjectText.substring(lastIndex))
				}
			} else {
				const match = regex.exec(subjectText)
				if (match) {
					const matchIndex = match.index
					const matchText = match[0]
					const groups: MatchGroup[] = []
					for (let i = 1; i < match.length; i++) {
						groups.push({ index: i, content: match[i] || '', name: undefined })
					}
					foundMatches.push({ index: matchIndex, text: matchText, groups })
					parts.push(subjectText.substring(0, matchIndex))
					parts.push(
						<span
							key={matchIndex}
							className="rounded-xs border-matrix border-b bg-matrix/30 px-0.5 font-bold text-matrix-glow"
						>
							{matchText}
						</span>,
					)
					parts.push(subjectText.substring(matchIndex + matchText.length))
				} else {
					parts.push(subjectText)
				}
			}

			setMatches(foundMatches)
			setHighlightedNode(parts)
		} catch (err) {
			setRegexError(err instanceof Error ? err.message : 'Invalid regular expression')
			setMatches([])
			setHighlightedNode([subjectText])
		}
	}, [pattern, flags, subjectText])

	return { matches, regexError, highlightedNode }
}
