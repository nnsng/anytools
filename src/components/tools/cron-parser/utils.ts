export function describeCronPart(part: string, unit: string): string {
	if (part === '*') return `Every ${unit}`
	if (part.startsWith('*/')) {
		const step = part.split('/')[1]
		return `Every ${step} ${unit}s`
	}
	if (part.includes(',')) {
		return `Specific ${unit}s: ${part.split(',').join(', ')}`
	}
	if (part.includes('-')) {
		const [start, end] = part.split('-')
		return `From ${unit} ${start} to ${end}`
	}
	return `At ${unit} ${part}`
}
