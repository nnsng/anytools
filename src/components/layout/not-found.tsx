import { Link } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import { type ReactNode, useEffect } from 'react'

import { APP_NAME } from '@/constants/app'

type NotFoundProps = {
	children?: ReactNode
}

export function NotFound({ children }: NotFoundProps) {
	useEffect(() => {
		const previousTitle = document.title
		document.title = `404 - ${APP_NAME}`
		return () => {
			document.title = previousTitle
		}
	}, [])

	return (
		<div
			role="alert"
			className="mx-auto my-12 max-w-2xl rounded border border-red-500/30 bg-red-950/20 p-8 text-center font-mono"
		>
			<h2 className="mb-4 text-xl font-bold text-red-500">ERROR 404: MODULE_NOT_FOUND</h2>
			<div className="mb-6 text-sm text-slate-400">
				{children ?? <p>The page you are looking for is not registered in the system index.</p>}
			</div>
			<Link
				to="/"
				className="inline-flex items-center gap-2 rounded border border-red-500/50 bg-red-900/20 px-4 py-2 text-xs text-red-400 transition-colors hover:bg-red-900/40"
			>
				<Home className="h-3.5 w-3.5" />
				Back to home
			</Link>
		</div>
	)
}
