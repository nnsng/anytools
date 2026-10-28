import { Plus } from 'lucide-react'
import { useState } from 'react'

import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

import { CssPreview } from './css-preview'
import { GradientStopEditor } from './gradient-stop-editor'
import { NumberField } from './number-field'
import type { GradientConfig, GradientStop, GradientType, RadialShape } from './types'
import { buildGradient, createId, gradientValue } from './utils'

const MIN_STOPS = 2
const MAX_STOPS = 10

const TYPES: Array<{ value: GradientType; label: string }> = [
	{ value: 'linear', label: 'Linear' },
	{ value: 'radial', label: 'Radial' },
	{ value: 'conic', label: 'Conic' },
]

const SHAPES: Array<{ value: RadialShape; label: string }> = [
	{ value: 'circle', label: 'Circle' },
	{ value: 'ellipse', label: 'Ellipse' },
]

function isOption<T extends string>(options: Array<{ value: T }>, value: string): value is T {
	return options.some((option) => option.value === value)
}

const createStop = (hex: string, position: number): GradientStop => ({
	id: createId(),
	color: { hex, alpha: 1 },
	position,
})

export function GradientTab() {
	const [config, setConfig] = useState<GradientConfig>(() => ({
		type: 'linear',
		angle: 135,
		radialShape: 'circle',
		stops: [createStop('#22c55e', 0), createStop('#3b82f6', 100)],
	}))

	const patch = (changes: Partial<GradientConfig>) =>
		setConfig((current) => ({ ...current, ...changes }))
	const updateStop = (id: string, changes: Partial<GradientStop>) =>
		patch({ stops: config.stops.map((stop) => (stop.id === id ? { ...stop, ...changes } : stop)) })
	const usesAngle = config.type !== 'radial'

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
			<Pane title="Gradient Settings" className="lg:flex-1">
				<div className="flex flex-col gap-4 p-6">
					<div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
						<div className="flex flex-col gap-1">
							<label htmlFor="gradient-type" className="font-bold text-slate-500 uppercase">
								Type
							</label>
							<Select
								value={config.type}
								onValueChange={(value) => isOption(TYPES, value) && patch({ type: value })}
							>
								<SelectTrigger
									id="gradient-type"
									className="border-terminal-border h-8 w-full font-mono text-xs"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									{TYPES.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{config.type === 'radial' && (
							<div className="flex flex-col gap-1">
								<label htmlFor="gradient-shape" className="font-bold text-slate-500 uppercase">
									Shape
								</label>
								<Select
									value={config.radialShape}
									onValueChange={(value) =>
										isOption(SHAPES, value) && patch({ radialShape: value })
									}
								>
									<SelectTrigger
										id="gradient-shape"
										className="border-terminal-border h-8 w-full font-mono text-xs"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
										{SHAPES.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						{usesAngle && (
							<div className="flex items-end gap-3">
								<NumberField
									id="gradient-angle"
									label="Angle (deg)"
									min={0}
									max={360}
									value={config.angle}
									onChange={(angle) => patch({ angle: Math.min(360, Math.max(0, angle)) })}
									className="w-24"
								/>
								<div className="mb-1 flex flex-1 flex-col gap-1">
									<span className="text-xs font-bold text-slate-500 uppercase">Rotate</span>
									<Slider
										min={0}
										max={360}
										step={1}
										value={[config.angle]}
										onValueChange={(value) => patch({ angle: value[0] ?? config.angle })}
										aria-label="Angle"
									/>
								</div>
							</div>
						)}
					</div>

					{config.stops.map((stop, index) => (
						<GradientStopEditor
							key={stop.id}
							stop={stop}
							index={index}
							canRemove={config.stops.length > MIN_STOPS}
							onChange={(changes) => updateStop(stop.id, changes)}
							onRemove={() => patch({ stops: config.stops.filter((item) => item.id !== stop.id) })}
						/>
					))}

					<Button
						variant="outline"
						disabled={config.stops.length >= MAX_STOPS}
						onClick={() => patch({ stops: [...config.stops, createStop('#ffffff', 50)] })}
						className="flex items-center gap-1.5 text-xs"
					>
						<Plus className="h-3.5 w-3.5" />
						ADD COLOR STOP
					</Button>
				</div>
			</Pane>

			<div className="flex flex-col gap-6 lg:sticky lg:top-4 lg:flex-1 lg:self-start">
				<CssPreview style={{ background: gradientValue(config) }} />
				<EditorPane
					title="CSS"
					value={buildGradient(config)}
					readOnly={true}
					className="min-h-40"
				/>
			</div>
		</div>
	)
}
