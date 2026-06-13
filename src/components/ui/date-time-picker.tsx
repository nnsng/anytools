import dayjs from 'dayjs'
import { CalendarIcon, Clock } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type DateTimePickerProps = {
	value: string
	onChange: (value: string) => void
	className?: string
}

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
	const date = value ? new Date(value) : new Date()

	const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
		Number.isNaN(date.getTime()) ? new Date() : date,
	)
	const [timeString, setTimeString] = React.useState<string>(
		Number.isNaN(date.getTime()) ? '12:00' : dayjs(date).format('HH:mm'),
	)

	React.useEffect(() => {
		const parsed = value ? new Date(value) : new Date()
		if (!Number.isNaN(parsed.getTime())) {
			setSelectedDate(parsed)
			setTimeString(dayjs(parsed).format('HH:mm'))
		}
	}, [value])

	const [selectedHour, selectedMinute] = React.useMemo(() => {
		const parts = timeString.split(':')
		const hh = parts[0]?.padStart(2, '0') || '12'
		const mm = parts[1]?.padStart(2, '0') || '00'
		return [hh, mm]
	}, [timeString])

	const handleSelectDate = (newDate: Date | undefined) => {
		if (!newDate) return
		setSelectedDate(newDate)

		const [hoursVal, minutesVal] = timeString.split(':').map((s) => parseInt(s, 10) || 0)
		const combined = dayjs(newDate).hour(hoursVal).minute(minutesVal).second(0).millisecond(0)
		onChange(combined.format('YYYY-MM-DDTHH:mm'))
	}

	const handleTimeChange = (newTime: string) => {
		setTimeString(newTime)
		if (!selectedDate) return

		const [hoursVal, minutesVal] = newTime.split(':').map((s) => parseInt(s, 10) || 0)
		const combined = dayjs(selectedDate).hour(hoursVal).minute(minutesVal).second(0).millisecond(0)
		onChange(combined.format('YYYY-MM-DDTHH:mm'))
	}

	const displayString = value ? dayjs(value).format('DD/MM/YYYY, HH:mm') : 'Select date & time'

	return (
		<div className={cn('relative', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-start border-terminal-border text-left font-mono font-normal"
					>
						<CalendarIcon className="mr-2 h-4 w-4 text-glow text-matrix" />
						<span className="grow select-none">{displayString}</span>
						<Clock className="h-4 w-4 text-slate-500" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="flex w-auto flex-col gap-3 border-terminal-border bg-terminal-card p-4"
					align="start"
				>
					<Calendar mode="single" selected={selectedDate} onSelect={handleSelectDate} />
					<div className="flex items-center gap-3 border-terminal-border border-t pt-3">
						<span className="mr-1 flex items-center gap-1.5 font-bold font-mono text-[10px] text-slate-500 uppercase">
							<Clock className="h-3.5 w-3.5" /> Time
						</span>
						<div className="flex items-center gap-1.5">
							<Select
								value={selectedHour}
								onValueChange={(h) => {
									const newTime = `${h}:${selectedMinute}`
									handleTimeChange(newTime)
								}}
							>
								<SelectTrigger className="h-8 w-14 border-terminal-border font-mono text-xs">
									<SelectValue placeholder="HH" />
								</SelectTrigger>
								<SelectContent className="max-h-48 border-terminal-border bg-terminal-card font-mono text-xs">
									{hours.map((h) => (
										<SelectItem key={h} value={h}>
											{h}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<span className="font-bold font-mono text-slate-500 text-xs">:</span>
							<Select
								value={selectedMinute}
								onValueChange={(m) => {
									const newTime = `${selectedHour}:${m}`
									handleTimeChange(newTime)
								}}
							>
								<SelectTrigger className="h-8 w-14 border-terminal-border font-mono text-xs">
									<SelectValue placeholder="MM" />
								</SelectTrigger>
								<SelectContent className="max-h-48 border-terminal-border bg-terminal-card font-mono text-xs">
									{minutes.map((m) => (
										<SelectItem key={m} value={m}>
											{m}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
