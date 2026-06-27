import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CategorySection, HeroSection } from '@/components/dashboard'
import { APP_NAME } from '@/constants/app'
import { groupToolsByCategory, TOOLS } from '@/utils/tools-registry'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		document.title = `${APP_NAME} - Developer Utilities Suite`
	}, [])

	const filteredTools = TOOLS.filter((tool) => {
		const q = searchQuery.toLowerCase().trim()
		if (!q) return true
		return (
			tool.name.toLowerCase().includes(q) ||
			tool.description.toLowerCase().includes(q) ||
			tool.tags.some((t) => t.includes(q))
		)
	})

	const categories = groupToolsByCategory(filteredTools)

	return (
		<div className="scrollbar-thin h-full w-full animate-fade-in overflow-y-auto font-mono">
			<div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
				<HeroSection />

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
						className="w-full rounded border border-terminal-border bg-terminal-card py-3 pr-4 pl-12 text-foreground text-sm transition-all duration-150 placeholder:text-muted-foreground focus:border-matrix/80 focus:shadow-[0_0_12px_rgba(34,197,94,0.05)] focus:outline-none focus:ring-1 focus:ring-matrix/80"
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
						Object.entries(categories).map(([category, tools]) => (
							<CategorySection key={category} title={category} tools={tools} />
						))
					)}
				</div>
			</div>
		</div>
	)
}
