import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type CronInputProps = {
	cronString: string
	setCronString: (val: string) => void
	error: string | null
	className?: string
}

const presets = [
	{ label: 'Every 5 mins', val: '*/5 * * * *' },
	{ label: 'Hourly', val: '0 * * * *' },
	{ label: 'Daily at midnight', val: '0 0 * * *' },
	{ label: 'Weekly (Sundays)', val: '0 0 * * 0' },
	{ label: 'Weekday working hours', val: '*/15 9-17 * * 1-5' },
]

export function CronInput(props: CronInputProps) {
	const { cronString, setCronString, error, className } = props

	return (
		<Pane title="Cron Expression Parser" className={className}>
			<div className="space-y-4 p-6 font-mono">
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

				<div className="border-terminal-border flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
					<div className="flex items-center gap-2">
						<span className="text-xs font-bold text-slate-500">Expression string:</span>
						<span className="bg-terminal-bg text-matrix rounded px-2.5 py-1 text-sm font-bold">
							{cronString}
						</span>
					</div>
					{error && (
						<p className="rounded border border-red-500/20 bg-red-950/20 p-2 text-xs text-red-400">
							Error: {error}
						</p>
					)}
				</div>
			</div>
		</Pane>
	)
}
