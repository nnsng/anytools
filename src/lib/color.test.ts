import { describe, expect, it } from 'vite-plus/test'

import { hexToRgb, toRgba } from './color'

describe('hexToRgb', () => {
	it('parses 3 and 6 digit hex with or without #', () => {
		expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
		expect(hexToRgb('00ff66')).toEqual({ r: 0, g: 255, b: 102 })
	})

	it('rejects invalid lengths', () => {
		expect(hexToRgb('#ffff')).toBeNull()
	})
})

describe('toRgba', () => {
	it('formats color and alpha', () => {
		expect(toRgba('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)')
		expect(toRgba('#fff', 1)).toBe('rgba(255, 255, 255, 1)')
	})

	it('clamps alpha and rounds to two decimals', () => {
		expect(toRgba('#000000', 2)).toBe('rgba(0, 0, 0, 1)')
		expect(toRgba('#000000', -1)).toBe('rgba(0, 0, 0, 0)')
		expect(toRgba('#000000', 0.12345)).toBe('rgba(0, 0, 0, 0.12)')
	})

	it('falls back to black for an invalid color', () => {
		expect(toRgba('nope', 0.3)).toBe('rgba(0, 0, 0, 0.3)')
	})
})
