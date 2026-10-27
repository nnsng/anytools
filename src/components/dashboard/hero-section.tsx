import { Sparkles } from 'lucide-react'

import { APP_NAME } from '@/constants/app'

export function HeroSection() {
	return (
		<div className="border-terminal-border bg-terminal-card/50 relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded border p-6 md:flex-row md:items-center md:p-8">
			<div className="relative z-10 max-w-2xl space-y-3">
				<div className="border-matrix/30 bg-matrix/10 text-matrix-glow inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-bold uppercase">
					<Sparkles className="h-3.5 w-3.5" /> Client-Side Sandbox Operational
				</div>

				<h1 className="cursor-blink text-foreground text-3xl font-bold tracking-tight uppercase">
					{APP_NAME.toLowerCase()}_WORKSPACE
					<span className="text-matrix font-bold">.LOG</span>
				</h1>

				<p className="text-xs leading-relaxed text-slate-400 md:text-sm">
					Welcome to the local system utilities suite. All transformations, encodings, and
					calculations process natively within your browser. No server calls, no trackers, zero data
					leakage.
				</p>
			</div>
		</div>
	)
}
