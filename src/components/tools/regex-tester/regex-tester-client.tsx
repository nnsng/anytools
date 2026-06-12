import type React from 'react'
import { useEffect, useState } from 'react'
import { Textarea } from '../../ui/textarea'

interface MatchGroup {
	index: number
	content: string
	name: string | undefined
}

interface MatchDetail {
	index: number
	text: string
	groups: MatchGroup[]
}

export default function RegexTester() {
	const [pattern, setPattern] = useState<string>('(\\w+)\\s(\\d+)')
	const [flags, setFlags] = useState({
		g: true,
		i: false,
		m: false,
		s: false,
		u: false,
		y: false,
	})
	const [subjectText, setSubjectText] = useState<string>(
		'hello 123, world 456\ntest 789',
	)

	const [matches, setMatches] = useState<MatchDetail[]>([])
	const [regexError, setRegexError] = useState<string | null>(null)
	const [highlightedNode, setHighlightedNode] = useState<React.ReactNode[]>([])

	const handleFlagToggle = (flag: keyof typeof flags) => {
		setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }))
	}

	useEffect(() => {
		if (!pattern) {
			setMatches([])
			setRegexError(null)
			// Just render plain text
			setHighlightedNode([subjectText])
			return
		}

		const flagsString = Object.entries(flags)
			.filter(([_, active]) => active)
			.map(([f]) => f)
			.join('')

		try {
			const regex = new RegExp(pattern, flagsString)
			setRegexError(null)

			const foundMatches: MatchDetail[] = []
			const parts: React.ReactNode[] = []
			let lastIndex = 0

			if (flags.g) {
				let match
				let iterations = 0
				const maxIterations = 5000 // prevent freezing on infinite loops

				while (
					(match = regex.exec(subjectText)) !== null &&
					iterations < maxIterations
				) {
					iterations++
					const matchIndex = match.index
					const matchText = match[0]

					// Handle empty matches (like a*)
					if (matchText.length === 0) {
						regex.lastIndex++
					}

					// Capture groups
					const groups: MatchGroup[] = []
					for (let i = 1; i < match.length; i++) {
						groups.push({
							index: i,
							content: match[i] || '',
							name: undefined, // JS supports named capture groups, but we can list by index
						})
					}

					foundMatches.push({
						index: matchIndex,
						text: matchText,
						groups,
					})

					// Build highlighter elements
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
						groups.push({
							index: i,
							content: match[i] || '',
							name: undefined,
						})
					}

					foundMatches.push({
						index: matchIndex,
						text: matchText,
						groups,
					})

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
		} catch (err: any) {
			setRegexError(err.message || 'Invalid regular expression')
			setMatches([])
			setHighlightedNode([subjectText])
		}
	}, [pattern, flags, subjectText])

	return (
		<div className="grid grid-cols-1 gap-6 font-mono lg:grid-cols-12">
			{/* Pattern and Flags Input */}
			<div className="space-y-4 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-12">
				<span className="flex items-center gap-2 font-bold text-slate-300 text-xs uppercase tracking-wider">
					<span className="h-1.5 w-1.5 rounded-full bg-matrix" />
					RegExp Expression
				</span>

				<div className="flex flex-col items-stretch gap-4 md:flex-row">
					<div className="flex flex-1 items-center rounded-sm border border-terminal-border bg-terminal-bg px-3">
						<span className="mr-2 font-bold text-slate-500">/</span>
						<input
							type="text"
							value={pattern}
							onChange={(e) => setPattern(e.target.value)}
							placeholder="e.g. ([a-zA-Z]+)"
							className="w-full bg-transparent py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none"
						/>
						<span className="ml-2 font-bold text-slate-500">/</span>
					</div>

					<div className="flex flex-wrap items-center gap-2 rounded border border-terminal-border bg-terminal-bg/30 px-3 py-1">
						{Object.keys(flags).map((flag) => {
							const active = flags[flag as keyof typeof flags]
							return (
								<button
									key={flag}
									onClick={() => handleFlagToggle(flag as keyof typeof flags)}
									className={`rounded border px-2.5 py-1 font-bold text-xs transition-all duration-100 ${
										active
											? 'border-matrix bg-matrix font-bold text-terminal-bg shadow-[0_0_6px_rgba(34,197,94,0.3)]'
											: 'border-terminal-border text-slate-500 hover:text-slate-300'
									}`}
									title={`Flag: ${flag}`}
								>
									{flag}
								</button>
							)
						})}
					</div>
				</div>

				{regexError && (
					<p className="rounded border border-red-500/20 bg-red-950/20 p-2 text-red-400 text-xs">
						{regexError}
					</p>
				)}
			</div>

			{/* Editor & Highlight Display */}
			<div className="flex flex-col gap-6 lg:col-span-8">
				<div className="flex flex-col rounded-sm border border-terminal-border bg-terminal-card/60">
					<div className="flex items-center justify-between border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
						<span className="font-bold text-slate-300 text-xs uppercase tracking-wider">
							Subject Text
						</span>
					</div>
					<Textarea
						value={subjectText}
						onChange={(e) => setSubjectText(e.target.value)}
						placeholder="Type subject text to match against here..."
						className="min-h-[150px] border-none bg-transparent focus:ring-0"
					/>
				</div>

				{/* Live highlighting visualization */}
				<div className="flex flex-col rounded-sm border border-terminal-border bg-terminal-card/60">
					<div className="border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
						<span className="font-bold text-slate-300 text-xs uppercase tracking-wider">
							Live Highlighter Output
						</span>
					</div>
					<div className="max-h-[300px] min-h-[150px] overflow-y-auto whitespace-pre-wrap break-all bg-terminal-bg/50 p-4 font-mono text-slate-300 text-sm">
						{highlightedNode}
					</div>
				</div>
			</div>

			{/* Matches List */}
			<div className="flex h-full max-h-[500px] flex-col space-y-4 rounded-sm border border-terminal-border bg-terminal-card/60 p-4 lg:col-span-4">
				<div className="border-terminal-border border-b pb-2">
					<span className="font-bold text-slate-300 text-xs uppercase tracking-wider">
						Matches ({matches.length})
					</span>
				</div>

				<div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto pr-1">
					{matches.length === 0 ? (
						<div className="py-8 text-center text-slate-600 text-xs">
							No matches found.
						</div>
					) : (
						matches.map((match, i) => (
							<div
								key={i}
								className="space-y-2 rounded-xs border border-terminal-border bg-terminal-bg/60 p-3 text-xs transition-colors hover:border-matrix/30"
							>
								<div className="flex items-center justify-between border-terminal-border border-b pb-1 font-bold text-[10px] text-slate-500">
									<span>MATCH #{i + 1}</span>
									<span>INDEX: {match.index}</span>
								</div>

								<div>
									<span className="block font-bold text-[9px] text-slate-500 uppercase">
										Matched String:
									</span>
									<span className="break-all rounded bg-matrix/5 px-1 py-0.5 font-bold text-matrix">
										{match.text}
									</span>
								</div>

								{match.groups.length > 0 && (
									<div className="space-y-1">
										<span className="block font-bold text-[9px] text-slate-500 uppercase">
											Groups:
										</span>
										<div className="space-y-1 border-terminal-border border-l pl-2">
											{match.groups.map((group) => (
												<div key={group.index} className="flex gap-2">
													<span className="font-semibold text-slate-500">
														Group {group.index}:
													</span>
													<span className="select-all break-all text-amber-400">
														{group.content || '""'}
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}
