import type React from 'react'

import { BorderBox } from '@/components/tools/shared'
import { cn } from '@/lib/utils'

type Diff = [number, string]

type DiffViewProps = {
	diffs: Diff[]
	className?: string
}

export function InlineDiffView({ diffs, className }: DiffViewProps) {
	if (diffs.length === 0) return <div className="text-slate-500 italic">No difference found.</div>

	return (
		<pre
			className={cn(
				'border-terminal-border bg-muted/50 min-h-75 rounded border p-4 text-sm break-all whitespace-pre-wrap text-slate-300 select-text',
				className,
			)}
		>
			{diffs.map(([op, text], idx) => {
				if (op === 0) return <span key={`${idx}-equal`}>{text}</span>
				if (op === -1) {
					return (
						<span
							key={`${idx}-del`}
							className="border border-red-500/20 bg-red-950 px-0.5 text-red-400 line-through"
						>
							{text}
						</span>
					)
				}
				return (
					<span
						key={`${idx}-ins`}
						className="border-matrix/20 text-matrix-glow border bg-green-950 px-0.5 font-bold"
					>
						{text}
					</span>
				)
			})}
		</pre>
	)
}

export function SideBySideView({ diffs, className }: DiffViewProps) {
	const leftPane: React.ReactNode[] = []
	const rightPane: React.ReactNode[] = []

	diffs.forEach(([op, text], idx) => {
		if (op === 0) {
			leftPane.push(<span key={`l-${idx}-equal`}>{text}</span>)
			rightPane.push(<span key={`r-${idx}-equal`}>{text}</span>)
		} else if (op === -1) {
			leftPane.push(
				<span
					key={`l-${idx}-del`}
					className="block border border-red-500/20 bg-red-950 px-0.5 text-red-400 md:inline"
				>
					{text}
				</span>,
			)
		} else {
			rightPane.push(
				<span
					key={`r-${idx}-ins`}
					className="border-matrix/20 text-matrix-glow block border bg-green-950 px-0.5 font-bold md:inline"
				>
					{text}
				</span>,
			)
		}
	})

	return (
		<div className={cn('flex min-h-75 flex-col gap-6 lg:flex-row', className)}>
			<BorderBox className="h bg-terminal-card/40 flex flex-1 flex-col p-0">
				<div className="border-terminal-border bg-terminal-bg/40 border-b px-4 py-2">
					<span className="font-mono text-xs font-bold tracking-wider text-slate-300 uppercase">
						Original (Text A)
					</span>
				</div>
				<pre className="bg-muted/50 max-h-100 grow scrollbar-thin overflow-y-auto p-4 font-mono text-sm break-all whitespace-pre-wrap text-slate-400 select-text">
					{leftPane}
				</pre>
			</BorderBox>

			<BorderBox className="h bg-terminal-card/40 flex flex-1 flex-col p-0">
				<div className="border-terminal-border bg-terminal-bg/40 border-b px-4 py-2">
					<span className="font-mono text-xs font-bold tracking-wider text-slate-300 uppercase">
						Modified (Text B)
					</span>
				</div>
				<pre className="bg-muted/50 max-h-100 grow scrollbar-thin overflow-y-auto p-4 font-mono text-sm break-all whitespace-pre-wrap text-slate-200 select-text">
					{rightPane}
				</pre>
			</BorderBox>
		</div>
	)
}
