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
}

export function EpochToDate({
	inputEpoch,
	epochError,
	epochResults,
	handleConvertEpoch,
	setInputToCurrent,
}: EpochToDateProps) {
	return (
		<div className="flex flex-col space-y-6 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-6">
			<h3 className="border-terminal-border border-b pb-2 font-bold text-slate-300 text-sm uppercase">
				Epoch Timestamp to Date
			</h3>

			<div className="space-y-2">
				<label htmlFor="input-epoch" className="text-slate-400 text-xs uppercase">
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
				{epochError && <p className="text-red-400 text-xs">{epochError}</p>}
			</div>

			{epochResults && (
				<div className="space-y-4 pt-2">
					<div className="grid grid-cols-1 gap-3 text-sm">
						<div className="rounded-xs border border-terminal-border bg-terminal-bg p-3">
							<span className="block text-[10px] text-slate-500">ISO 8601</span>
							<span className="select-all break-all font-mono text-slate-200">
								{epochResults.iso}
							</span>
						</div>
						<div className="rounded-xs border border-terminal-border bg-terminal-bg p-3">
							<span className="block text-[10px] text-slate-500">UTC Date-Time</span>
							<span className="select-all break-all font-mono text-slate-200">
								{epochResults.utc}
							</span>
						</div>
						<div className="rounded-xs border border-terminal-border bg-terminal-bg p-3">
							<span className="block text-[10px] text-slate-500">Local Date-Time</span>
							<span className="select-all break-all font-mono text-slate-200">
								{epochResults.local}
							</span>
						</div>
						<div className="rounded-xs border border-terminal-border bg-terminal-bg p-3">
							<span className="block text-[10px] text-slate-500">Relative Time</span>
							<span className="font-mono font-semibold text-matrix">{epochResults.relative}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
