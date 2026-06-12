import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ColorConverter() {
	const [hex, setHex] = useState<string>('#22c55e')
	const [rgb, setRgb] = useState<string>('rgb(34, 197, 94)')
	const [hsl, setHsl] = useState<string>('hsl(142, 71%, 45%)')
	const [cmyk, setCmyk] = useState<string>('cmyk(83%, 0%, 52%, 23%)')
	const [copiedField, setCopiedField] = useState<string | null>(null)

	// Math conversions
	const hexToRgb = (h: string): { r: number; g: number; b: number } | null => {
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

	const rgbToHsl = (r: number, g: number, b: number) => {
		r /= 255
		g /= 255
		b /= 255
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b)
		let h = 0,
			s = 0,
			l = (max + min) / 2

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

	const rgbToCmyk = (r: number, g: number, b: number) => {
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

	// Parse color string inputs
	const parseRgb = (
		str: string,
	): { r: number; g: number; b: number } | null => {
		const match = str.match(/\b(\d{1,3})\b/g)
		if (!match || match.length < 3) return null
		const r = Math.min(255, parseInt(match[0], 10))
		const g = Math.min(255, parseInt(match[1], 10))
		const b = Math.min(255, parseInt(match[2], 10))
		return { r, g, b }
	}

	const parseHsl = (
		str: string,
	): { h: number; s: number; l: number } | null => {
		const match = str.match(/\b(\d{1,3})\b/g)
		if (!match || match.length < 3) return null
		const h = Math.min(360, parseInt(match[0], 10))
		const s = Math.min(100, parseInt(match[1], 10))
		const l = Math.min(100, parseInt(match[2], 10))
		return { h, s, l }
	}

	const parseCmyk = (
		str: string,
	): { c: number; m: number; y: number; k: number } | null => {
		const match = str.match(/\b(\d{1,3})\b/g)
		if (!match || match.length < 4) return null
		return {
			c: Math.min(100, parseInt(match[0], 10)),
			m: Math.min(100, parseInt(match[1], 10)),
			y: Math.min(100, parseInt(match[2], 10)),
			k: Math.min(100, parseInt(match[3], 10)),
		}
	}

	// Triggered when color picker or hex changes
	const updateAllFromRgb = (r: number, g: number, b: number) => {
		const toHex =
			'#' +
			[r, g, b]
				.map((x) => {
					const hexVal = x.toString(16)
					return hexVal.length === 1 ? `0${hexVal}` : hexVal
				})
				.join('')

		const hslVal = rgbToHsl(r, g, b)
		const cmykVal = rgbToCmyk(r, g, b)

		setHex(toHex)
		setRgb(`rgb(${r}, ${g}, ${b})`)
		setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`)
		setCmyk(`cmyk(${cmykVal.c}%, ${cmykVal.m}%, ${cmykVal.y}%, ${cmykVal.k}%)`)
	}

	const handleHexChange = (val: string) => {
		setHex(val)
		if (/^#?[0-9A-Fa-f]{3}$|^#?[0-9A-Fa-f]{6}$/.test(val)) {
			const rgbVal = hexToRgb(val)
			if (rgbVal) {
				updateAllFromRgb(rgbVal.r, rgbVal.g, rgbVal.b)
			}
		}
	}

	const handleRgbChange = (val: string) => {
		setRgb(val)
		const rgbVal = parseRgb(val)
		if (rgbVal) {
			updateAllFromRgb(rgbVal.r, rgbVal.g, rgbVal.b)
		}
	}

	const handleHslChange = (val: string) => {
		setHsl(val)
		const hslVal = parseHsl(val)
		if (hslVal) {
			// HSL to RGB conversion
			let { h, s, l } = hslVal
			h /= 360
			s /= 100
			l /= 100
			let r = l,
				g = l,
				b = l
			if (s !== 0) {
				const hue2rgb = (p: number, q: number, t: number) => {
					if (t < 0) t += 1
					if (t > 1) t -= 1
					if (t < 1 / 6) return p + (q - p) * 6 * t
					if (t < 1 / 2) return q
					if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
					return p
				}
				const q = l < 0.5 ? l * (1 + s) : l + s - l * s
				const p = 2 * l - q
				r = hue2rgb(p, q, h + 1 / 3)
				g = hue2rgb(p, q, h)
				b = hue2rgb(p, q, h - 1 / 3)
			}
			updateAllFromRgb(
				Math.round(r * 255),
				Math.round(g * 255),
				Math.round(b * 255),
			)
		}
	}

	const handleCmykChange = (val: string) => {
		setCmyk(val)
		const cmykVal = parseCmyk(val)
		if (cmykVal) {
			const c = cmykVal.c / 100
			const m = cmykVal.m / 100
			const y = cmykVal.y / 100
			const k = cmykVal.k / 100
			const r = Math.round(255 * (1 - c) * (1 - k))
			const g = Math.round(255 * (1 - m) * (1 - k))
			const b = Math.round(255 * (1 - y) * (1 - k))
			updateAllFromRgb(r, g, b)
		}
	}

	const handleCopy = async (field: string, text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedField(field)
			setTimeout(() => setCopiedField(null), 2000)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className="grid grid-cols-1 gap-6 font-mono lg:grid-cols-12">
			{/* Color Preview Block */}
			<div className="flex min-h-[300px] flex-col items-center justify-between gap-6 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-4">
				<span className="flex items-center gap-2 self-start font-bold text-slate-300 text-xs uppercase tracking-wider">
					<span className="h-1.5 w-1.5 rounded-full bg-matrix" />
					Color Canvas
				</span>

				<div
					className="h-32 w-32 rounded border border-terminal-border shadow-[0_0_20px_rgba(0,0,0,0.4)]"
					style={{ backgroundColor: hex }}
				/>

				<div className="w-full">
					<label className="mb-1 block text-center font-bold text-[10px] text-slate-500 uppercase">
						Pick Color
					</label>
					<div className="relative h-10 w-full cursor-pointer overflow-hidden rounded border border-terminal-border bg-terminal-bg/50 transition-colors hover:border-matrix/40">
						<input
							type="color"
							value={hex}
							onChange={(e) => {
								const rgbVal = hexToRgb(e.target.value)
								if (rgbVal) updateAllFromRgb(rgbVal.r, rgbVal.g, rgbVal.b)
							}}
							className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
						/>
						<div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-bold text-slate-400 text-xs">
							LAUNCH COLOR PICKER
						</div>
					</div>
				</div>
			</div>

			{/* Conversion Fields */}
			<div className="flex flex-col justify-between space-y-6 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-8">
				<span className="flex items-center gap-2 font-bold text-slate-300 text-xs uppercase tracking-wider">
					<span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
					Color Format Translations
				</span>

				<div className="space-y-4">
					{/* HEX */}
					<div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12">
						<label className="font-bold text-slate-400 text-xs md:col-span-2">
							HEX
						</label>
						<div className="md:col-span-8">
							<Input
								value={hex}
								onChange={(e) => handleHexChange(e.target.value)}
								placeholder="#000000"
							/>
						</div>
						<div className="md:col-span-2">
							<Button
								variant="outline"
								size="sm"
								className="flex w-full items-center gap-1.5 py-2 text-xs"
								onClick={() => handleCopy('hex', hex)}
							>
								{copiedField === 'hex' ? (
									<Check className="h-3.5 w-3.5 text-matrix" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
								{copiedField === 'hex' ? 'COPIED' : 'COPY'}
							</Button>
						</div>
					</div>

					{/* RGB */}
					<div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12">
						<label className="font-bold text-slate-400 text-xs md:col-span-2">
							RGB
						</label>
						<div className="md:col-span-8">
							<Input
								value={rgb}
								onChange={(e) => handleRgbChange(e.target.value)}
								placeholder="rgb(0,0,0)"
							/>
						</div>
						<div className="md:col-span-2">
							<Button
								variant="outline"
								size="sm"
								className="flex w-full items-center gap-1.5 py-2 text-xs"
								onClick={() => handleCopy('rgb', rgb)}
							>
								{copiedField === 'rgb' ? (
									<Check className="h-3.5 w-3.5 text-matrix" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
								{copiedField === 'rgb' ? 'COPIED' : 'COPY'}
							</Button>
						</div>
					</div>

					{/* HSL */}
					<div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12">
						<label className="font-bold text-slate-400 text-xs md:col-span-2">
							HSL
						</label>
						<div className="md:col-span-8">
							<Input
								value={hsl}
								onChange={(e) => handleHslChange(e.target.value)}
								placeholder="hsl(0, 0%, 0%)"
							/>
						</div>
						<div className="md:col-span-2">
							<Button
								variant="outline"
								size="sm"
								className="flex w-full items-center gap-1.5 py-2 text-xs"
								onClick={() => handleCopy('hsl', hsl)}
							>
								{copiedField === 'hsl' ? (
									<Check className="h-3.5 w-3.5 text-matrix" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
								{copiedField === 'hsl' ? 'COPIED' : 'COPY'}
							</Button>
						</div>
					</div>

					{/* CMYK */}
					<div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12">
						<label className="font-bold text-slate-400 text-xs md:col-span-2">
							CMYK
						</label>
						<div className="md:col-span-8">
							<Input
								value={cmyk}
								onChange={(e) => handleCmykChange(e.target.value)}
								placeholder="cmyk(0%, 0%, 0%, 100%)"
							/>
						</div>
						<div className="md:col-span-2">
							<Button
								variant="outline"
								size="sm"
								className="flex w-full items-center gap-1.5 py-2 text-xs"
								onClick={() => handleCopy('cmyk', cmyk)}
							>
								{copiedField === 'cmyk' ? (
									<Check className="h-3.5 w-3.5 text-matrix" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}
								{copiedField === 'cmyk' ? 'COPIED' : 'COPY'}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
