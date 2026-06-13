import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type CronInputProps = {
	cronString: string
	setCronString: (val: string) => void
	error: string | null
}

const presets = [
	{ label: 'Every 5 mins', val: '*/5 * * * *' },
	{ label: 'Hourly', val: '0 * * * *' },
	{ label: 'Daily at midnight', val: '0 0 * * *' },
	{ label: 'Weekly (Sundays)', val: '0 0 * * 0' },
	{ label: 'Weekday working hours', val: '*/15 9-17 * * 1-5' },
]

export function CronInput({ cronString, setCronString, error }: CronInputProps) {
	return (
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
	)
}
