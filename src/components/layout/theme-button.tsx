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
				'flex cursor-pointer items-center gap-2 rounded border border-terminal-border bg-terminal-bg px-3 py-1.5 font-mono text-slate-500 text-xs transition-all duration-150 hover:border-matrix/40',
				className,
			)}
			aria-label="Toggle Theme"
		>
			<Icon className="h-3.5 w-3.5 text-matrix" />
		</button>
	)
}
