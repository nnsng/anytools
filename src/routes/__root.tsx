import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useEffect, useState } from 'react'
import { CommandPalette } from '@/components/layout/command-palette'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { TOOLS } from '@/utils/tools-registry'

import '../styles.css'

export const Route = createRootRoute({
	component: RootComponent,
})

const CATEGORIES = {
	Converters: TOOLS.filter((t) => t.category === 'Converters'),
	'Formatters & Parsers': TOOLS.filter(
		(t) => t.category === 'Formatters & Parsers',
	),
	'Dev Utilities': TOOLS.filter((t) => t.category === 'Dev Utilities'),
}

function RootComponent() {
	const [searchQuery, setSearchQuery] = useState('')
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [systemStatus, _setSystemStatus] = useState('NOMINAL')

	// Listen for Cmd+K or Ctrl+K to open search command palette
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault()
				setCommandPaletteOpen((prev) => !prev)
			}
			if (e.key === 'Escape') {
				setCommandPaletteOpen(false)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	const filteredTools = TOOLS.filter((tool) => {
		const query = searchQuery.toLowerCase().trim()
		if (!query) return true
		return (
			tool.name.toLowerCase().includes(query) ||
			tool.description.toLowerCase().includes(query) ||
			tool.tags.some((tag) => tag.includes(query)) ||
			tool.category.toLowerCase().includes(query)
		)
	})

	return (
		<>
			<div className="flex h-full min-h-screen grow flex-col">
				<Header
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
					systemStatus={systemStatus}
					onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				/>

				<div className="relative flex flex-1">
					<Sidebar
						sidebarOpen={sidebarOpen}
						setSidebarOpen={setSidebarOpen}
						categories={CATEGORIES}
					/>

					{/* Main Panel Content Workspace */}
					<main className="scrollbar-thin h-[calc(100vh-53px)] min-w-0 grow overflow-y-auto bg-terminal-bg/10 p-4 md:p-6 lg:p-8">
						<div className="mx-auto max-w-7xl space-y-6 pb-12">
							<Outlet />
						</div>
					</main>
				</div>
			</div>

			<CommandPalette
				open={commandPaletteOpen}
				onClose={() => setCommandPaletteOpen(false)}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				filteredTools={filteredTools}
			/>

			<TanStackDevtools
				config={{
					position: 'bottom-right',
				}}
				plugins={[
					{
						name: 'TanStack Router',
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	)
}
