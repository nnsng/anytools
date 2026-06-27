import type { ReactNode } from 'react'
import { Pane } from '@/components/tools/shared/pane'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type RegexPanelProps = {
	subjectText: string
	setSubjectText: (val: string) => void
	highlightedNode: ReactNode
	className?: string
}

export function RegexPanel(props: RegexPanelProps) {
	const { subjectText, setSubjectText, highlightedNode, className } = props

	return (
		<div className={cn('flex flex-col gap-6', className)}>
			<Pane title="Subject Text">
				<div className="flex flex-col">
					<Textarea
						value={subjectText}
						onChange={(e) => setSubjectText(e.target.value)}
						placeholder="Type subject text to match against here..."
						className="min-h-37.5 border-none bg-transparent focus:ring-0"
					/>
				</div>
			</Pane>

			{/* Live highlighting visualization */}
			<Pane title="Live Highlighter Output" dotClassName="bg-blue-500">
				<div className="flex flex-col">
					<div className="max-h-75 min-h-37.5 overflow-y-auto whitespace-pre-wrap break-all bg-terminal-bg/50 p-4 font-mono text-slate-300 text-sm">
						{highlightedNode}
					</div>
				</div>
			</Pane>
		</div>
	)
}
