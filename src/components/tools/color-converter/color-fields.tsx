import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cmykToRgb, hexToRgb, hslToRgb, parseCmyk, parseHsl, parseRgb } from './color-utils'

type ColorFieldsProps = {
	hex: string
	rgb: string
	hsl: string
	cmyk: string
	setHex: (val: string) => void
	setRgb: (val: string) => void
	setHsl: (val: string) => void
	setCmyk: (val: string) => void
	updateAllFromRgb: (r: number, g: number, b: number) => void
}

export function ColorFields({
	hex,
	rgb,
	hsl,
	cmyk,
	setHex,
	setRgb,
	setHsl,
	setCmyk,
	updateAllFromRgb,
}: ColorFieldsProps) {
	const [copiedField, setCopiedField] = useState<string | null>(null)

	const handleHexChange = (val: string) => {
		setHex(val)
		if (/^#?[0-9A-Fa-f]{3}$|^#?[0-9A-Fa-f]{6}$/.test(val)) {
			const rgbVal = hexToRgb(val)
			if (rgbVal) updateAllFromRgb(rgbVal.r, rgbVal.g, rgbVal.b)
		}
	}

	const handleRgbChange = (val: string) => {
		setRgb(val)
		const rgbVal = parseRgb(val)
		if (rgbVal) updateAllFromRgb(rgbVal.r, rgbVal.g, rgbVal.b)
	}

	const handleHslChange = (val: string) => {
		setHsl(val)
		const hslVal = parseHsl(val)
		if (hslVal) {
			const { r, g, b } = hslToRgb(hslVal.h, hslVal.s, hslVal.l)
			updateAllFromRgb(r, g, b)
		}
	}

	const handleCmykChange = (val: string) => {
		setCmyk(val)
		const cmykVal = parseCmyk(val)
		if (cmykVal) {
			const { r, g, b } = cmykToRgb(cmykVal.c, cmykVal.m, cmykVal.y, cmykVal.k)
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
		<div className="flex flex-col gap-6 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-8">
			<span className="flex items-center gap-2 font-bold text-slate-300 text-xs uppercase tracking-wider">
				<span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
				Color Format Translations
			</span>

			<div className="space-y-4">
				{/* HEX */}
				<div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12">
					<label htmlFor="input-hex" className="font-bold text-slate-400 text-xs md:col-span-2">
						HEX
					</label>
					<div className="md:col-span-8">
						<Input
							id="input-hex"
							value={hex}
							onChange={(e) => handleHexChange(e.target.value)}
							placeholder="#000000"
						/>
					</div>
					<div className="md:col-span-2">
						<Button
							variant="outline"
							className="flex w-full items-center justify-center gap-1.5 text-xs"
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
					<label htmlFor="input-rgb" className="font-bold text-slate-400 text-xs md:col-span-2">
						RGB
					</label>
					<div className="md:col-span-8">
						<Input
							id="input-rgb"
							value={rgb}
							onChange={(e) => handleRgbChange(e.target.value)}
							placeholder="rgb(0,0,0)"
						/>
					</div>
					<div className="md:col-span-2">
						<Button
							variant="outline"
							className="flex w-full items-center justify-center gap-1.5 text-xs"
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
					<label htmlFor="input-hsl" className="font-bold text-slate-400 text-xs md:col-span-2">
						HSL
					</label>
					<div className="md:col-span-8">
						<Input
							id="input-hsl"
							value={hsl}
							onChange={(e) => handleHslChange(e.target.value)}
							placeholder="hsl(0, 0%, 0%)"
						/>
					</div>
					<div className="md:col-span-2">
						<Button
							variant="outline"
							className="flex w-full items-center justify-center gap-1.5 text-xs"
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
					<label htmlFor="input-cmyk" className="font-bold text-slate-400 text-xs md:col-span-2">
						CMYK
					</label>
					<div className="md:col-span-8">
						<Input
							id="input-cmyk"
							value={cmyk}
							onChange={(e) => handleCmykChange(e.target.value)}
							placeholder="cmyk(0%, 0%, 0%, 100%)"
						/>
					</div>
					<div className="md:col-span-2">
						<Button
							variant="outline"
							className="flex w-full items-center justify-center gap-1.5 text-xs"
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
	)
}
