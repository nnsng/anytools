import { BorderBox } from '@/components/tools/shared'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type EpochToDateProps = {
	inputEpoch: string
	epochError: string | null
	epochResults: {
		local: string
		utc: string
		iso: string
		relative: string
	} | null
	handleConvertEpoch: (value: string) => void
	setInputToCurrent: () => void
	className?: string
}

export function EpochToDate({
	inputEpoch,
	epochError,
	epochResults,
	handleConvertEpoch,
	setInputToCurrent,
	className,
}: EpochToDateProps) {
	return (
		<Pane title="Epoch Timestamp to Date" className={className}>
			<div className="flex flex-col space-y-6 p-6">
				<div className="space-y-2">
					<label htmlFor="input-epoch" className="text-xs text-slate-400 uppercase">
						Input Timestamp (Seconds / Millis)
					</label>
					<div className="flex gap-2">
						<Input
							id="input-epoch"
							value={inputEpoch}
							onChange={(e) => handleConvertEpoch(e.target.value)}
							placeholder="e.g. 1718211092"
						/>
						<Button variant="outline" onClick={setInputToCurrent}>
							Now
						</Button>
					</div>
					{epochError && <p className="text-xs text-red-700 dark:text-red-400">{epochError}</p>}
				</div>

				{epochResults && (
					<div className="space-y-4 pt-2">
						<div className="grid grid-cols-1 gap-3 text-sm">
							<BorderBox className="bg-terminal-bg flex flex-col gap-1 p-3">
								<span className="block text-xs text-slate-500">ISO 8601</span>
								<span className="font-mono break-all text-slate-200 select-all">
									{epochResults.iso}
								</span>
							</BorderBox>

							<BorderBox className="bg-terminal-bg flex flex-col gap-1 p-3">
								<span className="block text-xs text-slate-500">UTC Date-Time</span>
								<span className="font-mono break-all text-slate-200 select-all">
									{epochResults.utc}
								</span>
							</BorderBox>

							<BorderBox className="bg-terminal-bg flex flex-col gap-1 p-3">
								<span className="block text-xs text-slate-500">Local Date-Time</span>
								<span className="font-mono break-all text-slate-200 select-all">
									{epochResults.local}
								</span>
							</BorderBox>

							<BorderBox className="bg-terminal-bg flex flex-col gap-1 p-3">
								<span className="block text-xs text-slate-500">Relative Time</span>
								<span className="text-matrix font-mono font-semibold">{epochResults.relative}</span>
							</BorderBox>
						</div>
					</div>
				)}
			</div>
		</Pane>
	)
}
