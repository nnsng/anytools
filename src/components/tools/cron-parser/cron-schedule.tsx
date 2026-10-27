import { BorderBox } from '@/components/tools/shared'
import { Pane } from '@/components/tools/shared/pane'

type CronScheduleProps = {
	nextRuns: string[]
	className?: string
}

export function CronSchedule({ nextRuns, className }: CronScheduleProps) {
	return (
		<Pane title="Next 5 Scheduled Executions" dotClassName="bg-blue-500" className={className}>
			<div className="p-6">
				{nextRuns.length > 0 ? (
					<div className="flex flex-col gap-3">
						{nextRuns.map((run, idx) => (
							<BorderBox key={run} className="flex items-center justify-between p-3 text-xs">
								<span className="font-bold text-slate-500">RUN #{idx + 1}</span>
								<span className="font-mono font-semibold text-slate-200 select-all">{run}</span>
							</BorderBox>
						))}
					</div>
				) : (
					<div className="py-8 text-center text-xs text-slate-600">
						No active schedules calculated.
					</div>
				)}
			</div>
		</Pane>
	)
}
