import { Input } from '@/components/ui/input'
import { hexToRgb } from '@/lib/color'

type ColorCanvasProps = {
	hex: string
	onColorChange: (r: number, g: number, b: number) => void
}

export function ColorCanvas({ hex, onColorChange }: ColorCanvasProps) {
	return (
		<div className="border-terminal-border bg-terminal-card/60 flex flex-col items-center justify-between gap-6 rounded-sm border p-6 lg:col-span-4">
			<span className="flex items-center gap-2 self-start text-xs font-bold tracking-wider text-slate-300 uppercase">
				<span className="bg-matrix h-1.5 w-1.5 rounded-full" />
				Color Canvas
			</span>

			<div
				className="border-terminal-border h-32 w-32 rounded border shadow-[0_0_20px_rgba(0,0,0,0.4)]"
				style={{ backgroundColor: hex }}
			/>

			<div className="w-full">
				<label
					htmlFor="color-picker"
					className="mb-1 block text-center text-xs font-bold text-slate-500 uppercase"
				>
					Pick Color
				</label>
				<div className="border-terminal-border bg-terminal-bg/50 hover:border-matrix/40 relative h-10 w-full cursor-pointer overflow-hidden rounded border transition-colors">
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
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-400 select-none">
						LAUNCH COLOR PICKER
					</div>
				</div>
			</div>
		</div>
	)
}
