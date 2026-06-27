import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark'

type ThemeButtonProps = {
	className?: string
}

export function ThemeButton({ className }: ThemeButtonProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
		return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
	})

	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark')
		localStorage.setItem('theme', theme)
	}, [theme])

	const toggleTheme = async () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark'

		if (!document.startViewTransition) {
			setTheme(newTheme)
			return
		}

		// Disable CSS transitions on all elements during the view transition to prevent flickering
		document.documentElement.classList.add('theme-transitioning')

		// Use View Transition API for smooth cross-fade
		const transition = document.startViewTransition(() => {
			flushSync(() => {
				setTheme(newTheme)
			})
		})

		// Re-enable CSS transitions after the view transition animation finishes
		try {
			await transition.finished
		} finally {
			document.documentElement.classList.remove('theme-transitioning')
		}
	}

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
