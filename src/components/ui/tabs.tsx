import { cn } from '@/utils/cn'

export interface TabOption {
	id: string
	label: string
}

export interface TabsProps {
	tabs: TabOption[]
	activeTab: string
	onChange: (id: string) => void
	className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
	return (
		<div className={cn('flex border-terminal-border border-b', className)}>
			{tabs.map((tab) => {
				const isActive = tab.id === activeTab
				return (
					<button
						key={tab.id}
						onClick={() => onChange(tab.id)}
						className={cn(
							'-mb-[1px] border-transparent border-t-2 px-4 py-2 font-bold font-mono text-xs uppercase tracking-wider transition-all duration-150',
							isActive
								? 'border-x border-x-terminal-border border-t-matrix bg-terminal-card text-matrix'
								: 'text-slate-500 hover:bg-terminal-card/30 hover:text-slate-300',
						)}
					>
						{tab.label}
					</button>
				)
			})}
		</div>
	)
}
