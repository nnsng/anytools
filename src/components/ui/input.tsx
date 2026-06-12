import React from 'react'
import { cn } from '@/utils/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={cn(
					'w-full rounded-sm border border-terminal-border bg-terminal-card px-4 py-2.5 font-mono text-sm text-white placeholder-slate-600 transition-all duration-150 focus:border-matrix/80 focus:outline-none focus:ring-1 focus:ring-matrix/80',
					className,
				)}
				{...props}
			/>
		)
	},
)
Input.displayName = 'Input'
