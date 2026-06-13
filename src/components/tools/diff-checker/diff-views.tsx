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
				'min-h-75 select-text whitespace-pre-wrap break-all rounded border border-terminal-border bg-slate-950 p-4 text-slate-300 text-sm',
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
						className="border border-matrix/20 bg-green-950 px-0.5 font-bold text-matrix-glow"
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
					className="block border border-matrix/20 bg-green-950 px-0.5 font-bold text-matrix-glow md:inline"
				>
					{text}
				</span>,
			)
		}
	})

	return (
		<div className={cn('flex min-h-75 flex-col gap-6 lg:flex-row', className)}>
			<BorderBox className="h flex flex-1 flex-col bg-terminal-card/40 p-0">
				<div className="border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
					<span className="font-bold font-mono text-slate-300 text-xs uppercase tracking-wider">
						Original (Text A)
					</span>
				</div>
				<pre className="scrollbar-thin max-h-100 grow select-text overflow-y-auto whitespace-pre-wrap break-all bg-slate-950 p-4 font-mono text-slate-400 text-sm">
					{leftPane}
				</pre>
			</BorderBox>

			<BorderBox className="h flex flex-1 flex-col bg-terminal-card/40 p-0">
				<div className="border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
					<span className="font-bold font-mono text-slate-300 text-xs uppercase tracking-wider">
						Modified (Text B)
					</span>
				</div>
				<pre className="scrollbar-thin max-h-100 grow select-text overflow-y-auto whitespace-pre-wrap break-all bg-slate-950 p-4 font-mono text-slate-200 text-sm">
					{rightPane}
				</pre>
			</BorderBox>
		</div>
	)
}
