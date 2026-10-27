import { useMemo, useState } from 'react'

import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

import { clampCount, generateLorem, type LoremOptions, type LoremUnit, UNIT_LIMITS } from './utils'

const UNITS: Array<{ value: LoremUnit; label: string }> = [
	{ value: 'paragraphs', label: 'Paragraphs' },
	{ value: 'sentences', label: 'Sentences' },
	{ value: 'words', label: 'Words' },
]

const DEFAULT_OPTIONS: LoremOptions = {
	unit: 'paragraphs',
	count: 3,
	startWithClassic: true,
}

function isUnit(value: string): value is LoremUnit {
	return UNITS.some((option) => option.value === value)
}

export default function LoremIpsum() {
	const [options, setOptions] = useState<LoremOptions>(DEFAULT_OPTIONS)
	// Bumped by the Generate button to draw new text with the same options
	const [generation, setGeneration] = useState<number>(0)

	const text = useMemo(() => {
		void generation
		return generateLorem(options)
	}, [options, generation])

	const { min, max } = UNIT_LIMITS[options.unit]
	const setCount = (count: number) =>
		setOptions((current) => ({ ...current, count: clampCount(current.unit, count) }))

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
			<Pane title="Lorem Ipsum Settings" className="lg:flex-5">
				<div className="flex flex-col gap-6 p-6">
					<div className="space-y-4 text-xs">
						<div className="space-y-2">
							<label htmlFor="lorem-unit" className="block font-bold text-slate-500 uppercase">
								Generate
							</label>
							<Select
								value={options.unit}
								onValueChange={(unit) => {
									if (isUnit(unit)) {
										setOptions((current) => ({
											...current,
											unit,
											count: clampCount(unit, current.count),
										}))
									}
								}}
							>
								<SelectTrigger
									id="lorem-unit"
									className="border-terminal-border h-8 w-full font-mono text-xs"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									{UNITS.map((unit) => (
										<SelectItem key={unit.value} value={unit.value}>
											{unit.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<span className="block font-bold text-slate-500 uppercase">Amount</span>
							<div className="flex items-center gap-4">
								<Slider
									min={min}
									max={max}
									step={1}
									value={[options.count]}
									onValueChange={(value) => setCount(value[0] ?? options.count)}
									aria-label="Amount"
									className="flex-1"
								/>
								<Input
									type="number"
									min={min}
									max={max}
									value={options.count}
									onChange={(e) => setCount(parseInt(e.target.value, 10))}
									aria-label="Amount value"
									className="border-terminal-border text-foreground h-7 w-20 [appearance:textfield] text-center font-mono text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								/>
							</div>
						</div>

						<div className="border-terminal-border flex items-center gap-2.5 border-t pt-4">
							<Checkbox
								id="lorem-classic"
								checked={options.startWithClassic}
								onCheckedChange={(checked) =>
									setOptions((current) => ({ ...current, startWithClassic: checked === true }))
								}
							/>
							<label
								htmlFor="lorem-classic"
								className="cursor-pointer font-semibold text-slate-300 select-none"
							>
								Start with "Lorem ipsum dolor sit amet…"
							</label>
						</div>
					</div>

					<Button
						onClick={() => setGeneration((value) => value + 1)}
						className="mt-auto h-9 w-full"
					>
						GENERATE
					</Button>
				</div>
			</Pane>

			<EditorPane
				title="Generated Text"
				value={text}
				readOnly={true}
				allowDownload={true}
				downloadFileName="lorem-ipsum.txt"
				className="min-h-96 lg:flex-7"
			/>
		</div>
	)
}
