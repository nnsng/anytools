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
			<div className="mt-2 space-y-1">
				<div className="flex items-center justify-between text-xs">
					<span className="font-bold text-slate-500 uppercase">Opacity</span>
					<span className="font-mono text-slate-500">{percent}%</span>
				</div>
				<Slider
					min={0}
					max={100}
					step={1}
					value={[percent]}
					onValueChange={(next) => onChange({ ...value, alpha: (next[0] ?? percent) / 100 })}
					aria-label={`${label} opacity`}
				/>
			</div>
		</div>
	)
}
