import { Plus } from 'lucide-react'
import { useState } from 'react'

import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'

import { CssPreview } from './css-preview'
import { ShadowLayerEditor } from './shadow-layer-editor'
import type { ShadowLayer } from './types'
import { boxShadowValue, buildBoxShadow, createId } from './utils'

const MAX_LAYERS = 8

const createLayer = (): ShadowLayer => ({
	id: createId(),
	x: 0,
	y: 4,
	blur: 12,
	spread: 0,
	color: { hex: '#000000', alpha: 0.25 },
	inset: false,
})

export function BoxShadowTab() {
	const [layers, setLayers] = useState<ShadowLayer[]>(() => [createLayer()])

	const updateLayer = (id: string, patch: Partial<ShadowLayer>) =>
		setLayers((current) =>
			current.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)),
		)

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
			<Pane title={`Shadow Layers (${layers.length})`} className="lg:flex-1">
				<div className="flex flex-col gap-4 p-6">
					{layers.length === 0 && (
						<p className="text-center text-xs text-slate-500">
							No layers. The element has no shadow.
						</p>
					)}
					{layers.map((layer, index) => (
						<ShadowLayerEditor
							key={layer.id}
							layer={layer}
							index={index}
							onChange={(patch) => updateLayer(layer.id, patch)}
							onRemove={() =>
								setLayers((current) => current.filter((item) => item.id !== layer.id))
							}
						/>
					))}
					<Button
						variant="outline"
						disabled={layers.length >= MAX_LAYERS}
						onClick={() => setLayers((current) => [...current, createLayer()])}
						className="flex items-center gap-1.5 text-xs"
					>
						<Plus className="h-3.5 w-3.5" />
						ADD LAYER
					</Button>
				</div>
			</Pane>

			<div className="flex flex-col gap-6 lg:sticky lg:top-4 lg:flex-1 lg:self-start">
				<CssPreview style={{ boxShadow: boxShadowValue(layers) }} />
				<EditorPane
					title="CSS"
					value={buildBoxShadow(layers)}
					readOnly={true}
					className="min-h-40"
				/>
			</div>
		</div>
	)
}
