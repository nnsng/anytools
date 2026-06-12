import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Search, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { TOOLS } from '@/utils/tools-registry'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
	const [searchQuery, setSearchQuery] = useState('')

	const filteredTools = TOOLS.filter((tool) => {
		const q = searchQuery.toLowerCase().trim()
		if (!q) return true
		return (
			tool.name.toLowerCase().includes(q) ||
			tool.description.toLowerCase().includes(q) ||
			tool.tags.some((t) => t.includes(q))
		)
	})

	// Group filtered tools
	const converters = filteredTools.filter((t) => t.category === 'Converters')
	const formatters = filteredTools.filter((t) => t.category === 'Formatters & Parsers')
	const utilities = filteredTools.filter((t) => t.category === 'Dev Utilities')

	const renderSection = (title: string, list: typeof TOOLS) => {
		if (list.length === 0) return null

		return (
			<div className="space-y-4">
				<h2 className="border-terminal-border/80 border-b pb-2 font-bold text-slate-500 text-xs uppercase tracking-widest">
					{title} ({list.length})
				</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{list.map((tool) => (
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
									<h3 className="font-bold font-mono text-sm text-white transition-colors group-hover:text-matrix-glow">
										{tool.name}
									</h3>
								</div>
								<p className="line-clamp-2 font-mono text-slate-400 text-xs leading-relaxed">
									{tool.description}
								</p>
							</div>

							<div className="mt-5 flex items-center justify-between border-terminal-border/40 border-t pt-3 font-mono text-[10px] text-slate-500 group-hover:text-slate-300">
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

	return (
		<div className="scrollbar-thin h-full animate-fade-in space-y-8 overflow-y-auto font-mono">
			{/* Hero Welcome Console */}
			<div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded border border-terminal-border bg-terminal-card/50 p-6 md:flex-row md:items-center md:p-8">
				<div className="relative z-10 max-w-2xl space-y-3">
					<div className="inline-flex items-center gap-1.5 rounded border border-matrix/30 bg-matrix/10 px-2.5 py-1 font-bold text-[10px] text-matrix-glow uppercase">
						<Sparkles className="h-3.5 w-3.5" /> Client-Side Sandbox Operational
					</div>

					<h1 className="cursor-blink font-bold text-3xl text-white uppercase tracking-tight">
						ANYTOOLS_WORKSPACE
						<span className="font-bold text-matrix">.LOG</span>
					</h1>

					<p className="text-slate-400 text-xs leading-relaxed md:text-sm">
						Welcome to the local system utilities suite. All transformations, encodings, and
						calculations process natively within your browser. No server calls, no trackers, zero
						data leakage.
					</p>
				</div>
			</div>

			{/* Instant Search Bar */}
			<div className="relative">
				<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
					<Search className="h-5 w-5" />
				</div>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Filter utility modules instantly by name, feature, or keyword..."
					className="w-full rounded border border-terminal-border bg-terminal-card py-3 pr-4 pl-12 text-sm text-white placeholder-slate-600 transition-all duration-150 focus:border-matrix/80 focus:shadow-[0_0_12px_rgba(34,197,94,0.05)] focus:outline-none focus:ring-1 focus:ring-matrix/80"
				/>
			</div>

			{/* Grid of Sections */}
			<div className="space-y-10">
				{filteredTools.length === 0 ? (
					<div className="rounded border border-terminal-border border-dashed py-12 text-center">
						<div className="mb-2 text-slate-500 text-sm">No matching modules found.</div>
						<button
							type="button"
							onClick={() => setSearchQuery('')}
							className="border-matrix/30 border-b font-bold text-matrix text-xs hover:border-matrix hover:text-matrix-glow"
						>
							Reset Search Filter
						</button>
					</div>
				) : (
					<>
						{renderSection('Converters & Translators', converters)}
						{renderSection('Formatters & Parsers', formatters)}
						{renderSection('Development & Preview Utilities', utilities)}
					</>
				)}
			</div>
		</div>
	)
}
