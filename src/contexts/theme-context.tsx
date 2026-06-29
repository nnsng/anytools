import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'

type ContextValue = {
	theme: Theme
	toggleTheme: () => void
}

const ThemeContext = createContext<ContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useState<Theme>(() => {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
		return 'dark'
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

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must use inside ThemeProvider')
	}
	return context
}

export default ThemeContext
