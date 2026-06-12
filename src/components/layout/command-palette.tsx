import { Link } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import type { ToolMetadata } from '@/utils/tools-registry'

type CommandPaletteProps = {
	open: boolean
	onClose: () => void
	searchQuery: string
	setSearchQuery: (query: string) => void
	filteredTools: ToolMetadata[]
}

export function CommandPalette(props: CommandPaletteProps) {
	const { open, onClose, searchQuery, setSearchQuery, filteredTools } = props

	const containerRef = useRef<HTMLDivElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				searchInputRef.current?.focus()
			}, 100)
		} else {
			setSearchQuery('')
		}
	}, [open, setSearchQuery])

	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center bg-black/80 p-4 pt-[15vh] backdrop-blur-xs">
			<div
				ref={containerRef}
				className="flex max-h-[70vh] w-full max-w-2xl animate-slide-up flex-col overflow-hidden rounded border border-terminal-border bg-terminal-card shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_2px_rgba(34,197,94,0.2)]"
			>
				{/* Header Search Field */}
				<div className="flex items-center border-terminal-border border-b bg-terminal-bg/50 px-4 py-3">
					<Search className="mr-3 h-5 w-5 text-slate-500" />
					<input
						ref={searchInputRef}
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search modules (e.g. base64, unix, diff)..."
						className="w-full border-none bg-transparent font-mono text-sm text-white placeholder-slate-600 focus:outline-none"
					/>
					<button
						type="button"
						onClick={onClose}
						className="text-slate-500 transition-colors hover:text-white"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Search results */}
				<div className="scrollbar-thin grow space-y-4 overflow-y-auto p-4">
					<div className="font-bold text-[10px] text-slate-600 uppercase tracking-widest">
						System Registry Index ({filteredTools.length})
					</div>

					<div className="space-y-1">
						{filteredTools.length === 0 ? (
							<div className="py-8 text-center text-slate-600 text-xs">
								No tools matching '<span className="font-bold text-red-400">{searchQuery}</span>'
								found.
							</div>
						) : (
							filteredTools.map((tool) => (
								<Link
									key={tool.id}
									to="/tools/$toolId"
									params={{ toolId: tool.id }}
									onClick={onClose}
									className="group flex items-center justify-between rounded border border-transparent p-3 text-slate-300 transition-all duration-150 hover:border-matrix/30 hover:bg-matrix/10 hover:text-matrix-glow"
								>
									<div className="flex min-w-0 items-center gap-3">
										<div className="rounded border border-terminal-border bg-terminal-bg p-1.5 group-hover:border-matrix/20">
											{React.createElement(tool.icon, {
												className: 'w-4 h-4 text-slate-400 group-hover:text-matrix',
											})}
										</div>
										<div className="min-w-0">
											<div className="font-bold font-mono text-xs group-hover:text-matrix-glow">
												{tool.name}
											</div>
											<div className="max-w-md truncate text-[10px] text-slate-500">
												{tool.description}
											</div>
										</div>
									</div>
									<div className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[9px] text-slate-500 uppercase tracking-wider group-hover:border-matrix/20 group-hover:text-matrix/80">
										{tool.category}
									</div>
								</Link>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
