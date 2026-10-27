import { describe, expect, it } from 'vite-plus/test'

import { describeCronPart } from './utils'

describe('describeCronPart', () => {
	it('names day-of-week ranges and lists', () => {
		expect(describeCronPart('1-5', 'day of week')).toBe('Monday–Friday')
		expect(describeCronPart('MON,WED', 'day of week')).toBe('Specific days: Monday, Wednesday')
		expect(describeCronPart('0', 'day of week')).toBe('On Sunday')
		expect(describeCronPart('7', 'day of week')).toBe('On Sunday')
	})

	it('names months', () => {
		expect(describeCronPart('1-3', 'month')).toBe('January–March')
		expect(describeCronPart('12', 'month')).toBe('On December')
	})

	it('keeps numeric wording for other units', () => {
		expect(describeCronPart('1-5', 'hour')).toBe('From hour 1 to 5')
		expect(describeCronPart('*/15', 'minute')).toBe('Every 15 minutes')
		expect(describeCronPart('*', 'hour')).toBe('Every hour')
		expect(describeCronPart('30', 'minute')).toBe('At minute 30')
	})
})
