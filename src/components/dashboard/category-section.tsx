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
			<h2 className="border-terminal-border/80 border-b pb-2 font-bold text-slate-500 text-xs uppercase tracking-widest">
				{title} ({tools.length})
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{tools.map((tool) => (
					<Link
						key={tool.id}
						to="/tools/$toolId"
						params={{ toolId: tool.id }}
						className="group relative flex flex-col justify-between overflow-hidden rounded border border-terminal-border bg-terminal-card/40 p-5 transition-all duration-200 hover:border-matrix/40 hover:bg-terminal-card/90 hover:shadow-[0_0_15px_rgba(34,197,94,0.08)]"
					>
						{/* Subtle top indicator bar */}
						<div className="absolute top-0 right-0 left-0 h-0.5 bg-terminal-border transition-colors group-hover:bg-matrix" />

						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="rounded border border-terminal-border bg-terminal-bg p-2 group-hover:border-matrix/20 group-hover:bg-matrix/5">
									{React.createElement(tool.icon, {
										className:
											'w-5 h-5 text-slate-400 group-hover:text-matrix group-hover:scale-105 transition-transform text-glow',
									})}
								</div>
								<h3 className="font-bold font-mono text-foreground text-sm transition-colors group-hover:text-matrix-glow">
									{tool.name}
								</h3>
							</div>
							<p className="line-clamp-2 font-mono text-slate-400 text-xs leading-relaxed">
								{tool.description}
							</p>
						</div>

						<div className="mt-5 flex items-center justify-between border-terminal-border/40 border-t pt-3 font-mono text-slate-500 text-xs group-hover:text-slate-300">
							<span className="uppercase tracking-wider">{tool.category}</span>
							<span className="flex items-center gap-0.5 font-bold text-matrix/80 group-hover:text-matrix-glow">
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
