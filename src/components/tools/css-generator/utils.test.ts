import { describe, expect, it } from 'vite-plus/test'

import type { GradientConfig, ShadowLayer } from './types'
import {
	boxShadowValue,
	buildBoxShadow,
	buildClamp,
	buildGradient,
	formatNumber,
	gradientValue,
	pxToRem,
	remToPx,
} from './utils'

const layer = (overrides: Partial<ShadowLayer> = {}): ShadowLayer => ({
	id: 'a',
	x: 0,
	y: 4,
	blur: 12,
	spread: 0,
	color: { hex: '#000000', alpha: 0.25 },
	inset: false,
	...overrides,
})

const gradient = (overrides: Partial<GradientConfig> = {}): GradientConfig => ({
	type: 'linear',
	angle: 90,
	radialShape: 'circle',
	stops: [
		{ id: 'a', color: { hex: '#ff0000', alpha: 1 }, position: 0 },
		{ id: 'b', color: { hex: '#0000ff', alpha: 0.5 }, position: 100 },
	],
	...overrides,
})

describe('formatNumber', () => {
	it('trims trailing zeros and negative zero', () => {
		expect(formatNumber(1.5)).toBe('1.5')
		expect(formatNumber(2)).toBe('2')
		expect(formatNumber(0.12345)).toBe('0.12')
		expect(formatNumber(-0.001)).toBe('0')
		expect(formatNumber(1 / 3, 4)).toBe('0.3333')
	})
})

describe('box shadow', () => {
	it('formats a single layer on one line with 0 unitless', () => {
		expect(buildBoxShadow([layer()])).toBe('box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.25);')
	})

	it('puts each of several layers on its own line', () => {
		const css = buildBoxShadow([layer(), layer({ inset: true, x: 2, y: -2, spread: 1 })])
		expect(css).toBe(
			'box-shadow:\n  0 4px 12px 0 rgba(0, 0, 0, 0.25),\n  inset 2px -2px 12px 1px rgba(0, 0, 0, 0.25);',
		)
	})

	it('uses none when there are no layers', () => {
		expect(boxShadowValue([])).toBe('none')
		expect(buildBoxShadow([])).toBe('box-shadow: none;')
	})
})

describe('gradient', () => {
	it('builds a linear gradient with rgba stops', () => {
		expect(buildGradient(gradient())).toBe(
			'background: linear-gradient(90deg, rgba(255, 0, 0, 1) 0%, rgba(0, 0, 255, 0.5) 100%);',
		)
	})

	it('builds radial and conic gradients', () => {
		expect(gradientValue(gradient({ type: 'radial', radialShape: 'ellipse' }))).toMatch(
			/^radial-gradient\(ellipse, /,
		)
		expect(gradientValue(gradient({ type: 'conic', angle: 45 }))).toMatch(
			/^conic-gradient\(from 45deg, /,
		)
	})

	it('sorts stops by position without mutating the config', () => {
		const config = gradient()
		const reversed = { ...config, stops: [...config.stops].reverse() }
		expect(gradientValue(reversed)).toBe(gradientValue(config))
		expect(reversed.stops[0]?.id).toBe('b')
	})

	it('falls back for fewer than two stops', () => {
		expect(gradientValue(gradient({ stops: [] }))).toBe('none')
		expect(gradientValue(gradient({ stops: [gradient().stops[0]!] }))).toBe('rgba(255, 0, 0, 1)')
	})
})

describe('units', () => {
	it('converts between px and rem for any root size', () => {
		expect(pxToRem(24, 16)).toBe(1.5)
		expect(remToPx(1.5, 16)).toBe(24)
		expect(pxToRem(20, 10)).toBe(2)
	})
})

describe('buildClamp', () => {
	it('computes slope and intercept for growing sizes', () => {
		const result = buildClamp({
			minSize: 16,
			maxSize: 32,
			minViewport: 320,
			maxViewport: 1280,
			rootFontSize: 16,
		})
		// slope = 16 / 960 * 100 vw, intercept = 16 - slope/100 * 320
		expect(result.slopePerVw).toBeCloseTo(1.6667, 3)
		expect(result.interceptPx).toBeCloseTo(10.6667, 3)
		expect(result.value).toBe('clamp(1rem, 0.6667rem + 1.6667vw, 2rem)')
	})

	it('swaps bounds and uses a minus sign when the size shrinks', () => {
		const result = buildClamp({
			minSize: 32,
			maxSize: 16,
			minViewport: 320,
			maxViewport: 1280,
			rootFontSize: 16,
		})
		expect(result.slopePerVw).toBeLessThan(0)
		expect(result.value).toBe('clamp(1rem, 2.3333rem - 1.6667vw, 2rem)')
	})

	it('drops the intercept when it is zero', () => {
		const result = buildClamp({
			minSize: 0,
			maxSize: 16,
			minViewport: 0,
			maxViewport: 1600,
			rootFontSize: 16,
		})
		expect(result.value).toBe('clamp(0rem, 1vw, 1rem)')
	})

	it('rejects invalid viewport ranges and root sizes', () => {
		const base = { minSize: 1, maxSize: 2, minViewport: 300, maxViewport: 300, rootFontSize: 16 }
		expect(() => buildClamp(base)).toThrow('Max viewport width')
		expect(() => buildClamp({ ...base, maxViewport: 600, rootFontSize: 0 })).toThrow(
			'Root font size',
		)
	})
})
