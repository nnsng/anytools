import { Fragment } from 'react'

import type { MatchDetail } from './utils'

type HighlightedTextProps = {
	text: string
	matches: MatchDetail[]
}

export function HighlightedText({ text, matches }: HighlightedTextProps) {
	const parts: React.ReactNode[] = []
	let cursor = 0

	for (const match of matches) {
		if (match.index < cursor) continue
		if (match.index > cursor) {
			parts.push(<Fragment key={`t-${cursor}`}>{text.slice(cursor, match.index)}</Fragment>)
		}
		parts.push(
			<span
				key={`m-${match.index}`}
				className="border-matrix bg-matrix/30 text-matrix-glow rounded-xs border-b px-0.5 font-bold"
				title={`Match at index ${match.index}`}
			>
				{match.text}
			</span>,
		)
		cursor = match.index + match.text.length
	}
	if (cursor < text.length)
		parts.push(<Fragment key={`t-${cursor}`}>{text.slice(cursor)}</Fragment>)

	return <>{parts}</>
}
