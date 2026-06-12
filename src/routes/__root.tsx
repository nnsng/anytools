import { TanStackDevtools } from '@tanstack/react-devtools'
import {
	createRootRoute,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Cpu, Menu, Search, Terminal, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import appCss from '../styles.css?url'
import { TOOLS } from '../utils/tools-registry'

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'AnyTools // Terminal-Style Utilities',
			},
			{
				name: 'description',
				content:
					'High-performance, secure developer utility tools running 100% in your browser.',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [systemStatus, _setSystemStatus] = useState('NOMINAL')
	const commandPaletteRef = useRef<HTMLDivElement>(null)
	const searchInputRef = useRef<HTMLInputElement>(null)

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

	// Focus search input when command palette opens
	useEffect(() => {
		if (commandPaletteOpen) {
			setTimeout(() => {
				searchInputRef.current?.focus()
			}, 100)
		} else {
			setSearchQuery('')
		}
	}, [commandPaletteOpen])

	// Filter tools based on query
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

	// Group tools by category
	const categories = {
		Converters: TOOLS.filter((t) => t.category === 'Converters'),
		'Formatters & Parsers': TOOLS.filter(
			(t) => t.category === 'Formatters & Parsers',
		),
		'Dev Utilities': TOOLS.filter((t) => t.category === 'Dev Utilities'),
	}

	return (
		<html lang="en" className="dark h-full">
			<head>
				<HeadContent />
			</head>
			<body className="crt flex min-h-full flex-col bg-grid-pattern bg-terminal-bg font-mono text-slate-100 antialiased">
				{/* Scanline aesthetic overlay */}
				<div className="scanlines" />

				<div className="flex h-full min-h-screen flex-grow flex-col">
					{/* Top Header */}
					<header className="sticky top-0 z-40 flex items-center justify-between border-terminal-border border-b bg-terminal-card/80 px-4 py-3 backdrop-blur">
						<div className="flex items-center gap-3">
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="rounded border border-transparent p-1 text-slate-400 transition-colors hover:border-terminal-border hover:text-matrix-glow lg:hidden"
							>
								<Menu className="h-5 w-5" />
							</button>

							<Link
								to="/"
								className="group flex items-center gap-2.5 text-white transition-colors hover:text-matrix-glow"
							>
								<Terminal className="h-6 w-6 text-glow text-matrix transition-transform group-hover:scale-105" />
								<span className="font-bold text-base uppercase tracking-wider md:text-lg">
									ANYTOOLS<span className="font-bold text-matrix">.SYS</span>
								</span>
							</Link>
						</div>

						{/* System status bar & Quick search trigger */}
						<div className="flex items-center gap-4">
							<div className="hidden select-none items-center gap-2 rounded border border-terminal-border bg-terminal-bg/50 px-3 py-1 font-mono text-[10px] text-slate-500 md:flex">
								<Cpu className="h-3 w-3 animate-pulse text-matrix" />
								<span>
									STATUS:{' '}
									<span className="font-bold text-matrix-glow">
										{systemStatus}
									</span>
								</span>
								<span className="text-terminal-border">|</span>
								<span>
									DB_CLIENT:{' '}
									<span className="font-bold text-blue-400">100% LOCAL</span>
								</span>
							</div>

							<button
								onClick={() => setCommandPaletteOpen(true)}
								className="flex items-center gap-2 rounded border border-terminal-border bg-terminal-bg px-3 py-1.5 font-mono text-slate-500 text-xs transition-all duration-150 hover:border-matrix/40"
							>
								<Search className="h-3.5 w-3.5" />
								<span className="hidden sm:inline">Search modules...</span>
								<kbd className="rounded border border-terminal-border bg-terminal-card px-1.5 py-0.5 text-[10px] text-slate-400">
									⌘K
								</kbd>
							</button>
						</div>
					</header>

					<div className="relative flex flex-1">
						{/* Sidebar Navigation */}
						<aside
							className={`fixed inset-y-0 top-[53px] left-0 z-30 w-64 transform border-terminal-border border-r bg-terminal-card p-4 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:block${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
						`}
						>
							<nav className="scrollbar-thin h-[calc(100vh-80px)] select-none space-y-6 overflow-y-auto pr-1">
								{Object.entries(categories).map(([categoryName, toolList]) => (
									<div key={categoryName} className="space-y-2">
										<h4 className="px-2 font-bold text-[10px] text-slate-600 uppercase tracking-widest">
											{categoryName}
										</h4>
										<div className="space-y-0.5">
											{toolList.map((tool) => (
												<Link
													key={tool.id}
													to={`/tools/${tool.id}`}
													onClick={() => setSidebarOpen(false)}
													activeProps={{
														className:
															'bg-matrix/10 border-l-2 border-matrix text-matrix-glow font-bold shadow-[inset_4px_0_10px_rgba(34,197,94,0.05)]',
													}}
													inactiveProps={{
														className:
															'text-slate-400 hover:text-slate-200 hover:bg-terminal-bg/50',
													}}
													className="flex items-center gap-3 rounded-xs border-transparent border-l-2 px-3 py-2 font-semibold text-xs transition-all duration-150"
												>
													{React.createElement(tool.icon, {
														className: 'w-4 h-4 flex-shrink-0',
													})}
													<span className="truncate">{tool.name}</span>
												</Link>
											))}
										</div>
									</div>
								))}
							</nav>
						</aside>

						{/* Sidebar Mobile Backdrop */}
						{sidebarOpen && (
							<div
								onClick={() => setSidebarOpen(false)}
								className="fixed inset-0 top-[53px] z-20 bg-black/60 backdrop-blur-xs lg:hidden"
							/>
						)}

						{/* Main Panel Content Workspace */}
						<main className="scrollbar-thin h-[calc(100vh-53px)] min-w-0 flex-grow overflow-y-auto bg-terminal-bg/10 p-4 md:p-6 lg:p-8">
							<div className="mx-auto max-w-7xl space-y-6 pb-12">
								{children}
							</div>
						</main>
					</div>
				</div>

				{/* Global Search Command Palette Dialog */}
				{commandPaletteOpen && (
					<div className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center bg-black/80 p-4 pt-[15vh] backdrop-blur-xs">
						<div
							ref={commandPaletteRef}
							className="flex max-h-[70vh] w-full max-w-2xl animate-slide-up flex-col overflow-hidden rounded border border-terminal-border bg-terminal-card shadow-[0_0_50px_rgba(0,0,0,0.8),_0_0_2px_rgba(34,197,94,0.2)]"
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
									onClick={() => setCommandPaletteOpen(false)}
									className="text-slate-500 transition-colors hover:text-white"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							{/* Search results */}
							<div className="scrollbar-thin flex-grow space-y-4 overflow-y-auto p-4">
								<div className="font-bold text-[10px] text-slate-600 uppercase tracking-widest">
									System Registry Index ({filteredTools.length})
								</div>

								<div className="space-y-1">
									{filteredTools.length === 0 ? (
										<div className="py-8 text-center text-slate-600 text-xs">
											No tools matching '
											<span className="font-bold text-red-400">
												{searchQuery}
											</span>
											' found.
										</div>
									) : (
										filteredTools.map((tool) => (
											<Link
												key={tool.id}
												to={`/tools/${tool.id}`}
												onClick={() => setCommandPaletteOpen(false)}
												className="group flex items-center justify-between rounded border border-transparent p-3 text-slate-300 transition-all duration-150 hover:border-matrix/30 hover:bg-matrix/10 hover:text-matrix-glow"
											>
												<div className="flex min-w-0 items-center gap-3">
													<div className="rounded border border-terminal-border bg-terminal-bg p-1.5 group-hover:border-matrix/20">
														{React.createElement(tool.icon, {
															className:
																'w-4 h-4 text-slate-400 group-hover:text-matrix',
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
				)}

				<TanStackDevtools
					config={{
						position: 'bottom-right',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	)
}
