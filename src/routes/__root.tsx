import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useState } from 'react'
import { Header, Sidebar } from '@/components/layout'

import '../styles.css'

export const Route = createRootRoute({
	component: RootComponent,
})

function RootComponent() {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="crt flex h-screen w-screen flex-col bg-grid-pattern bg-terminal-bg font-mono text-slate-100 antialiased">
			<div className="scanlines" />

			<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

			<div className="relative flex min-h-0 flex-1">
				<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				{/* Main Panel Content Workspace */}
				<main className="flex min-w-0 flex-1 flex-col bg-terminal-bg/10">
					<div className="flex h-full w-full flex-col overflow-y-auto">
						<Outlet />
					</div>
				</main>
			</div>

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
