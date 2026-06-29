import { Pipette } from 'lucide-react'
import { useState } from 'react'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ColorFields } from './color-fields'
import { hexToRgb, rgbToCmyk, rgbToHex, rgbToHsl } from './color-utils'

type ColorHistoryItem = {
	hex: string
	rgb: string
}

export default function ColorConverter() {
	// Color formats state
	const [hex, setHex] = useState<string>('#22c55e')
	const [rgb, setRgb] = useState<string>('rgb(34, 197, 94)')
	const [hsl, setHsl] = useState<string>('hsl(142, 71%, 45%)')
	const [cmyk, setCmyk] = useState<string>('cmyk(83%, 0%, 52%, 23%)')

	// Eyedropper / Image State
	const [history, setHistory] = useState<ColorHistoryItem[]>([
		{ hex: '#22c55e', rgb: 'rgb(34, 197, 94)' },
	])

	// Check native Eyedropper API support
	const hasNativeEyedropper = typeof window !== 'undefined' && 'EyeDropper' in window

	const updateAllFromRgb = (r: number, g: number, b: number) => {
		const newHex = rgbToHex(r, g, b)
		const newRgb = `rgb(${r}, ${g}, ${b})`
		const hslVal = rgbToHsl(r, g, b)
		const cmykVal = rgbToCmyk(r, g, b)

		setHex(newHex)
		setRgb(newRgb)
		setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`)
		setCmyk(`cmyk(${cmykVal.c}%, ${cmykVal.m}%, ${cmykVal.y}%, ${cmykVal.k}%)`)

		// Append to history if not already present
		const item = { hex: newHex, rgb: newRgb }
		setHistory((prev) =>
			[item, ...prev.filter((x) => x.hex.toLowerCase() !== newHex.toLowerCase())].slice(0, 9),
		)
	}

	const handleLaunchNativeEyedropper = async () => {
		if (!hasNativeEyedropper) return
		try {
			// biome-ignore lint/suspicious/noExplicitAny: EyeDropper is a new window API not in default types yet
			const dropper = new (window as any).EyeDropper()
			const result = await dropper.open()
			if (result.sRGBHex) {
				const hexVal = result.sRGBHex
				const rgbVal = hexToRgb(hexVal)
				if (rgbVal) updateAllFromRgb(rgbVal.r, rgbVal.g, rgbVal.b)
			}
		} catch (err) {
			console.error(err instanceof Error ? err.message : 'Dropper API cancelled or failed')
		}
	}

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
			{/* Left Column: Canvas, Picker, Eyedropper, Image Pick */}
			<Pane title="Color Studio" className="lg:flex-5">
				<div className="flex flex-col gap-6 p-6">
					{/* Active Color Preview */}
					<div
						className="mx-auto h-28 w-28 rounded border border-terminal-border shadow-[0_0_20px_rgba(0,0,0,0.4)]"
						style={{ backgroundColor: hex }}
					/>

					{/* Standard color picker control */}
					<div className="w-full">
						<label
							htmlFor="color-picker"
							className="mb-1 block text-center font-bold text-slate-500 text-xs uppercase"
						>
							Pick Color
						</label>
						<div className="relative h-9 w-full cursor-pointer overflow-hidden rounded border border-terminal-border bg-terminal-bg/50 transition-colors hover:border-matrix/40">
							<Input
								id="color-picker"
								type="color"
								value={hex}
								onChange={(e) => {
									const rgbVal = hexToRgb(e.target.value)
									if (rgbVal) updateAllFromRgb(rgbVal.r, rgbVal.g, rgbVal.b)
								}}
								className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
							/>
							<div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-bold text-slate-400 text-xs">
								LAUNCH COLOR PALETTE
							</div>
						</div>
					</div>

					{/* Eyedropper Section */}
					<div className="border-terminal-border border-t pt-4">
						{hasNativeEyedropper ? (
							<div className="flex flex-col gap-2">
								<span className="font-bold text-slate-300 text-xs uppercase">
									Native Screen Eyedropper
								</span>

								<Button
									onClick={handleLaunchNativeEyedropper}
									className="flex h-9 w-full items-center justify-center gap-2 text-xs"
								>
									<Pipette className="h-4 w-4" /> LAUNCH SYSTEM EYEDROPPER
								</Button>
							</div>
						) : (
							<p className="text-slate-500 text-xs leading-relaxed">
								Your browser does not support the native screen Eyedropper API. You can upload an
								image file below to pick colors.
							</p>
						)}
					</div>
				</div>
			</Pane>

			{/* Right Column: Translations & History */}
			<div className="flex flex-col gap-6 lg:flex-7">
				{/* Translation Inputs */}
				<ColorFields
					hex={hex}
					rgb={rgb}
					hsl={hsl}
					cmyk={cmyk}
					setHex={setHex}
					setRgb={setRgb}
					setHsl={setHsl}
					setCmyk={setCmyk}
					updateAllFromRgb={updateAllFromRgb}
				/>

				{/* Eyedropper History */}
				<Pane title="Color History" dotClassName="bg-blue-500">
					<div className="flex flex-col p-6">
						{history.length === 0 ? (
							<div className="py-2 text-center text-slate-600 text-xs">No history.</div>
						) : (
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
								{history.map((item, idx) => (
									<button
										type="button"
										key={`${item.hex}-${idx}`}
										onClick={() => {
											const rgbVal = hexToRgb(item.hex)
											if (rgbVal) updateAllFromRgb(rgbVal.r, rgbVal.g, rgbVal.b)
										}}
										className="flex items-center gap-2 rounded border border-terminal-border bg-terminal-bg/50 p-2 text-left transition-colors hover:border-matrix/30"
									>
										<div
											className="h-5 w-5 shrink-0 rounded border border-terminal-border/60"
											style={{ backgroundColor: item.hex }}
										/>
										<div className="min-w-0 flex-1">
											<div className="truncate font-mono text-foreground text-xs uppercase">
												{item.hex}
											</div>
										</div>
									</button>
								))}
							</div>
						)}
					</div>
				</Pane>
			</div>
		</div>
	)
}
