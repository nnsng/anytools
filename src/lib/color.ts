export function hexToRgb(h: string): { r: number; g: number; b: number } | null {
	const cleanHex = h.replace('#', '').trim()
	if (cleanHex.length !== 3 && cleanHex.length !== 6) return null

	let r = 0,
		g = 0,
		b = 0
	if (cleanHex.length === 3) {
		r = parseInt(cleanHex.charAt(0).repeat(2), 16)
		g = parseInt(cleanHex.charAt(1).repeat(2), 16)
		b = parseInt(cleanHex.charAt(2).repeat(2), 16)
	} else {
		r = parseInt(cleanHex.substring(0, 2), 16)
		g = parseInt(cleanHex.substring(2, 4), 16)
		b = parseInt(cleanHex.substring(4, 6), 16)
	}
	return { r, g, b }
}

/** Formats a hex color and an alpha (0-1) as `rgba(r, g, b, a)`. Invalid hex falls back to black. */
export function toRgba(hex: string, alpha: number): string {
	const { r, g, b } = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 }
	const clamped = Math.min(1, Math.max(0, alpha))
	return `rgba(${r}, ${g}, ${b}, ${Math.round(clamped * 100) / 100})`
}
