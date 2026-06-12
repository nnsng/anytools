import React from 'react'
import { cn } from '../../utils/cn'

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				ref={ref}
				className={cn(
					'scrollbar-thin min-h-[120px] w-full resize-y rounded-sm border border-terminal-border bg-terminal-card p-4 font-mono text-sm text-white placeholder-slate-600 transition-all duration-150 focus:border-matrix/80 focus:outline-none focus:ring-1 focus:ring-matrix/80',
					className,
				)}
				{...props}
			/>
		)
	},
)
Textarea.displayName = 'Textarea'
