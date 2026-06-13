import type { ReactNode } from 'react'
import { Textarea } from '@/components/ui/textarea'

type RegexPanelProps = {
	subjectText: string
	setSubjectText: (val: string) => void
	highlightedNode: ReactNode
}

export function RegexPanel({ subjectText, setSubjectText, highlightedNode }: RegexPanelProps) {
	return (
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
					className="min-h-37.5 border-none bg-transparent focus:ring-0"
				/>
			</div>

			{/* Live highlighting visualization */}
			<div className="flex flex-col rounded-sm border border-terminal-border bg-terminal-card/60">
				<div className="border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
					<span className="font-bold text-slate-300 text-xs uppercase tracking-wider">
						Live Highlighter Output
					</span>
				</div>
				<div className="max-h-75 min-h-37.5 overflow-y-auto whitespace-pre-wrap break-all bg-terminal-bg/50 p-4 font-mono text-slate-300 text-sm">
					{highlightedNode}
				</div>
			</div>
		</div>
	)
}
