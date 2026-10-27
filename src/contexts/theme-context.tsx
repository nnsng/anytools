import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'

type ContextValue = {
	theme: Theme
	toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'theme'

const ThemeContext = createContext<ContextValue | null>(null)

function readInitialTheme(): Theme {
	try {
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
		if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
	} catch {
		// storage can be blocked (private mode, disabled site data)
	}
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useState<Theme>(readInitialTheme)

	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark')
		document
			.getElementById('favicon')
			?.setAttribute('href', theme === 'dark' ? '/favicon.svg' : '/favicon-light.svg')
		try {
			localStorage.setItem(THEME_STORAGE_KEY, theme)
		} catch {
			// ignore: the theme still applies for this session
		}
	}, [theme])

	const toggleTheme = useCallback(async () => {
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
	}, [theme])

	const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must use inside ThemeProvider')
	}
	return context
}

export default ThemeContext
