import { Link } from '@tanstack/react-router'
import React from 'react'
import { cn } from '@/lib/utils'
import { groupToolsByCategory, TOOLS } from '@/utils/tools-registry'

type SidebarProps = {
	sidebarOpen: boolean
	setSidebarOpen: (open: boolean) => void
}

const categories = groupToolsByCategory(TOOLS)

export function Sidebar(props: SidebarProps) {
	const { sidebarOpen, setSidebarOpen } = props

	return (
		<>
			<aside
				className={cn(
					'fixed inset-y-0 top-13.25 left-0 z-30 w-67 transform overflow-y-auto border-terminal-border border-r bg-terminal-card p-4 transition-transform duration-200 ease-in-out lg:static lg:h-full lg:min-h-0 lg:translate-x-0',
					sidebarOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			>
				<nav className="scrollbar-thin mb-4 select-none space-y-6">
					{Object.entries(categories).map(([categoryName, toolList]) => (
						<div key={categoryName} className="space-y-2">
							<h4 className="px-2 font-bold text-[10px] text-slate-600 uppercase tracking-widest">
								{categoryName}
							</h4>
							<div className="space-y-0.5">
								{toolList.map((tool) => (
									<Link
										key={tool.id}
										to="/tools/$toolId"
										params={{ toolId: tool.id }}
										onClick={() => setSidebarOpen(false)}
										activeProps={{
											className:
												'bg-matrix/10 border-l-2 border-matrix text-matrix-glow font-bold shadow-[inset_4px_0_10px_rgba(34,197,94,0.05)]',
										}}
										inactiveProps={{
											className:
												'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-terminal-bg/50',
										}}
										className="flex items-center gap-3 rounded-xs border-transparent border-l-2 px-3 py-2 font-semibold text-xs transition-all duration-150"
									>
										{React.createElement(tool.icon, {
											className: 'w-4 h-4 flex-shrink-0',
										})}
										<span className="flex-1 truncate">{tool.name}</span>
									</Link>
								))}
							</div>
						</div>
					))}
				</nav>
			</aside>

			{/* Mobile Backdrop */}
			{sidebarOpen && (
				<button
					type="button"
					onClick={() => setSidebarOpen(false)}
					className="fixed inset-0 top-13.25 z-20 bg-black/60 backdrop-blur-xs lg:hidden"
				/>
			)}
		</>
	)
}
