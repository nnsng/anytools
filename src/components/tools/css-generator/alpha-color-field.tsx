import { ColorField } from '@/components/tools/shared/color-field'
import { Slider } from '@/components/ui/slider'

import type { AlphaColor } from './types'

type AlphaColorFieldProps = {
	id: string
	label: string
	value: AlphaColor
	onChange: (value: AlphaColor) => void
	className?: string
}

export function AlphaColorField({ id, label, value, onChange, className }: AlphaColorFieldProps) {
	const percent = Math.round(value.alpha * 100)

	return (
		<div className={className}>
			<ColorField
				id={id}
				label={label}
				value={value.hex}
				onChange={(hex) => onChange({ ...value, hex })}
			/>
			<div className="mt-2 flex items-center gap-3">
				<Slider
					min={0}
					max={100}
					step={1}
					value={[percent]}
					onValueChange={(next) => onChange({ ...value, alpha: (next[0] ?? percent) / 100 })}
					aria-label={`${label} opacity`}
					className="flex-1"
				/>
				<span className="w-10 text-right font-mono text-xs text-slate-500">{percent}%</span>
			</div>
		</div>
	)
}
