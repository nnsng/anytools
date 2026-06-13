import { BorderBox } from '@/components/tools/shared'
import { Pane } from '@/components/tools/shared/pane'

type CronBreakdownProps = {
	explanation: {
		minute: string
		hour: string
		dayOfMonth: string
		month: string
		dayOfWeek: string
	} | null
	className?: string
}

export function CronBreakdown({ explanation, className }: CronBreakdownProps) {
	return (
		<Pane title="Expression Breakdown" type="output" className={className}>
			<div className="p-6">
				{explanation ? (
					<div className="flex flex-col gap-3 text-xs">
						<BorderBox className="flex justify-between bg-terminal-bg/50 p-3">
							<span className="font-bold text-slate-500 uppercase">Minutes (col 1):</span>
							<span className="font-semibold text-matrix">{explanation.minute}</span>
						</BorderBox>
						<BorderBox className="flex justify-between bg-terminal-bg/50 p-3">
							<span className="font-bold text-slate-500 uppercase">Hours (col 2):</span>
							<span className="font-semibold text-matrix">{explanation.hour}</span>
						</BorderBox>
						<BorderBox className="flex justify-between bg-terminal-bg/50 p-3">
							<span className="font-bold text-slate-500 uppercase">Day of Month (col 3):</span>
							<span className="font-semibold text-matrix">{explanation.dayOfMonth}</span>
						</BorderBox>
						<BorderBox className="flex justify-between bg-terminal-bg/50 p-3">
							<span className="font-bold text-slate-500 uppercase">Month (col 4):</span>
							<span className="font-semibold text-matrix">{explanation.month}</span>
						</BorderBox>
						<BorderBox className="flex justify-between bg-terminal-bg/50 p-3">
							<span className="font-bold text-slate-500 uppercase">Day of Week (col 5):</span>
							<span className="font-semibold text-matrix">{explanation.dayOfWeek}</span>
						</BorderBox>
					</div>
				) : (
					<div className="py-8 text-center text-slate-600 text-xs">
						Enter a valid cron expression to see structural breakdown.
					</div>
				)}
			</div>
		</Pane>
	)
}
