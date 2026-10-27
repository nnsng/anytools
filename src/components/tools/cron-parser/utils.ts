const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

const DAY_ABBREVIATIONS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTH_ABBREVIATIONS = MONTH_NAMES.map((name) => name.slice(0, 3).toUpperCase())

/** Turns a cron value (number or 3-letter name) into a readable name for day-of-week and month. */
function toLabel(value: string, unit: string): string {
	const upper = value.toUpperCase()
	if (unit === 'day of week') {
		const index = DAY_ABBREVIATIONS.indexOf(upper)
		const day = index !== -1 ? index : Number(value)
		// Cron accepts 7 as Sunday
		return DAY_NAMES[day === 7 ? 0 : day] ?? value
	}
	if (unit === 'month') {
		const index = MONTH_ABBREVIATIONS.indexOf(upper)
		return MONTH_NAMES[index !== -1 ? index : Number(value) - 1] ?? value
	}
	return value
}

const hasNames = (unit: string) => unit === 'day of week' || unit === 'month'

export function describeCronPart(part: string, unit: string): string {
	if (part === '*') return `Every ${unit}`
	if (part.startsWith('*/')) {
		const step = part.split('/')[1]
		return `Every ${step} ${unit}s`
	}
	if (part.includes(',')) {
		const values = part.split(',').map((value) => toLabel(value, unit))
		const plural = unit === 'day of week' ? 'days' : `${unit}s`
		return `Specific ${plural}: ${values.join(', ')}`
	}
	if (part.includes('-')) {
		const [start = '', end = ''] = part.split('-')
		return hasNames(unit)
			? `${toLabel(start, unit)}–${toLabel(end, unit)}`
			: `From ${unit} ${start} to ${end}`
	}
	return hasNames(unit) ? `On ${toLabel(part, unit)}` : `At ${unit} ${part}`
}
