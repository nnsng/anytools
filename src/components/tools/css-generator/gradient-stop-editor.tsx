import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { AlphaColorField } from './alpha-color-field'
import { NumberField } from './number-field'
import type { GradientStop } from './types'

type GradientStopEditorProps = {
	stop: GradientStop
	index: number
	canRemove: boolean
	onChange: (patch: Partial<GradientStop>) => void
	onRemove: () => void
}

export function GradientStopEditor(props: GradientStopEditorProps) {
	const { stop, index, canRemove, onChange, onRemove } = props
	const prefix = `stop-${stop.id}`
	const name = `Stop ${index + 1}`

	return (
		<div className="border-terminal-border bg-terminal-bg/30 space-y-3 rounded border p-4">
			<div className="flex items-center justify-between">
				<span className="text-xs font-bold tracking-wider text-slate-300 uppercase">{name}</span>
				<Button
					variant="ghost"
					size="sm"
					disabled={!canRemove}
					onClick={onRemove}
					aria-label={`Remove ${name}`}
					title={canRemove ? `Remove ${name}` : 'A gradient needs at least two stops'}
					className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
				>
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_6rem]">
				<AlphaColorField
					id={`${prefix}-color`}
					label={`${name} color`}
					value={stop.color}
					onChange={(color) => onChange({ color })}
				/>
				<NumberField
					id={`${prefix}-position`}
					label="Position %"
					min={0}
					max={100}
					value={stop.position}
					onChange={(position) => onChange({ position: Math.min(100, Math.max(0, position)) })}
				/>
			</div>
		</div>
	)
}
