import { Sparkles } from 'lucide-react'
import { APP_NAME } from '@/constants/app'

export function HeroSection() {
	return (
		<div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded border border-terminal-border bg-terminal-card/50 p-6 md:flex-row md:items-center md:p-8">
			<div className="relative z-10 max-w-2xl space-y-3">
				<div className="inline-flex items-center gap-1.5 rounded border border-matrix/30 bg-matrix/10 px-2.5 py-1 font-bold text-[10px] text-matrix-glow uppercase">
					<Sparkles className="h-3.5 w-3.5" /> Client-Side Sandbox Operational
				</div>

				<h1 className="cursor-blink font-bold text-3xl text-white uppercase tracking-tight">
					{APP_NAME.toLowerCase()}_WORKSPACE
					<span className="font-bold text-matrix">.LOG</span>
				</h1>

				<p className="text-slate-400 text-xs leading-relaxed md:text-sm">
					Welcome to the local system utilities suite. All transformations, encodings, and
					calculations process natively within your browser. No server calls, no trackers, zero data
					leakage.
				</p>
			</div>
		</div>
	)
}
