type CronBreakdownProps = {
	explanation: {
		minute: string
		hour: string
		dayOfMonth: string
		month: string
		dayOfWeek: string
	} | null
}

export function CronBreakdown({ explanation }: CronBreakdownProps) {
	return (
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
	)
}
