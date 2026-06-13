import { Pause, Play, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

type LiveClockProps = {
	liveEpoch: number
	isLiveActive: boolean
	setIsLiveActive: (val: boolean) => void
	setInputToCurrent: () => void
}

export function LiveClock({
	liveEpoch,
	isLiveActive,
	setIsLiveActive,
	setInputToCurrent,
}: LiveClockProps) {
	return (
		<div className="flex flex-col items-center justify-between gap-2 rounded-sm border border-terminal-border bg-terminal-card/40 p-4 lg:col-span-12 lg:flex-row">
			<div className="flex items-center gap-4">
				<div className="text-slate-500 text-xs uppercase tracking-wider">LIVE EPOCH CLOCK:</div>
				<div className="font-bold text-glow text-matrix text-xl tabular-nums">{liveEpoch}</div>
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setIsLiveActive(!isLiveActive)}
					className="flex items-center gap-1.5"
				>
					{isLiveActive ? (
						<>
							<Pause className="h-3.5 w-3.5" /> PAUSE
						</>
					) : (
						<>
							<Play className="h-3.5 w-3.5" /> RESUME
						</>
					)}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={setInputToCurrent}
					className="flex items-center gap-1.5"
				>
					<RefreshCw className="h-3.5 w-3.5" /> COPY TO INPUT
				</Button>
			</div>
		</div>
	)
}
