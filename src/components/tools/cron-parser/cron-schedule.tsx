type CronScheduleProps = {
	nextRuns: string[]
}

export function CronSchedule({ nextRuns }: CronScheduleProps) {
	return (
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
	)
}
