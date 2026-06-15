import dayjs from 'dayjs'
import { CalendarIcon, Clock } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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

	const [selectedHour, selectedMinute] = React.useMemo(() => {
		const parts = timeString.split(':')
		const hh = parts[0]?.padStart(2, '0') || '12'
		const mm = parts[1]?.padStart(2, '0') || '00'
		return [hh, mm]
	}, [timeString])

	const [hourVal, setHourVal] = React.useState(selectedHour)
	const [minuteVal, setMinuteVal] = React.useState(selectedMinute)

	React.useEffect(() => {
		setHourVal(selectedHour)
		setMinuteVal(selectedMinute)
	}, [selectedHour, selectedMinute])

	const hourInputRef = React.useRef<HTMLInputElement>(null)
	const minuteInputRef = React.useRef<HTMLInputElement>(null)

	const handleSelectDate = (newDate: Date | undefined) => {
		if (!newDate) return
		setSelectedDate(newDate)

		const [hoursVal, minutesVal] = timeString.split(':').map((s) => parseInt(s, 10) || 0)
		const combined = dayjs(newDate).hour(hoursVal).minute(minutesVal).second(0).millisecond(0)
		onChange(combined.format('YYYY-MM-DDTHH:mm'))
	}

	const handleHourChange = (v: string) => {
		const cleaned = v.replace(/\D/g, '')
		if (cleaned === '') {
			setHourVal('')
			return
		}
		const num = parseInt(cleaned, 10)
		if (num >= 0 && num <= 23) {
			setHourVal(cleaned)
			const newHour = cleaned.padStart(2, '0')
			const currentMin = minuteVal.padStart(2, '0') || '00'
			const combined = dayjs(selectedDate)
				.hour(parseInt(newHour, 10))
				.minute(parseInt(currentMin, 10))
				.second(0)
				.millisecond(0)
			onChange(combined.format('YYYY-MM-DDTHH:mm'))
			if (cleaned.length === 2) {
				minuteInputRef.current?.focus()
				minuteInputRef.current?.select()
			}
		}
	}

	const handleHourBlur = () => {
		const num = parseInt(hourVal, 10)
		const formatted = (Number.isNaN(num) ? 12 : num).toString().padStart(2, '0')
		setHourVal(formatted)
		const currentMin = minuteVal.padStart(2, '0') || '00'
		const combined = dayjs(selectedDate)
			.hour(parseInt(formatted, 10))
			.minute(parseInt(currentMin, 10))
			.second(0)
			.millisecond(0)
		onChange(combined.format('YYYY-MM-DDTHH:mm'))
	}

	const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault()
			const current = parseInt(hourVal, 10) || 0
			const next = (current + 1) % 24
			const formatted = next.toString().padStart(2, '0')
			setHourVal(formatted)
			const currentMin = minuteVal.padStart(2, '0') || '00'
			const combined = dayjs(selectedDate)
				.hour(next)
				.minute(parseInt(currentMin, 10))
				.second(0)
				.millisecond(0)
			onChange(combined.format('YYYY-MM-DDTHH:mm'))
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			const current = parseInt(hourVal, 10) || 0
			const next = (current - 1 + 24) % 24
			const formatted = next.toString().padStart(2, '0')
			setHourVal(formatted)
			const currentMin = minuteVal.padStart(2, '0') || '00'
			const combined = dayjs(selectedDate)
				.hour(next)
				.minute(parseInt(currentMin, 10))
				.second(0)
				.millisecond(0)
			onChange(combined.format('YYYY-MM-DDTHH:mm'))
		}
	}

	const handleMinuteChange = (v: string) => {
		const cleaned = v.replace(/\D/g, '')
		if (cleaned === '') {
			setMinuteVal('')
			return
		}
		const num = parseInt(cleaned, 10)
		if (num >= 0 && num <= 59) {
			setMinuteVal(cleaned)
			const currentHour = hourVal.padStart(2, '0') || '12'
			const newMin = cleaned.padStart(2, '0')
			const combined = dayjs(selectedDate)
				.hour(parseInt(currentHour, 10))
				.minute(parseInt(newMin, 10))
				.second(0)
				.millisecond(0)
			onChange(combined.format('YYYY-MM-DDTHH:mm'))
		}
	}

	const handleMinuteBlur = () => {
		const num = parseInt(minuteVal, 10)
		const formatted = (Number.isNaN(num) ? 0 : num).toString().padStart(2, '0')
		setMinuteVal(formatted)
		const currentHour = hourVal.padStart(2, '0') || '12'
		const combined = dayjs(selectedDate)
			.hour(parseInt(currentHour, 10))
			.minute(parseInt(formatted, 10))
			.second(0)
			.millisecond(0)
		onChange(combined.format('YYYY-MM-DDTHH:mm'))
	}

	const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault()
			const current = parseInt(minuteVal, 10) || 0
			const next = (current + 1) % 60
			const formatted = next.toString().padStart(2, '0')
			setMinuteVal(formatted)
			const currentHour = hourVal.padStart(2, '0') || '12'
			const combined = dayjs(selectedDate)
				.hour(parseInt(currentHour, 10))
				.minute(next)
				.second(0)
				.millisecond(0)
			onChange(combined.format('YYYY-MM-DDTHH:mm'))
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			const current = parseInt(minuteVal, 10) || 0
			const next = (current - 1 + 60) % 60
			const formatted = next.toString().padStart(2, '0')
			setMinuteVal(formatted)
			const currentHour = hourVal.padStart(2, '0') || '12'
			const combined = dayjs(selectedDate)
				.hour(parseInt(currentHour, 10))
				.minute(next)
				.second(0)
				.millisecond(0)
			onChange(combined.format('YYYY-MM-DDTHH:mm'))
		} else if (
			e.key === 'Backspace' &&
			(minuteVal === '' || e.currentTarget.selectionStart === 0)
		) {
			e.preventDefault()
			hourInputRef.current?.focus()
			hourInputRef.current?.select()
		}
	}

	const displayString = value ? dayjs(value).format('DD/MM/YYYY, HH:mm') : 'Select date & time'

	return (
		<div className={cn('relative', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-start border-terminal-border text-left font-mono font-normal text-foreground"
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
							<input
								ref={hourInputRef}
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								maxLength={2}
								value={hourVal}
								onChange={(e) => handleHourChange(e.target.value)}
								onBlur={handleHourBlur}
								onKeyDown={handleHourKeyDown}
								className="h-8 w-14 rounded border border-terminal-border bg-terminal-bg text-center font-mono text-foreground text-xs transition-colors placeholder:text-slate-600 focus:border-matrix/80 focus:outline-none"
								placeholder="HH"
							/>
							<span className="font-bold font-mono text-slate-500 text-xs">:</span>
							<input
								ref={minuteInputRef}
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								maxLength={2}
								value={minuteVal}
								onChange={(e) => handleMinuteChange(e.target.value)}
								onBlur={handleMinuteBlur}
								onKeyDown={handleMinuteKeyDown}
								className="h-8 w-14 rounded border border-terminal-border bg-terminal-bg text-center font-mono text-foreground text-xs transition-colors placeholder:text-slate-600 focus:border-matrix/80 focus:outline-none"
								placeholder="MM"
							/>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
