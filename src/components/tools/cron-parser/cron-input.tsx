import { useEffect, useState } from 'react'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
	const [activeInputTab, setActiveInputTab] = useState<string>('manual')

	// Generator State
	const [genMinuteType, setGenMinuteType] = useState<string>('every')
	const [genMinuteValue, setGenMinuteValue] = useState<number>(5)
	const [genHourType, setGenHourType] = useState<string>('every')
	const [genHourValue, setGenHourValue] = useState<number>(1)
	const [genDayOfMonthType, setGenDayOfMonthType] = useState<string>('every')
	const [genDayOfMonthValue, setGenDayOfMonthValue] = useState<number>(1)
	const [genMonthType, setGenMonthType] = useState<string>('every')
	const [genMonthValue, setGenMonthValue] = useState<number>(1)
	const [genDayOfWeekType, setGenDayOfWeekType] = useState<string>('every')
	const [genDayOfWeekValue, setGenDayOfWeekValue] = useState<number>(1)

	// Sync generator values back to the cronString
	useEffect(() => {
		if (activeInputTab !== 'generator') return

		let min = '*'
		if (genMinuteType === 'interval') min = `*/${genMinuteValue}`
		else if (genMinuteType === 'specific') min = `${genMinuteValue}`

		let hr = '*'
		if (genHourType === 'interval') hr = `*/${genHourValue}`
		else if (genHourType === 'specific') hr = `${genHourValue}`

		let dom = '*'
		if (genDayOfMonthType === 'specific') dom = `${genDayOfMonthValue}`

		let mon = '*'
		if (genMonthType === 'specific') mon = `${genMonthValue}`

		let dow = '*'
		if (genDayOfWeekType === 'specific') dow = `${genDayOfWeekValue}`

		const generated = `${min} ${hr} ${dom} ${mon} ${dow}`
		setCronString(generated)
	}, [
		activeInputTab,
		genMinuteType,
		genMinuteValue,
		genHourType,
		genHourValue,
		genDayOfMonthType,
		genDayOfMonthValue,
		genMonthType,
		genMonthValue,
		genDayOfWeekType,
		genDayOfWeekValue,
		setCronString,
	])

	return (
		<Pane
			title="Cron Expression Builder"
			className="lg:col-span-12"
			actions={
				<Tabs value={activeInputTab} onValueChange={setActiveInputTab}>
					<TabsList>
						<TabsTrigger value="manual">Manual Input</TabsTrigger>
						<TabsTrigger value="generator">Cron Generator</TabsTrigger>
					</TabsList>
				</Tabs>
			}
		>
			<div className="space-y-4 p-6 font-mono">
				{activeInputTab === 'manual' ? (
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
				) : (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
						{/* Minute */}
						<div className="space-y-2">
							<span className="font-bold text-[10px] text-slate-500 uppercase">Minute</span>
							<Select value={genMinuteType} onValueChange={setGenMinuteType}>
								<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									<SelectItem value="every">Every Minute (*)</SelectItem>
									<SelectItem value="interval">Interval (*/n)</SelectItem>
									<SelectItem value="specific">Specific (n)</SelectItem>
								</SelectContent>
							</Select>
							{genMinuteType !== 'every' && (
								<div className="flex items-center">
									<Button
										type="button"
										variant="outline"
										className="h-7 w-7 rounded-r-none border-terminal-border border-r-0 p-0 text-slate-400 hover:text-white"
										onClick={() =>
											setGenMinuteValue((v) =>
												Math.max(genMinuteType === 'interval' ? 1 : 0, v - 1),
											)
										}
									>
										-
									</Button>
									<Input
										type="number"
										min={genMinuteType === 'interval' ? 1 : 0}
										max={59}
										value={genMinuteValue}
										onChange={(e) =>
											setGenMinuteValue(
												Math.min(
													59,
													Math.max(
														genMinuteType === 'interval' ? 1 : 0,
														parseInt(e.target.value, 10) || 0,
													),
												),
											)
										}
										className="h-7 w-full rounded-none border-terminal-border p-0 text-center font-mono text-white text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
									/>
									<Button
										type="button"
										variant="outline"
										className="h-7 w-7 rounded-l-none border-terminal-border border-l-0 p-0 text-slate-400 hover:text-white"
										onClick={() => setGenMinuteValue((v) => Math.min(59, v + 1))}
									>
										+
									</Button>
								</div>
							)}
						</div>

						{/* Hour */}
						<div className="space-y-2">
							<span className="font-bold text-[10px] text-slate-500 uppercase">Hour</span>
							<Select value={genHourType} onValueChange={setGenHourType}>
								<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									<SelectItem value="every">Every Hour (*)</SelectItem>
									<SelectItem value="interval">Interval (*/n)</SelectItem>
									<SelectItem value="specific">Specific (n)</SelectItem>
								</SelectContent>
							</Select>
							{genHourType !== 'every' && (
								<div className="flex items-center">
									<Button
										type="button"
										variant="outline"
										className="h-7 w-7 rounded-r-none border-terminal-border border-r-0 p-0 text-slate-400 hover:text-white"
										onClick={() =>
											setGenHourValue((v) => Math.max(genHourType === 'interval' ? 1 : 0, v - 1))
										}
									>
										-
									</Button>
									<Input
										type="number"
										min={genHourType === 'interval' ? 1 : 0}
										max={23}
										value={genHourValue}
										onChange={(e) =>
											setGenHourValue(
												Math.min(
													23,
													Math.max(
														genHourType === 'interval' ? 1 : 0,
														parseInt(e.target.value, 10) || 0,
													),
												),
											)
										}
										className="h-7 w-full rounded-none border-terminal-border p-0 text-center font-mono text-white text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
									/>
									<Button
										type="button"
										variant="outline"
										className="h-7 w-7 rounded-l-none border-terminal-border border-l-0 p-0 text-slate-400 hover:text-white"
										onClick={() => setGenHourValue((v) => Math.min(23, v + 1))}
									>
										+
									</Button>
								</div>
							)}
						</div>

						{/* Day of Month */}
						<div className="space-y-2">
							<span className="font-bold text-[10px] text-slate-500 uppercase">Day of Month</span>
							<Select value={genDayOfMonthType} onValueChange={setGenDayOfMonthType}>
								<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									<SelectItem value="every">Every Day (*)</SelectItem>
									<SelectItem value="specific">Specific (n)</SelectItem>
								</SelectContent>
							</Select>
							{genDayOfMonthType !== 'every' && (
								<div className="flex items-center">
									<Button
										type="button"
										variant="outline"
										className="h-7 w-7 rounded-r-none border-terminal-border border-r-0 p-0 text-slate-400 hover:text-white"
										onClick={() => setGenDayOfMonthValue((v) => Math.max(1, v - 1))}
									>
										-
									</Button>
									<Input
										type="number"
										min={1}
										max={31}
										value={genDayOfMonthValue}
										onChange={(e) =>
											setGenDayOfMonthValue(
												Math.min(31, Math.max(1, parseInt(e.target.value, 10) || 1)),
											)
										}
										className="h-7 w-full rounded-none border-terminal-border p-0 text-center font-mono text-white text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
									/>
									<Button
										type="button"
										variant="outline"
										className="h-7 w-7 rounded-l-none border-terminal-border border-l-0 p-0 text-slate-400 hover:text-white"
										onClick={() => setGenDayOfMonthValue((v) => Math.min(31, v + 1))}
									>
										+
									</Button>
								</div>
							)}
						</div>

						{/* Month */}
						<div className="space-y-2">
							<span className="font-bold text-[10px] text-slate-500 uppercase">Month</span>
							<Select value={genMonthType} onValueChange={setGenMonthType}>
								<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									<SelectItem value="every">Every Month (*)</SelectItem>
									<SelectItem value="specific">Specific Month</SelectItem>
								</SelectContent>
							</Select>
							{genMonthType !== 'every' && (
								<Select
									value={String(genMonthValue)}
									onValueChange={(v) => setGenMonthValue(Number(v))}
								>
									<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
										{[
											'Jan',
											'Feb',
											'Mar',
											'Apr',
											'May',
											'Jun',
											'Jul',
											'Aug',
											'Sep',
											'Oct',
											'Nov',
											'Dec',
										].map((m, idx) => (
											<SelectItem key={m} value={String(idx + 1)}>
												{m}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</div>

						{/* Day of Week */}
						<div className="space-y-2">
							<span className="font-bold text-[10px] text-slate-500 uppercase">Day of Week</span>
							<Select value={genDayOfWeekType} onValueChange={setGenDayOfWeekType}>
								<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									<SelectItem value="every">Every Day (*)</SelectItem>
									<SelectItem value="specific">Specific Day</SelectItem>
								</SelectContent>
							</Select>
							{genDayOfWeekType !== 'every' && (
								<Select
									value={String(genDayOfWeekValue)}
									onValueChange={(v) => setGenDayOfWeekValue(Number(v))}
								>
									<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
										{[
											'Sunday',
											'Monday',
											'Tuesday',
											'Wednesday',
											'Thursday',
											'Friday',
											'Saturday',
										].map((d, idx) => (
											<SelectItem key={d} value={String(idx)}>
												{d}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</div>
					</div>
				)}

				<div className="flex flex-col items-center justify-between gap-4 border-terminal-border border-t pt-4 sm:flex-row">
					<div className="flex items-center gap-2">
						<span className="font-bold text-slate-500 text-xs">Expression string:</span>
						<span className="rounded bg-terminal-bg px-2.5 py-1 font-bold text-matrix text-sm">
							{cronString}
						</span>
					</div>
					{error && (
						<p className="rounded border border-red-500/20 bg-red-950/20 p-2 text-red-400 text-xs">
							Error: {error}
						</p>
					)}
				</div>
			</div>
		</Pane>
	)
}
