import type React from 'react'
import { cn } from '@/lib/utils'
import { BorderBox } from './border-box'

type PaneProps = {
	title: string
	actions?: React.ReactNode
	footer?: React.ReactNode
	scrollable?: boolean
	className?: string
	contentClassName?: string
	dotClassName?: string
	children?: React.ReactNode
}

export function Pane(props: PaneProps) {
	const {
		title,
		actions,
		footer,
		scrollable = true,
		className,
		contentClassName,
		dotClassName,
		children,
	} = props

	return (
		<BorderBox className={cn('flex flex-col p-0', className)}>
			{/* Pane Header */}
			<div className="flex h-12.5 shrink-0 items-center justify-between border-terminal-border border-b bg-terminal-bg/40 px-4">
				<span className="flex items-center gap-2 font-bold font-mono text-slate-300 text-xs uppercase tracking-wider">
					<span className={cn('h-1.5 w-1.5 rounded-full bg-matrix', dotClassName)} />
					{title}
				</span>

				{actions}
			</div>

			{/* Pane Content */}
			<div
				className={cn(
					'relative flex min-h-0 flex-1 flex-col',
					scrollable && 'overflow-auto font-mono text-sm',
					contentClassName,
				)}
			>
				{children}
			</div>

			{/* Pane Footer */}
			{footer && (
				<div className="shrink-0 border-terminal-border border-t bg-terminal-bg/20">{footer}</div>
			)}
		</BorderBox>
	)
}
