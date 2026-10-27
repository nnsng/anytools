import { createRootRoute, Outlet } from '@tanstack/react-router'
import { lazy, Suspense, useState } from 'react'

import { Header, Sidebar } from '@/components/layout'
import { ThemeProvider } from '@/contexts/theme-context'

import '../styles.css'

const Devtools = import.meta.env.DEV ? lazy(() => import('@/components/layout/devtools')) : null

export const Route = createRootRoute({
	component: RootComponent,
})

function RootComponent() {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<ThemeProvider>
			<div className="crt bg-grid-pattern bg-terminal-bg text-foreground flex h-screen w-screen flex-col font-mono antialiased">
				<div className="scanlines" />

				<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				<div className="relative flex min-h-0 flex-1">
					<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

					{/* Main Panel Content Workspace */}
					<main className="bg-terminal-bg/10 flex min-w-0 flex-1 flex-col">
						<div className="flex h-full w-full flex-col overflow-y-auto">
							<Outlet />
						</div>
					</main>
				</div>

				{Devtools && (
					<Suspense fallback={null}>
						<Devtools />
					</Suspense>
				)}
			</div>
		</ThemeProvider>
	)
}
