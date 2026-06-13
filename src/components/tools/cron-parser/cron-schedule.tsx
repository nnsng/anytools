import { BorderBox } from '@/components/tools/shared'
import { Pane } from '@/components/tools/shared/pane'

type CronScheduleProps = {
	nextRuns: string[]
	className?: string
}

export function CronSchedule({ nextRuns, className }: CronScheduleProps) {
	return (
		<Pane title="Next 5 Scheduled Executions" type="output" className={className}>
			<div className="p-6">
				{nextRuns.length > 0 ? (
					<div className="flex flex-col gap-3">
						{nextRuns.map((run, idx) => (
							<BorderBox
								key={run}
								className="flex items-center justify-between bg-slate-900/60 p-3 text-xs"
							>
								<span className="font-bold text-slate-500">RUN #{idx + 1}</span>
								<span className="select-all font-mono font-semibold text-slate-200">{run}</span>
							</BorderBox>
						))}
					</div>
				) : (
					<div className="py-8 text-center text-slate-600 text-xs">
						No active schedules calculated.
					</div>
				)}
			</div>
		</Pane>
	)
}
