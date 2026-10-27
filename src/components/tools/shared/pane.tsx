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
			<div className="border-terminal-border bg-terminal-bg/40 flex h-12.5 shrink-0 items-center justify-between border-b px-4">
				<span className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-slate-300 uppercase">
					<span className={cn('bg-matrix h-1.5 w-1.5 rounded-full', dotClassName)} />
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
				<div className="border-terminal-border bg-terminal-bg/20 shrink-0 border-t">{footer}</div>
			)}
		</BorderBox>
	)
}
