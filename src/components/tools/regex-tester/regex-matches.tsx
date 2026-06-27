import { BorderBox } from '@/components/tools/shared'
import { Pane } from '@/components/tools/shared/pane'

type MatchGroup = {
	index: number
	content: string
}

type MatchItem = {
	index: number
	text: string
	groups: MatchGroup[]
}

type RegexMatchesProps = {
	matches: MatchItem[]
	className?: string
}

export function RegexMatches({ matches, className }: RegexMatchesProps) {
	return (
		<Pane title={`Matches (${matches.length})`} dotClassName="bg-blue-500" className={className}>
			<div className="flex h-full flex-col space-y-4 p-4">
				<div className="flex-1 space-y-3">
					{matches.length === 0 ? (
						<div className="py-8 text-center text-slate-600 text-xs">No matches found.</div>
					) : (
						matches.map((match, i) => (
							<BorderBox
								key={`${match.index}-${match.text}`}
								className="space-y-2 bg-terminal-bg/60 p-3 text-xs transition-colors hover:border-matrix/30"
							>
								<div className="flex items-center justify-between border-terminal-border border-b pb-1 font-bold text-[10px] text-slate-500">
									<span>MATCH #{i + 1}</span>
									<span>INDEX: {match.index}</span>
								</div>

								<div>
									<span className="font-bold text-[9px] text-slate-500 uppercase">
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
													<span className="font-semibold text-slate-500">Group {group.index}:</span>
													<span className="select-all break-all text-amber-400">
														{group.content || '""'}
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</BorderBox>
						))
					)}
				</div>
			</div>
		</Pane>
	)
}
