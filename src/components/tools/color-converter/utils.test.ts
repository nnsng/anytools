import { describe, expect, it } from 'vite-plus/test'

import { hexToRgb } from '@/lib/color'

import { parseCmyk, parseRgb, rgbToHex } from './utils'

describe('color utils', () => {
	it('parses 3 and 6 digit hex', () => {
		expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
		expect(hexToRgb('00ff66')).toEqual({ r: 0, g: 255, b: 102 })
	})

	it('rejects invalid hex lengths', () => {
		expect(hexToRgb('#ffff')).toBeNull()
	})

	it('round-trips rgb and hex', () => {
		const rgb = hexToRgb('#1a2b3c')
		expect(rgb && rgbToHex(rgb.r, rgb.g, rgb.b).toLowerCase()).toBe('#1a2b3c')
	})

	it('parses rgb and cmyk strings and clamps values', () => {
		expect(parseRgb('rgb(300, 20, 5)')).toEqual({ r: 255, g: 20, b: 5 })
		expect(parseRgb('1, 2')).toBeNull()
		expect(parseCmyk('cmyk(10%, 20%, 30%, 40%)')).toEqual({ c: 10, m: 20, y: 30, k: 40 })
	})
})
