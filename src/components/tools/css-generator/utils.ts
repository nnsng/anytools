import { toRgba } from '@/lib/color'

import type { AlphaColor, ClampConfig, ClampResult, GradientConfig, ShadowLayer } from './types'

let nextId = 0
export const createId = () => `item-${nextId++}`

/** Rounds to `digits` decimals and drops trailing zeros (and a negative zero). */
export function formatNumber(value: number, digits = 2): string {
	const rounded = Number(value.toFixed(digits))
	return String(Object.is(rounded, -0) ? 0 : rounded)
}

const formatPx = (value: number) => (value === 0 ? '0' : `${formatNumber(value)}px`)
const formatColor = (color: AlphaColor) => toRgba(color.hex, color.alpha)

function formatLayer(layer: ShadowLayer): string {
	const parts = [layer.x, layer.y, layer.blur, layer.spread].map(formatPx)
	return `${layer.inset ? 'inset ' : ''}${parts.join(' ')} ${formatColor(layer.color)}`
}

/** The value of `box-shadow`, on one line (used for the live preview). */
export function boxShadowValue(layers: ShadowLayer[]): string {
	return layers.length > 0 ? layers.map(formatLayer).join(', ') : 'none'
}

/** A copy-ready `box-shadow` declaration; one layer per line when there are several. */
export function buildBoxShadow(layers: ShadowLayer[]): string {
	if (layers.length <= 1) return `box-shadow: ${boxShadowValue(layers)};`
	return `box-shadow:\n${layers.map((layer) => `  ${formatLayer(layer)}`).join(',\n')};`
}

/** The value of `background` for a gradient (used for the live preview). */
export function gradientValue(config: GradientConfig): string {
	const stops = [...config.stops].sort((a, b) => a.position - b.position)
	if (stops.length === 0) return 'none'
	if (stops.length === 1) return formatColor(stops[0]?.color ?? { hex: '#000000', alpha: 1 })

	const stopList = stops
		.map((stop) => `${formatColor(stop.color)} ${formatNumber(stop.position)}%`)
		.join(', ')
	const angle = formatNumber(config.angle)

	if (config.type === 'radial') return `radial-gradient(${config.radialShape}, ${stopList})`
	if (config.type === 'conic') return `conic-gradient(from ${angle}deg, ${stopList})`
	return `linear-gradient(${angle}deg, ${stopList})`
}

export const buildGradient = (config: GradientConfig) => `background: ${gradientValue(config)};`

export function pxToRem(px: number, rootFontSize: number): number {
	return px / rootFontSize
}

export function remToPx(rem: number, rootFontSize: number): number {
	return rem * rootFontSize
}

/**
 * Builds a fluid `clamp()` that grows linearly from `minSize` at `minViewport` to `maxSize`
 * at `maxViewport` (all in px) and is expressed in rem + vw.
 */
export function buildClamp(config: ClampConfig): ClampResult {
	const { minSize, maxSize, minViewport, maxViewport, rootFontSize } = config
	if (rootFontSize <= 0) throw new Error('Root font size must be greater than 0')
	if (maxViewport <= minViewport) {
		throw new Error('Max viewport width must be larger than min viewport width')
	}

	const slopePerVw = ((maxSize - minSize) / (maxViewport - minViewport)) * 100
	const interceptPx = minSize - (slopePerVw / 100) * minViewport

	const toRem = (px: number) => formatNumber(pxToRem(px, rootFontSize), 4)
	const slope = formatNumber(slopePerVw, 4)
	const preferred =
		interceptPx === 0
			? `${slope}vw`
			: `${toRem(interceptPx)}rem ${slopePerVw < 0 ? '-' : '+'} ${formatNumber(Math.abs(slopePerVw), 4)}vw`

	// clamp(MIN, VAL, MAX) needs MIN <= MAX, so a shrinking size swaps the bounds
	const lower = toRem(Math.min(minSize, maxSize))
	const upper = toRem(Math.max(minSize, maxSize))

	return { value: `clamp(${lower}rem, ${preferred}, ${upper}rem)`, slopePerVw, interceptPx }
}
