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
						<div className="py-8 text-center text-xs text-slate-600">No matches found.</div>
					) : (
						matches.map((match, i) => (
							<BorderBox
								key={`${match.index}-${match.text}`}
								className="bg-terminal-bg/60 hover:border-matrix/30 space-y-2 p-3 text-xs transition-colors"
							>
								<div className="border-terminal-border flex items-center justify-between border-b pb-1 text-xs font-bold text-slate-500">
									<span>MATCH #{i + 1}</span>
									<span>INDEX: {match.index}</span>
								</div>

								<div>
									<span className="text-[10px] font-bold text-slate-500 uppercase">
										Matched String:
									</span>
									<span className="bg-matrix/5 text-matrix rounded px-1 py-0.5 font-bold break-all">
										{match.text}
									</span>
								</div>

								{match.groups.length > 0 && (
									<div className="space-y-1">
										<span className="block text-[10px] font-bold text-slate-500 uppercase">
											Groups:
										</span>
										<div className="border-terminal-border space-y-1 border-l pl-2">
											{match.groups.map((group) => (
												<div key={group.index} className="flex gap-2">
													<span className="font-semibold text-slate-500">Group {group.index}:</span>
													<span className="break-all text-amber-400 select-all">
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
