import { Link } from '@tanstack/react-router'
import { Menu, Terminal } from 'lucide-react'

import { APP_NAME } from '@/constants/app'

import { CommandPalette } from './command-palette'
import { ThemeButton } from './theme-button'

type HeaderProps = {
	sidebarOpen: boolean
	setSidebarOpen: (open: boolean) => void
}

export function Header(props: HeaderProps) {
	const { sidebarOpen, setSidebarOpen } = props

	return (
		<header className="border-terminal-border bg-terminal-card/80 sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 backdrop-blur">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="hover:border-terminal-border hover:text-matrix-glow rounded border border-transparent p-1 text-slate-400 transition-colors lg:hidden"
				>
					<Menu className="h-5 w-5" />
				</button>

				<Link
					to="/"
					className="group hover:text-matrix-glow dark:text-foreground dark:hover:text-matrix-glow flex items-center gap-2.5 text-slate-900 transition-colors"
				>
					<Terminal className="text-glow text-matrix h-6 w-6 transition-transform group-hover:scale-105" />
					<span className="text-base font-bold tracking-wider uppercase md:text-lg">
						{APP_NAME}
						<span className="text-matrix font-bold">.SYS</span>
					</span>
				</Link>
			</div>

			<div className="flex flex-row gap-2">
				<CommandPalette />
				<ThemeButton />
			</div>
		</header>
	)
}
