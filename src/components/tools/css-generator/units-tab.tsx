import { useMemo, useState } from 'react'

import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Pane } from '@/components/tools/shared/pane'
import { ERROR_BOX_CLASS } from '@/lib/styles'
import { cn } from '@/lib/utils'

import { NumberField } from './number-field'
import type { ClampConfig } from './types'
import { buildClamp, formatNumber, pxToRem, remToPx } from './utils'

const DEFAULT_ROOT_FONT_SIZE = 16

export function UnitsTab() {
	const [rootFontSize, setRootFontSize] = useState<number>(DEFAULT_ROOT_FONT_SIZE)
	// px is the source of truth; rem is derived from it
	const [px, setPx] = useState<number>(24)
	const [clampInput, setClampInput] = useState<Omit<ClampConfig, 'rootFontSize'>>({
		minSize: 16,
		maxSize: 32,
		minViewport: 320,
		maxViewport: 1280,
	})

	const patchClamp = (changes: Partial<typeof clampInput>) =>
		setClampInput((current) => ({ ...current, ...changes }))

	const clampResult = useMemo(() => {
		try {
			return { result: buildClamp({ ...clampInput, rootFontSize }), error: null }
		} catch (err) {
			return { result: null, error: err instanceof Error ? err.message : 'Invalid values' }
		}
	}, [clampInput, rootFontSize])

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
			<Pane title="px ⇄ rem" className="lg:flex-1">
				<div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
					<NumberField
						id="root-font-size"
						label="Root font size (px)"
						min={1}
						value={rootFontSize}
						onChange={(value) => setRootFontSize(Math.max(1, value))}
					/>
					<NumberField id="unit-px" label="px" step={0.5} value={px} onChange={setPx} />
					<NumberField
						id="unit-rem"
						label="rem"
						step={0.0625}
						value={Number(formatNumber(pxToRem(px, rootFontSize), 4))}
						onChange={(rem) => setPx(remToPx(rem, rootFontSize))}
					/>
				</div>
			</Pane>

			<div className="flex flex-col gap-6 lg:flex-1">
				<Pane title="Fluid size with clamp()">
					<div className="flex flex-col gap-4 p-6">
						<div className="grid grid-cols-2 gap-4">
							<NumberField
								id="clamp-min-size"
								label="Min size (px)"
								value={clampInput.minSize}
								onChange={(minSize) => patchClamp({ minSize })}
							/>
							<NumberField
								id="clamp-max-size"
								label="Max size (px)"
								value={clampInput.maxSize}
								onChange={(maxSize) => patchClamp({ maxSize })}
							/>
							<NumberField
								id="clamp-min-viewport"
								label="Min viewport (px)"
								value={clampInput.minViewport}
								onChange={(minViewport) => patchClamp({ minViewport })}
							/>
							<NumberField
								id="clamp-max-viewport"
								label="Max viewport (px)"
								value={clampInput.maxViewport}
								onChange={(maxViewport) => patchClamp({ maxViewport })}
							/>
						</div>

						{clampResult.error && (
							<p role="alert" className={cn(ERROR_BOX_CLASS, 'p-2 text-xs')}>
								{clampResult.error}
							</p>
						)}
						{clampResult.result && (
							<p className="font-mono text-xs text-slate-500">
								slope = {formatNumber(clampResult.result.slopePerVw, 4)}vw · intercept ={' '}
								{formatNumber(clampResult.result.interceptPx, 4)}px
							</p>
						)}
					</div>
				</Pane>

				<EditorPane
					title="CSS"
					value={clampResult.result ? `font-size: ${clampResult.result.value};` : ''}
					readOnly={true}
					className="min-h-32"
				/>
			</div>
		</div>
	)
}
