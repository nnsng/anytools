import React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'outline' | 'ghost' | 'danger'
	size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'primary', size = 'md', ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					'inline-flex select-none items-center justify-center font-bold font-mono uppercase tracking-wider transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
					// Variant styles
					variant === 'primary' &&
						'border border-matrix bg-matrix text-terminal-bg shadow-[0_0_8px_rgba(34,197,94,0.3)] hover:border-matrix-glow hover:bg-matrix-glow',
					variant === 'outline' &&
						'border border-matrix/50 bg-transparent text-matrix hover:border-matrix hover:bg-matrix/10 hover:text-matrix-glow',
					variant === 'ghost' &&
						'border border-transparent bg-transparent text-slate-400 hover:border-terminal-border hover:bg-terminal-card hover:text-white',
					variant === 'danger' &&
						'border border-red-600 bg-red-600 text-white shadow-[0_0_8px_rgba(220,38,38,0.3)] hover:border-red-500 hover:bg-red-500',
					// Size styles
					size === 'sm' && 'rounded-xs px-3 py-1.5 text-xs',
					size === 'md' && 'rounded-sm px-5 py-2.5 text-sm',
					size === 'lg' && 'rounded-md px-7 py-3 text-base',
					className,
				)}
				{...props}
			/>
		)
	},
)
Button.displayName = 'Button'
