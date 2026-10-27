import { useMemo, useState } from 'react'

import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

import {
	calculateStrength,
	clampLength,
	generatePassword,
	MAX_LENGTH,
	MIN_LENGTH,
	type PasswordOptions,
} from './utils'

const DEFAULT_OPTIONS: PasswordOptions = {
	length: 16,
	uppercase: true,
	lowercase: true,
	digits: true,
	symbols: true,
	avoidAmbiguous: true,
}

const TOGGLES: Array<{ key: Exclude<keyof PasswordOptions, 'length'>; label: string }> = [
	{ key: 'uppercase', label: 'UPPERCASE (A-Z)' },
	{ key: 'lowercase', label: 'LOWERCASE (a-z)' },
	{ key: 'digits', label: 'NUMBERS (0-9)' },
	{ key: 'symbols', label: 'SYMBOLS (!@#$...)' },
]

export default function PasswordGenerator() {
	const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS)
	// Bumped by the Generate button to draw a fresh password with the same options
	const [generation, setGeneration] = useState<number>(0)

	const password = useMemo(() => {
		void generation
		return generatePassword(options)
	}, [options, generation])
	const strength = useMemo(() => calculateStrength(password, options), [password, options])

	const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) =>
		setOptions((current) => ({ ...current, [key]: value }))
	const setLength = (length: number) => updateOption('length', clampLength(length))
	const handleGenerate = () => setGeneration((value) => value + 1)

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
			{/* Settings */}
			<Pane title="Password Settings" className="lg:flex-5">
				<div className="flex flex-col gap-6 p-6">
					<div className="space-y-4 text-xs">
						{/* Length */}
						<div className="space-y-2">
							<span className="block font-bold text-slate-500 uppercase">Password Length</span>
							<div className="flex items-center gap-4">
								<Slider
									min={MIN_LENGTH}
									max={MAX_LENGTH}
									step={1}
									value={[options.length]}
									onValueChange={(val) => setLength(val[0] ?? options.length)}
									className="flex-1"
								/>
								<div className="flex items-center">
									<Button
										type="button"
										variant="outline"
										className="border-terminal-border hover:bg-terminal-border/20 hover:text-foreground h-7 w-7 rounded-r-none border-r-0 p-0 text-slate-400"
										onClick={() => setLength(options.length - 1)}
									>
										-
									</Button>
									<Input
										type="number"
										min={MIN_LENGTH}
										max={MAX_LENGTH}
										value={options.length}
										onChange={(e) => setLength(parseInt(e.target.value, 10) || MIN_LENGTH)}
										className="border-terminal-border text-foreground h-7 w-12 [appearance:textfield] rounded-none p-0 text-center font-mono text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
									/>
									<Button
										type="button"
										variant="outline"
										className="border-terminal-border hover:bg-terminal-border/20 hover:text-foreground h-7 w-7 rounded-l-none border-l-0 p-0 text-slate-400"
										onClick={() => setLength(options.length + 1)}
									>
										+
									</Button>
								</div>
							</div>
						</div>

						{/* Toggles */}
						<div className="border-terminal-border space-y-3 border-t pt-4">
							{TOGGLES.map(({ key, label }) => (
								<div key={key} className="flex items-center gap-2.5">
									<Checkbox
										id={key}
										checked={options[key]}
										onCheckedChange={(checked) => updateOption(key, checked === true)}
									/>
									<label
										htmlFor={key}
										className="hover:text-foreground cursor-pointer font-semibold text-slate-300 select-none"
									>
										{label}
									</label>
								</div>
							))}

							<div className="border-terminal-border flex items-center gap-2.5 border-t pt-3">
								<Checkbox
									id="avoidAmbiguous"
									checked={options.avoidAmbiguous}
									onCheckedChange={(checked) => updateOption('avoidAmbiguous', checked === true)}
								/>
								<label
									htmlFor="avoidAmbiguous"
									className="hover:text-foreground cursor-pointer font-semibold text-slate-300 select-none"
								>
									AVOID AMBIGUOUS CHARACTERS (e.g. l, 1, I)
								</label>
							</div>
						</div>
					</div>

					<Button onClick={handleGenerate} className="mt-auto h-9 w-full">
						GENERATE
					</Button>
				</div>
			</Pane>

			{/* Display */}
			<div className="flex flex-col gap-6 lg:flex-7">
				<EditorPane
					title="Generated Password"
					value={password}
					readOnly={true}
					placeholder="Click Generate Password..."
				/>

				{/* Strength indicator */}
				<div className="border-terminal-border bg-terminal-card/60 flex flex-col gap-3 rounded-sm border p-6">
					<div className="flex items-center justify-between text-xs font-bold tracking-wider text-slate-300 uppercase">
						<span>Password Strength:</span>
						<span
							className={cn(
								'text-primary-foreground rounded px-2 py-0.5 text-xs font-bold',
								strength.label === 'Weak' && 'bg-red-500',
								strength.label === 'Fair' && 'bg-yellow-500',
								strength.label === 'Strong' && 'bg-blue-500',
								strength.label === 'Secure' && 'bg-matrix',
								strength.label === 'Empty' && 'bg-slate-700 text-slate-400',
							)}
						>
							{strength.label.toUpperCase()}
						</span>
					</div>

					<div className="border-terminal-border bg-terminal-bg h-2 w-full overflow-hidden rounded-full border">
						<div
							className={cn('h-full transition-all duration-300', strength.color)}
							style={{ width: `${strength.percentage}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
