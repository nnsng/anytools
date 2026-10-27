import { Moon, Sun } from 'lucide-react'

import { useThemeContext } from '@/contexts/theme-context'
import { cn } from '@/lib/utils'

type ThemeButtonProps = {
	className?: string
}

export function ThemeButton({ className }: ThemeButtonProps) {
	const { theme, toggleTheme } = useThemeContext()

	const Icon = theme === 'dark' ? Sun : Moon

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={cn(
				'border-terminal-border bg-terminal-bg hover:border-matrix/40 flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 font-mono text-xs text-slate-500 transition-all duration-150',
				className,
			)}
			aria-label="Toggle Theme"
		>
			<Icon className="text-matrix h-3.5 w-3.5" />
		</button>
	)
}
