export function hexToRgb(h: string): { r: number; g: number; b: number } | null {
	const cleanHex = h.replace('#', '').trim()
	if (cleanHex.length !== 3 && cleanHex.length !== 6) return null

	let r = 0,
		g = 0,
		b = 0
	if (cleanHex.length === 3) {
		r = parseInt(cleanHex[0] + cleanHex[0], 16)
		g = parseInt(cleanHex[1] + cleanHex[1], 16)
		b = parseInt(cleanHex[2] + cleanHex[2], 16)
	} else {
		r = parseInt(cleanHex.substring(0, 2), 16)
		g = parseInt(cleanHex.substring(2, 4), 16)
		b = parseInt(cleanHex.substring(4, 6), 16)
	}
	return { r, g, b }
}

export function rgbToHsl(r: number, g: number, b: number) {
	r /= 255
	g /= 255
	b /= 255
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h = 0,
		s = 0
	const l = (max + min) / 2

	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}
	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	}
}

export function rgbToCmyk(r: number, g: number, b: number) {
	r /= 255
	g /= 255
	b /= 255
	const k = 1 - Math.max(r, g, b)
	const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
	const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
	const y = k === 1 ? 0 : (1 - b - k) / (1 - k)
	return {
		c: Math.round(c * 100),
		m: Math.round(m * 100),
		y: Math.round(y * 100),
		k: Math.round(k * 100),
	}
}

export function rgbToHex(r: number, g: number, b: number): string {
	return (
		'#' +
		[r, g, b]
			.map((x) => {
				const h = x.toString(16)
				return h.length === 1 ? `0${h}` : h
			})
			.join('')
	)
}

export function parseRgb(str: string): { r: number; g: number; b: number } | null {
	const match = str.match(/\b(\d{1,3})\b/g)
	if (!match || match.length < 3) return null
	return {
		r: Math.min(255, parseInt(match[0], 10)),
		g: Math.min(255, parseInt(match[1], 10)),
		b: Math.min(255, parseInt(match[2], 10)),
	}
}

export function parseHsl(str: string): { h: number; s: number; l: number } | null {
	const match = str.match(/\b(\d{1,3})\b/g)
	if (!match || match.length < 3) return null
	return {
		h: Math.min(360, parseInt(match[0], 10)),
		s: Math.min(100, parseInt(match[1], 10)),
		l: Math.min(100, parseInt(match[2], 10)),
	}
}

export function parseCmyk(str: string): { c: number; m: number; y: number; k: number } | null {
	const match = str.match(/\b(\d{1,3})\b/g)
	if (!match || match.length < 4) return null
	return {
		c: Math.min(100, parseInt(match[0], 10)),
		m: Math.min(100, parseInt(match[1], 10)),
		y: Math.min(100, parseInt(match[2], 10)),
		k: Math.min(100, parseInt(match[3], 10)),
	}
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
	const hn = h / 360
	const sn = s / 100
	const ln = l / 100
	let r = ln,
		g = ln,
		b = ln

	if (sn !== 0) {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
			return p
		}
		const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
		const p = 2 * ln - q
		r = hue2rgb(p, q, hn + 1 / 3)
		g = hue2rgb(p, q, hn)
		b = hue2rgb(p, q, hn - 1 / 3)
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
	}
}

export function cmykToRgb(
	c: number,
	m: number,
	y: number,
	k: number,
): { r: number; g: number; b: number } {
	const cn = c / 100,
		mn = m / 100,
		yn = y / 100,
		kn = k / 100
	return {
		r: Math.round(255 * (1 - cn) * (1 - kn)),
		g: Math.round(255 * (1 - mn) * (1 - kn)),
		b: Math.round(255 * (1 - yn) * (1 - kn)),
	}
}
