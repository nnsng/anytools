import { CronExpressionParser } from 'cron-parser'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { describeCronPart } from './cron-utils'

export default function CronParser() {
	const [cronString, setCronString] = useState<string>('*/15 9-17 * * 1-5')
	const [error, setError] = useState<string | null>(null)
	const [nextRuns, setNextRuns] = useState<string[]>([])
	const [explanation, setExplanation] = useState<{
		minute: string
		hour: string
		dayOfMonth: string
		month: string
		dayOfWeek: string
	} | null>(null)

	const parseCron = useCallback((expression: string) => {
		const expr = expression.trim()
		if (!expr) {
			setError(null)
			setNextRuns([])
			setExplanation(null)
			return
		}

		try {
			// Parse expression
			const interval = CronExpressionParser.parse(expr)
			setError(null)

			// Calculate next 5 runs
			const runs: string[] = []
			for (let i = 0; i < 5; i++) {
				runs.push(interval.next().toString())
			}
			setNextRuns(runs)

			// Break down columns
			const parts = expr.split(/\s+/)
			if (parts.length >= 5) {
				setExplanation({
					minute: describeCronPart(parts[0], 'minute'),
					hour: describeCronPart(parts[1], 'hour'),
					dayOfMonth: describeCronPart(parts[2], 'day of month'),
					month: describeCronPart(parts[3], 'month'),
					dayOfWeek: describeCronPart(parts[4], 'day of week'),
				})
			} else {
				setExplanation(null)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Invalid cron expression')
			setNextRuns([])
			setExplanation(null)
		}
	}, [])

	useEffect(() => {
		parseCron(cronString)
	}, [cronString, parseCron])

	const presets = [
		{ label: 'Every 5 mins', val: '*/5 * * * *' },
		{ label: 'Hourly', val: '0 * * * *' },
		{ label: 'Daily at midnight', val: '0 0 * * *' },
		{ label: 'Weekly (Sundays)', val: '0 0 * * 0' },
		{ label: 'Weekday working hours', val: '*/15 9-17 * * 1-5' },
	]

	return (
		<div className="grid grid-cols-1 gap-6 font-mono lg:grid-cols-12">
			{/* Input panel */}
			<div className="space-y-4 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-12">
				<span className="flex items-center gap-2 font-bold text-slate-300 text-xs uppercase tracking-wider">
					<span className="h-1.5 w-1.5 rounded-full bg-matrix" />
					Cron Expression Input
				</span>

				<div className="flex flex-col items-stretch gap-4 md:flex-row">
					<div className="grow">
						<Input
							value={cronString}
							onChange={(e) => setCronString(e.target.value)}
							placeholder="e.g. * * * * *"
							className="text-lg"
						/>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						{presets.map((preset) => (
							<Button
								key={preset.val}
								variant="outline"
								size="sm"
								className="text-xs"
								onClick={() => setCronString(preset.val)}
							>
								{preset.label}
							</Button>
						))}
					</div>
				</div>

				{error && (
					<p className="rounded border border-red-500/20 bg-red-950/20 p-2 text-red-400 text-xs">
						Error: {error}
					</p>
				)}
			</div>

			{/* Explanation Columns */}
			<div className="space-y-4 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-7">
				<div className="border-terminal-border border-b pb-2">
					<span className="font-bold text-slate-300 text-xs uppercase tracking-wider">
						Expression Breakdown
					</span>
				</div>

				{explanation ? (
					<div className="grid grid-cols-1 gap-2.5 text-xs">
						<div className="flex justify-between rounded-xs border border-terminal-border/60 bg-terminal-bg/50 p-2">
							<span className="font-bold text-slate-500 uppercase">Minutes (col 1):</span>
							<span className="font-semibold text-matrix">{explanation.minute}</span>
						</div>
						<div className="flex justify-between rounded-xs border border-terminal-border/60 bg-terminal-bg/50 p-2">
							<span className="font-bold text-slate-500 uppercase">Hours (col 2):</span>
							<span className="font-semibold text-matrix">{explanation.hour}</span>
						</div>
						<div className="flex justify-between rounded-xs border border-terminal-border/60 bg-terminal-bg/50 p-2">
							<span className="font-bold text-slate-500 uppercase">Day of Month (col 3):</span>
							<span className="font-semibold text-matrix">{explanation.dayOfMonth}</span>
						</div>
						<div className="flex justify-between rounded-xs border border-terminal-border/60 bg-terminal-bg/50 p-2">
							<span className="font-bold text-slate-500 uppercase">Month (col 4):</span>
							<span className="font-semibold text-matrix">{explanation.month}</span>
						</div>
						<div className="flex justify-between rounded-xs border border-terminal-border/60 bg-terminal-bg/50 p-2">
							<span className="font-bold text-slate-500 uppercase">Day of Week (col 5):</span>
							<span className="font-semibold text-matrix">{explanation.dayOfWeek}</span>
						</div>
					</div>
				) : (
					<div className="py-8 text-center text-slate-600 text-xs">
						Enter a valid cron expression to see structural breakdown.
					</div>
				)}
			</div>

			{/* Next executions */}
			<div className="space-y-4 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-5">
				<div className="border-terminal-border border-b pb-2">
					<span className="font-bold text-slate-300 text-xs uppercase tracking-wider">
						Next 5 Scheduled Executions
					</span>
				</div>

				{nextRuns.length > 0 ? (
					<div className="space-y-2">
						{nextRuns.map((run, idx) => (
							<div
								key={run}
								className="flex items-center justify-between rounded-xs border border-terminal-border bg-slate-900/60 p-2.5 text-xs"
							>
								<span className="font-bold text-slate-500">RUN #{idx + 1}</span>
								<span className="select-all font-mono font-semibold text-slate-200">{run}</span>
							</div>
						))}
					</div>
				) : (
					<div className="py-8 text-center text-slate-600 text-xs">
						No active schedules calculated.
					</div>
				)}
			</div>
		</div>
	)
}
