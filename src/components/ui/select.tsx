import React from 'react'
import { cn } from '@/utils/cn'

export type SelectOption = {
	value: string
	label: string
}

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
	options: SelectOption[]
	label?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className, options, label, ...props }, ref) => {
		return (
			<div className="flex w-full flex-col gap-1">
				<label className="flex flex-col gap-1">
					{label && (
						<span className="font-mono text-slate-500 text-xs uppercase tracking-wider">
							{label}
						</span>
					)}
					<div className="relative">
						<select
							ref={ref}
							className={cn(
								'w-full cursor-pointer appearance-none rounded-sm border border-terminal-border bg-terminal-card px-4 py-2.5 pr-10 font-mono text-sm text-white transition-all duration-150 focus:border-matrix/80 focus:outline-none focus:ring-1 focus:ring-matrix/80',
								className,
							)}
							{...props}
						>
							{options.map((opt) => (
								<option key={opt.value} value={opt.value} className="bg-terminal-card text-white">
									{opt.label}
								</option>
							))}
						</select>
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center border-terminal-border border-l px-3 font-mono text-slate-500 text-xs">
							▼
						</div>
					</div>
				</label>
			</div>
		)
	},
)
Select.displayName = 'Select'
