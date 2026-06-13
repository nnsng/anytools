import { Pipette, Upload } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
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
		{ hex: '#00ff66', rgb: 'rgb(0, 255, 102)' },
	])
	const [imageSrc, setImageSrc] = useState<string | null>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

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

	const handleFileChange = (file: File) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			setImageSrc(e.target?.result as string)
		}
		reader.readAsDataURL(file)
	}

	const handleImageClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const rect = canvas.getBoundingClientRect()
		const scaleX = canvas.width / rect.width
		const scaleY = canvas.height / rect.height

		const x = (e.clientX - rect.left) * scaleX
		const y = (e.clientY - rect.top) * scaleY

		const pixel = ctx.getImageData(x, y, 1, 1).data
		updateAllFromRgb(pixel[0], pixel[1], pixel[2])
	}

	useEffect(() => {
		if (imageSrc && canvasRef.current) {
			const canvas = canvasRef.current
			const ctx = canvas.getContext('2d')
			if (!ctx) return

			const img = new window.Image()
			img.onload = () => {
				canvas.width = img.width
				canvas.height = img.height
				ctx.drawImage(img, 0, 0)
			}
			img.src = imageSrc
		}
	}, [imageSrc])

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
							className="mb-1 block text-center font-bold text-[10px] text-slate-500 uppercase"
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
								<span className="font-bold text-[10px] text-slate-300 uppercase">
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
							<p className="text-[10px] text-slate-500 leading-relaxed">
								Your browser does not support the native screen Eyedropper API. You can upload an
								image file below to pick colors.
							</p>
						)}
					</div>

					{/* Image Fallback color picker */}
					<div className="flex flex-1 flex-col justify-between space-y-4 border-terminal-border border-t pt-4">
						<div className="flex flex-col gap-2">
							<span className="font-bold text-[10px] text-slate-300 uppercase">
								Upload Image to Pick Colors
							</span>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded border border-terminal-border border-dashed bg-terminal-bg/40 p-3 transition-all hover:border-matrix/40 hover:bg-terminal-bg/80 focus:outline-none focus:ring-1 focus:ring-matrix/50"
							>
								<input
									type="file"
									ref={fileInputRef}
									className="hidden"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.[0]
										if (file) handleFileChange(file)
									}}
								/>
								<Upload className="mb-1 h-4 w-4 text-slate-500" />
								<span className="font-bold text-[9px] text-slate-500 uppercase">
									Click to browse image
								</span>
							</button>
						</div>

						{imageSrc && (
							<div className="relative max-h-40 overflow-auto rounded border border-terminal-border bg-terminal-bg p-1.5">
								<canvas
									ref={canvasRef}
									onClick={handleImageClick}
									className="mx-auto h-auto max-w-full cursor-crosshair object-contain"
								/>
							</div>
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
				<Pane title="Color History" type="output">
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
										<div className="min-w-0 flex-1 font-mono text-[9px]">
											<div className="truncate font-bold text-white uppercase">{item.hex}</div>
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
