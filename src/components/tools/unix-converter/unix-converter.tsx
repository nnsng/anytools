import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Pause, Play, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

dayjs.extend(relativeTime)

export default function UnixConverter() {
	// Live Clock
	const [liveEpoch, setLiveEpoch] = useState<number>(Math.floor(Date.now() / 1000))
	const [isLiveActive, setIsLiveActive] = useState<boolean>(true)

	useEffect(() => {
		if (!isLiveActive) return
		const interval = setInterval(() => {
			setLiveEpoch(Math.floor(Date.now() / 1000))
		}, 1000)
		return () => clearInterval(interval)
	}, [isLiveActive])

	// Conversion: Epoch to Date
	const [inputEpoch, setInputEpoch] = useState<string>(Math.floor(Date.now() / 1000).toString())
	const [epochError, setEpochError] = useState<string | null>(null)
	const [epochResults, setEpochResults] = useState<{
		local: string
		utc: string
		iso: string
		relative: string
	} | null>(null)

	const handleConvertEpoch = useCallback((value: string) => {
		setInputEpoch(value)
		if (!value) {
			setEpochResults(null)
			setEpochError(null)
			return
		}

		const num = Number(value.trim())
		if (Number.isNaN(num)) {
			setEpochError('Invalid number value')
			setEpochResults(null)
			return
		}

		setEpochError(null)
		// Guess seconds vs milliseconds: if length >= 12, assume ms
		const isMs = value.trim().length >= 12
		const timestamp = isMs ? num : num * 1000

		try {
			const date = new Date(timestamp)
			if (Number.isNaN(date.getTime())) {
				throw new Error()
			}

			setEpochResults({
				local: date.toString(),
				utc: date.toUTCString(),
				iso: date.toISOString(),
				relative: dayjs(date).fromNow(),
			})
		} catch {
			setEpochError('Date conversion failed. Out of range?')
			setEpochResults(null)
		}
	}, [])

	// Conversion: Date to Epoch
	const [inputDate, setInputDate] = useState<string>(new Date().toISOString().substring(0, 16)) // YYYY-MM-DDTHH:MM
	const [dateError, setDateError] = useState<string | null>(null)
	const [dateResults, setDateResults] = useState<{
		seconds: number
		millis: number
	} | null>(null)

	const handleConvertDate = useCallback((value: string) => {
		setInputDate(value)
		if (!value) {
			setDateResults(null)
			setDateError(null)
			return
		}

		try {
			const date = new Date(value)
			if (Number.isNaN(date.getTime())) {
				setDateError('Invalid Date format')
				setDateResults(null)
				return
			}
			setDateError(null)
			setDateResults({
				seconds: Math.floor(date.getTime() / 1000),
				millis: date.getTime(),
			})
		} catch {
			setDateError('Failed to parse date')
			setDateResults(null)
		}
	}, [])

	// Run initial conversions on load
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs only on mount with initial values
	useEffect(() => {
		handleConvertEpoch(inputEpoch)
		handleConvertDate(inputDate)
	}, [])

	const setInputToCurrent = () => {
		const current = Math.floor(Date.now() / 1000).toString()
		handleConvertEpoch(current)
	}

	return (
		<div className="grid grid-cols-1 gap-6 font-mono lg:grid-cols-12">
			{/* Live Clock Widget */}
			<div className="flex items-center justify-between rounded-sm border border-terminal-border bg-terminal-card/40 p-4 lg:col-span-12">
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

			{/* Epoch to Date Pane */}
			<div className="flex flex-col space-y-6 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-6">
				<h3 className="border-terminal-border border-b pb-2 font-bold text-slate-300 text-sm uppercase">
					Epoch Timestamp to Date
				</h3>

				<div className="space-y-2">
					<label htmlFor="input-epoch" className="text-slate-400 text-xs uppercase">
						Input Timestamp (Seconds / Millis)
					</label>
					<div className="flex gap-2">
						<Input
							id="input-epoch"
							value={inputEpoch}
							onChange={(e) => handleConvertEpoch(e.target.value)}
							placeholder="e.g. 1718211092"
						/>
						<Button variant="outline" size="sm" onClick={setInputToCurrent}>
							Now
						</Button>
					</div>
					{epochError && <p className="text-red-400 text-xs">{epochError}</p>}
				</div>

				{epochResults && (
					<div className="space-y-4 pt-2">
						<div className="grid grid-cols-1 gap-3 text-sm">
							<div className="rounded-xs border border-terminal-border bg-terminal-bg p-3">
								<span className="block text-[10px] text-slate-500">ISO 8601</span>
								<span className="select-all break-all font-mono text-slate-200">
									{epochResults.iso}
								</span>
							</div>
							<div className="rounded-xs border border-terminal-border bg-terminal-bg p-3">
								<span className="block text-[10px] text-slate-500">UTC Date-Time</span>
								<span className="select-all break-all font-mono text-slate-200">
									{epochResults.utc}
								</span>
							</div>
							<div className="rounded-xs border border-terminal-border bg-terminal-bg p-3">
								<span className="block text-[10px] text-slate-500">Local Date-Time</span>
								<span className="select-all break-all font-mono text-slate-200">
									{epochResults.local}
								</span>
							</div>
							<div className="rounded-xs border border-terminal-border bg-terminal-bg p-3">
								<span className="block text-[10px] text-slate-500">Relative Time</span>
								<span className="font-mono font-semibold text-matrix">{epochResults.relative}</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Date to Epoch Pane */}
			<div className="flex flex-col space-y-6 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-6">
				<h3 className="border-terminal-border border-b pb-2 font-bold text-slate-300 text-sm uppercase">
					Date to Epoch Timestamp
				</h3>

				<div className="space-y-2">
					<label htmlFor="input-date" className="text-slate-400 text-xs uppercase">
						Input Date/Time
					</label>
					<Input
						id="input-date"
						type="datetime-local"
						value={inputDate}
						onChange={(e) => handleConvertDate(e.target.value)}
					/>
					{dateError && <p className="text-red-400 text-xs">{dateError}</p>}
				</div>

				{dateResults && (
					<div className="space-y-4 pt-2">
						<div className="grid grid-cols-1 gap-3 text-sm">
							<div className="flex items-center justify-between rounded-xs border border-terminal-border bg-terminal-bg p-3">
								<div>
									<span className="block text-[10px] text-slate-500">Seconds (Epoch)</span>
									<span className="select-all font-bold font-mono text-slate-200">
										{dateResults.seconds}
									</span>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleConvertEpoch(dateResults.seconds.toString())}
								>
									Load
								</Button>
							</div>

							<div className="flex items-center justify-between rounded-xs border border-terminal-border bg-terminal-bg p-3">
								<div>
									<span className="block text-[10px] text-slate-500">Milliseconds (Epoch)</span>
									<span className="select-all font-bold font-mono text-slate-200">
										{dateResults.millis}
									</span>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleConvertEpoch(dateResults.millis.toString())}
								>
									Load
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
