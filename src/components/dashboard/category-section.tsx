import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import React from 'react'

import type { ToolMetadata } from '@/utils/tools-registry'

type CategorySectionProps = {
	title: string
	tools: ToolMetadata[]
}

export function CategorySection({ title, tools }: CategorySectionProps) {
	if (tools.length === 0) return null

	return (
		<div className="space-y-4">
			<h2 className="border-terminal-border/80 border-b pb-2 text-xs font-bold tracking-widest text-slate-500 uppercase">
				{title} ({tools.length})
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{tools.map((tool) => (
					<Link
						key={tool.id}
						to="/tools/$toolId"
						params={{ toolId: tool.id }}
						className="group border-terminal-border bg-terminal-card/40 hover:border-matrix/40 hover:bg-terminal-card/90 relative flex flex-col justify-between overflow-hidden rounded border p-5 transition-all duration-200 hover:shadow-[0_0_15px_rgba(34,197,94,0.08)]"
					>
						{/* Subtle top indicator bar */}
						<div className="bg-terminal-border group-hover:bg-matrix absolute top-0 right-0 left-0 h-0.5 transition-colors" />

						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="border-terminal-border bg-terminal-bg group-hover:border-matrix/20 group-hover:bg-matrix/5 rounded border p-2">
									{React.createElement(tool.icon, {
										className:
											'w-5 h-5 text-slate-400 group-hover:text-matrix group-hover:scale-105 transition-transform text-glow',
									})}
								</div>
								<h3 className="text-foreground group-hover:text-matrix-glow font-mono text-sm font-bold transition-colors">
									{tool.name}
								</h3>
							</div>
							<p className="line-clamp-2 font-mono text-xs leading-relaxed text-slate-400">
								{tool.description}
							</p>
						</div>

						<div className="border-terminal-border/40 mt-5 flex items-center justify-between border-t pt-3 font-mono text-xs text-slate-500 group-hover:text-slate-300">
							<span className="tracking-wider uppercase">{tool.category}</span>
							<span className="text-matrix/80 group-hover:text-matrix-glow flex items-center gap-0.5 font-bold">
								LAUNCH{' '}
								<ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
							</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
