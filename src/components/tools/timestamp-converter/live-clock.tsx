import { Pause, Play, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

import { BorderBox } from '@/components/tools/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { currentEpochSeconds } from './utils'

type LiveClockProps = {
	setInputToCurrent: () => void
	className?: string
}

export function LiveClock(props: LiveClockProps) {
	const { setInputToCurrent, className } = props

	// Owning the ticking state here keeps the 1s re-render inside this leaf component
	const [liveEpoch, setLiveEpoch] = useState<number>(currentEpochSeconds)
	const [isLiveActive, setIsLiveActive] = useState<boolean>(true)

	useEffect(() => {
		if (!isLiveActive) return
		const interval = setInterval(() => setLiveEpoch(currentEpochSeconds()), 1000)
		return () => clearInterval(interval)
	}, [isLiveActive])

	return (
		<BorderBox
			className={cn('flex flex-col items-center justify-between gap-2 lg:flex-row', className)}
		>
			<div className="flex items-center gap-4">
				<div className="text-xs tracking-wider text-slate-500 uppercase">LIVE EPOCH CLOCK:</div>
				<div className="text-matrix text-xl font-bold tabular-nums">{liveEpoch}</div>
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
