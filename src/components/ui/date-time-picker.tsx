import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import type * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type DateTimePickerProps = {
	value?: string
	onChange?: (value: string) => void
	disabled?: boolean
	className?: string
}

export function DateTimePicker({ value, onChange, disabled, className }: DateTimePickerProps) {
	const date = value ? new Date(value) : undefined

	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (selectedDate && onChange) {
			if (date) {
				// Preserve existing time
				selectedDate.setHours(date.getHours())
				selectedDate.setMinutes(date.getMinutes())
				selectedDate.setSeconds(date.getSeconds())
			} else {
				// Default to midnight
				selectedDate.setHours(0, 0, 0, 0)
			}
			// Pass formatted string compatible with native Date parsing
			onChange(format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss"))
		} else if (!selectedDate && onChange) {
			onChange('')
		}
	}

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const timeValue = e.target.value
		if (onChange) {
			const [hours, minutes, seconds] = timeValue.split(':').map(Number)
			const newDate = date ? new Date(date) : new Date()
			newDate.setHours(hours || 0)
			newDate.setMinutes(minutes || 0)
			newDate.setSeconds(seconds || 0)
			onChange(format(newDate, "yyyy-MM-dd'T'HH:mm:ss"))
		}
	}

	return (
		<div className={cn('flex flex-wrap items-center gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'flex-1 justify-start text-left font-normal',
							!date && 'text-muted-foreground',
						)}
						disabled={disabled}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date && !Number.isNaN(date.getTime()) ? format(date, 'PPP') : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={date && !Number.isNaN(date.getTime()) ? date : undefined}
						onSelect={handleDateSelect}
					/>
				</PopoverContent>
			</Popover>

			<div className="relative shrink-0">
				<Clock className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
				<Input
					type="time"
					step="1"
					disabled={disabled || !date || Number.isNaN(date.getTime())}
					className="block w-32.5 appearance-none bg-background pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
					value={date && !Number.isNaN(date.getTime()) ? format(date, 'HH:mm:ss') : ''}
					onChange={handleTimeChange}
				/>
			</div>
		</div>
	)
}
