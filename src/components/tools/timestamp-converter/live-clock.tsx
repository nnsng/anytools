import { Pause, Play, RefreshCw } from 'lucide-react'
import { BorderBox } from '@/components/tools/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type LiveClockProps = {
	liveEpoch: number
	isLiveActive: boolean
	setIsLiveActive: (val: boolean) => void
	setInputToCurrent: () => void
	className?: string
}

export function LiveClock(props: LiveClockProps) {
	const { liveEpoch, isLiveActive, setIsLiveActive, setInputToCurrent, className } = props

	return (
		<BorderBox
			className={cn('flex flex-col items-center justify-between gap-2 lg:flex-row', className)}
		>
			<div className="flex items-center gap-4">
				<div className="text-slate-500 text-xs uppercase tracking-wider">LIVE EPOCH CLOCK:</div>
				<div className="font-bold text-matrix text-xl tabular-nums">{liveEpoch}</div>
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
		</BorderBox>
	)
}
