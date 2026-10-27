import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { AlphaColorField } from './alpha-color-field'
import { NumberField } from './number-field'
import type { ShadowLayer } from './types'

type ShadowLayerEditorProps = {
	layer: ShadowLayer
	index: number
	onChange: (patch: Partial<ShadowLayer>) => void
	onRemove: () => void
}

export function ShadowLayerEditor({ layer, index, onChange, onRemove }: ShadowLayerEditorProps) {
	const prefix = `shadow-${layer.id}`
	const name = `Layer ${index + 1}`

	return (
		<div className="border-terminal-border bg-terminal-bg/30 space-y-4 rounded border p-4">
			<div className="flex items-center justify-between">
				<span className="text-xs font-bold tracking-wider text-slate-300 uppercase">{name}</span>
				<Button
					variant="ghost"
					size="sm"
					onClick={onRemove}
					aria-label={`Remove ${name}`}
					title={`Remove ${name}`}
					className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
				>
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<NumberField
					id={`${prefix}-x`}
					label="X"
					value={layer.x}
					onChange={(x) => onChange({ x })}
				/>
				<NumberField
					id={`${prefix}-y`}
					label="Y"
					value={layer.y}
					onChange={(y) => onChange({ y })}
				/>
				<NumberField
					id={`${prefix}-blur`}
					label="Blur"
					min={0}
					value={layer.blur}
					onChange={(blur) => onChange({ blur: Math.max(0, blur) })}
				/>
				<NumberField
					id={`${prefix}-spread`}
					label="Spread"
					value={layer.spread}
					onChange={(spread) => onChange({ spread })}
				/>
			</div>

			<AlphaColorField
				id={`${prefix}-color`}
				label={`${name} color`}
				value={layer.color}
				onChange={(color) => onChange({ color })}
			/>

			<div className="flex items-center gap-2.5 text-xs">
				<Checkbox
					id={`${prefix}-inset`}
					checked={layer.inset}
					onCheckedChange={(checked) => onChange({ inset: checked === true })}
				/>
				<label
					htmlFor={`${prefix}-inset`}
					className="cursor-pointer font-semibold text-slate-300 select-none"
				>
					Inset
				</label>
			</div>
		</div>
	)
}
