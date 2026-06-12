import dayjs from 'dayjs'
import { CalendarIcon, Clock } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type DateTimePickerProps = {
	value: string
	onChange: (value: string) => void
	className?: string
}

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

	const handleSelectDate = (newDate: Date | undefined) => {
		if (!newDate) return
		setSelectedDate(newDate)

		const [hours, minutes] = timeString.split(':').map((s) => parseInt(s, 10) || 0)
		const combined = dayjs(newDate).hour(hours).minute(minutes).second(0).millisecond(0)
		onChange(combined.format('YYYY-MM-DDTHH:mm'))
	}

	const handleTimeChange = (newTime: string) => {
		setTimeString(newTime)
		if (!selectedDate) return

		const [hours, minutes] = newTime.split(':').map((s) => parseInt(s, 10) || 0)
		const combined = dayjs(selectedDate).hour(hours).minute(minutes).second(0).millisecond(0)
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
						<span className="flex items-center gap-1.5 font-bold font-mono text-[10px] text-slate-500 uppercase">
							<Clock className="h-3.5 w-3.5" /> Time
						</span>
						<Input
							type="time"
							value={timeString}
							onChange={(e) => handleTimeChange(e.target.value)}
							className="h-8 max-w-30 border-terminal-border font-mono text-xs"
						/>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
