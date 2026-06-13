import type React from 'react'
import { cn } from '@/lib/utils'
import { BorderBox } from './border-box'

type PaneProps = {
	title: string
	type?: 'input' | 'output'
	editor?: boolean
	actions?: React.ReactNode
	className?: string
	children?: React.ReactNode
}

export function Pane(props: PaneProps) {
	const { title, type = 'input', editor = false, className, actions, children } = props

	return (
		<BorderBox className={cn('flex flex-col p-0', className)}>
			{/* Pane Header */}
			<div className="flex h-12.5 items-center justify-between border-terminal-border border-b bg-terminal-bg/40 px-4">
				<span className="flex items-center gap-2 font-bold font-mono text-slate-300 text-xs uppercase tracking-wider">
					<span
						className={cn(
							'h-1.5 w-1.5 rounded-full',
							type === 'input' ? 'bg-matrix' : 'bg-blue-500',
						)}
					/>
					{title}
				</span>

				{actions}
			</div>

			{/* Pane Content */}
			<div className="relative flex min-h-0 flex-1 flex-col">
				{editor ? (
					children
				) : (
					<div className="flex flex-1 flex-col overflow-auto font-mono text-sm">{children}</div>
				)}
			</div>
		</BorderBox>
	)
}
