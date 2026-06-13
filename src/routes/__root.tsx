import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useEffect, useState } from 'react'
import { CommandPalette } from '@/components/layout/command-palette'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { groupToolsByCategory, TOOLS } from '@/utils/tools-registry'

import '../styles.css'

export const Route = createRootRoute({
	component: RootComponent,
})

const CATEGORIES = groupToolsByCategory(TOOLS)

function RootComponent() {
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
	const [sidebarOpen, setSidebarOpen] = useState(false)

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

	return (
		<div className="crt flex h-screen w-screen flex-col bg-grid-pattern bg-terminal-bg font-mono text-slate-100 antialiased">
			<div className="scanlines" />

			<Header
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
			/>

			<div className="relative flex min-h-0 flex-1">
				<Sidebar
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
					categories={CATEGORIES}
				/>

				{/* Main Panel Content Workspace */}
				<main className="flex min-w-0 flex-1 flex-col bg-terminal-bg/10">
					<div className="flex h-full w-full flex-col overflow-y-auto">
						<Outlet />
					</div>
				</main>
			</div>

			<CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

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
		</div>
	)
}
