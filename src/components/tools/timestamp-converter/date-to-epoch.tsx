import { BorderBox } from '@/components/tools/shared'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/ui/date-time-picker'

type DateToEpochProps = {
	inputDate: string
	dateError: string | null
	dateResults: {
		seconds: number
		millis: number
	} | null
	handleConvertDate: (value: string) => void
	handleConvertEpoch: (value: string) => void
	className?: string
}

export function DateToEpoch({
	inputDate,
	dateError,
	dateResults,
	handleConvertDate,
	handleConvertEpoch,
	className,
}: DateToEpochProps) {
	return (
		<Pane title="Date to Epoch Timestamp" className={className}>
			<div className="flex flex-col space-y-6 p-6">
				<div className="space-y-2">
					<label htmlFor="input-date" className="text-slate-400 text-xs uppercase">
						Input Date/Time
					</label>
					<DateTimePicker value={inputDate} onChange={(value) => handleConvertDate(value)} />
					{dateError && <p className="text-red-400 text-xs">{dateError}</p>}
				</div>

				{dateResults && (
					<div className="space-y-4 pt-2">
						<div className="grid grid-cols-1 gap-3 text-sm">
							<BorderBox className="flex items-center justify-between bg-terminal-bg p-3">
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
							</BorderBox>

							<BorderBox className="flex items-center justify-between bg-terminal-bg p-3">
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
							</BorderBox>
						</div>
					</div>
				)}
			</div>
		</Pane>
	)
}
