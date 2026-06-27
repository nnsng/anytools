import { Input } from '@/components/ui/input'
import { hexToRgb } from './color-utils'

type ColorCanvasProps = {
	hex: string
	onColorChange: (r: number, g: number, b: number) => void
}

export function ColorCanvas({ hex, onColorChange }: ColorCanvasProps) {
	return (
		<div className="flex flex-col items-center justify-between gap-6 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-4">
			<span className="flex items-center gap-2 self-start font-bold text-slate-300 text-xs uppercase tracking-wider">
				<span className="h-1.5 w-1.5 rounded-full bg-matrix" />
				Color Canvas
			</span>

			<div
				className="h-32 w-32 rounded border border-terminal-border shadow-[0_0_20px_rgba(0,0,0,0.4)]"
				style={{ backgroundColor: hex }}
			/>

			<div className="w-full">
				<label
					htmlFor="color-picker"
					className="mb-1 block text-center font-bold text-slate-500 text-xs uppercase"
				>
					Pick Color
				</label>
				<div className="relative h-10 w-full cursor-pointer overflow-hidden rounded border border-terminal-border bg-terminal-bg/50 transition-colors hover:border-matrix/40">
					<Input
						id="color-picker"
						type="color"
						value={hex}
						onChange={(e) => {
							const rgbVal = hexToRgb(e.target.value)
							if (rgbVal) onColorChange(rgbVal.r, rgbVal.g, rgbVal.b)
						}}
						className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					/>
					<div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-bold text-slate-400 text-xs">
						LAUNCH COLOR PICKER
					</div>
				</div>
			</div>
		</div>
	)
}
