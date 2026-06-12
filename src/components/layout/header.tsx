import { Link } from '@tanstack/react-router'
import { Cpu, Menu, Search, Terminal } from 'lucide-react'

type HeaderProps = {
	sidebarOpen: boolean
	setSidebarOpen: (open: boolean) => void
	systemStatus: string
	onOpenCommandPalette: () => void
}

export function Header(props: HeaderProps) {
	const { sidebarOpen, setSidebarOpen, systemStatus, onOpenCommandPalette } = props

	return (
		<header className="sticky top-0 z-40 flex items-center justify-between border-terminal-border border-b bg-terminal-card/80 px-4 py-3 backdrop-blur">
			<div className="flex items-center gap-3">
				<button
					type="button"
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
						STATUS: <span className="font-bold text-matrix-glow">{systemStatus}</span>
					</span>
				</div>

				<button
					type="button"
					onClick={onOpenCommandPalette}
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
	)
}
