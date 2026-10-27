import { createFileRoute, type ErrorComponentProps } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'

import { ToolStub } from '@/components/tools/shared/tool-stub'
import { APP_NAME } from '@/constants/app'
import { getToolComponent } from '@/utils/tool-components'
import { TOOLS } from '@/utils/tools-registry'

function ToolError({ error, reset }: ErrorComponentProps) {
	return (
		<div
			role="alert"
			className="border-destructive/30 bg-destructive/10 mx-auto my-12 max-w-2xl rounded border p-8 text-center font-mono"
		>
			<h2 className="text-destructive mb-4 text-xl font-bold">ERROR: MODULE_CRASHED</h2>
			<p className="text-muted-foreground mb-6 text-sm">
				{error instanceof Error ? error.message : String(error)}
			</p>
			<div className="flex justify-center gap-3">
				<button
					type="button"
					onClick={reset}
					className="border-destructive/50 text-destructive cursor-pointer rounded border px-4 py-2 text-xs"
				>
					Retry
				</button>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="border-terminal-border text-muted-foreground cursor-pointer rounded border px-4 py-2 text-xs"
				>
					Reload page
				</button>
			</div>
		</div>
	)
}

export const Route = createFileRoute('/tools/$toolId')({
	component: ToolContainer,
	errorComponent: ToolError,
})

function ToolContainer() {
	const { toolId } = Route.useParams()
	const tool = TOOLS.find((t) => t.id === toolId)

	useEffect(() => {
		if (!tool) return
		const previousTitle = document.title
		document.title = `${tool.name} - ${APP_NAME}`
		return () => {
			document.title = previousTitle
		}
	}, [tool])

	if (!tool) {
		return (
			<div className="mx-auto my-12 max-w-2xl rounded border border-red-500/30 bg-red-950/20 p-8 text-center font-mono">
				<h2 className="mb-4 text-xl font-bold text-red-500">ERROR 404: MODULE_NOT_FOUND</h2>
				<p className="mb-6 text-sm text-slate-400">
					The requested system utility{' '}
					<code className="rounded bg-red-900/30 px-1 py-0.5 text-red-300">{toolId}</code> is not
					registered in the system index.
				</p>
				<div className="inline-block rounded border border-red-500/50 bg-red-900/20 px-4 py-2 text-xs text-red-400">
					$ cd /bin && ./run {toolId} --verbose
				</div>
			</div>
		)
	}

	const Component = getToolComponent(tool.id)

	return (
		<div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 md:p-6 lg:h-full lg:min-h-0 lg:p-8">
			<div className="border-terminal-border flex flex-col justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
				<div className="flex flex-col gap-2">
					<div className="text-matrix mb-1 flex items-center gap-2 font-mono text-xs">
						<span>[ SYSTEM_BIN ]</span>
						<span>/</span>
						<span>{tool.category.toLowerCase().replace(/\s+/g, '-')}</span>
					</div>
					<h1 className="text-foreground flex items-center gap-3 font-mono text-2xl font-bold tracking-tight md:text-3xl">
						{React.createElement(tool.icon, {
							className: 'w-7 h-7 text-matrix text-glow',
						})}
						<span className="cursor-blink">{tool.name}</span>
					</h1>
					<p className="mt-1 font-mono text-sm text-slate-400">{tool.description}</p>
				</div>
			</div>

			<div className="flex min-h-0 flex-1 [&>div]:w-full">
				<React.Suspense
					fallback={
						<div className="text-matrix flex h-full flex-col items-center justify-center gap-3 font-mono">
							<Loader2 className="h-8 w-8 animate-spin" />
							<span className="text-xs tracking-widest opacity-60">LOADING MODULE...</span>
						</div>
					}
				>
					{Component ? <Component /> : <ToolStub toolId={tool.id} name={tool.name} />}
				</React.Suspense>
			</div>
		</div>
	)
}
