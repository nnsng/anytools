import { useCallback, useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

type Strength = {
	label: string
	color: string
	percentage: number
}

function generatePassword(
	length: number,
	useUpper: boolean,
	useLower: boolean,
	useDigits: boolean,
	useSymbols: boolean,
	avoidAmbiguous: boolean,
): string {
	let chars = ''
	let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let lower = 'abcdefghijklmnopqrstuvwxyz'
	let digits = '0123456789'
	let symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-='

	if (avoidAmbiguous) {
		upper = upper.replace(/[IO]/g, '')
		lower = lower.replace(/[lo]/g, '')
		digits = digits.replace(/[01]/g, '')
		symbols = symbols.replace(/[|]/g, '')
	}

	if (useUpper) chars += upper
	if (useLower) chars += lower
	if (useDigits) chars += digits
	if (useSymbols) chars += symbols

	if (!chars) return ''

	let password = ''
	const cryptoObj = typeof window !== 'undefined' ? window.crypto : null
	if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
		const array = new Uint32Array(length)
		cryptoObj.getRandomValues(array)
		for (let i = 0; i < length; i++) {
			password += chars[array[i] % chars.length]
		}
	} else {
		for (let i = 0; i < length; i++) {
			password += chars[Math.floor(Math.random() * chars.length)]
		}
	}
	return password
}

function calculateStrength(
	pass: string,
	useUpper: boolean,
	useLower: boolean,
	useDigits: boolean,
	useSymbols: boolean,
): Strength {
	if (!pass) return { label: 'Empty', color: 'bg-slate-700', percentage: 0 }

	let score = 0
	if (pass.length >= 8) score += 1
	if (pass.length >= 12) score += 1
	if (pass.length >= 16) score += 1

	let categories = 0
	if (useUpper && /[A-Z]/.test(pass)) categories++
	if (useLower && /[a-z]/.test(pass)) categories++
	if (useDigits && /[0-9]/.test(pass)) categories++
	if (useSymbols && /[^A-Za-z0-9]/.test(pass)) categories++

	score += categories

	if (score <= 3) {
		return { label: 'Weak', color: 'bg-red-500', percentage: 25 }
	}
	if (score <= 5) {
		return { label: 'Fair', color: 'bg-yellow-500', percentage: 50 }
	}
	if (score <= 6) {
		return { label: 'Strong', color: 'bg-blue-500', percentage: 75 }
	}
	return { label: 'Secure', color: 'bg-matrix', percentage: 100 }
}

export default function PasswordGenerator() {
	const [length, setLength] = useState<number>(16)
	const [uppercase, setUppercase] = useState<boolean>(true)
	const [lowercase, setLowercase] = useState<boolean>(true)
	const [digits, setDigits] = useState<boolean>(true)
	const [symbols, setSymbols] = useState<boolean>(true)
	const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(true)
	const [password, setPassword] = useState<string>('')
	const [strength, setStrength] = useState<Strength>({
		label: 'Empty',
		color: 'bg-slate-700',
		percentage: 0,
	})

	const handleGenerate = useCallback(() => {
		const pass = generatePassword(length, uppercase, lowercase, digits, symbols, avoidAmbiguous)
		setPassword(pass)
		setStrength(calculateStrength(pass, uppercase, lowercase, digits, symbols))
	}, [length, uppercase, lowercase, digits, symbols, avoidAmbiguous])

	useEffect(() => {
		handleGenerate()
	}, [handleGenerate])

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
									min={6}
									max={64}
									step={1}
									value={[length]}
									onValueChange={(val) => setLength(val[0])}
									className="flex-1"
								/>
								<div className="flex items-center">
									<Button
										type="button"
										variant="outline"
										className="h-7 w-7 rounded-r-none border-terminal-border border-r-0 p-0 text-slate-400 hover:bg-terminal-border/20 hover:text-white"
										onClick={() => setLength((l) => Math.max(6, l - 1))}
									>
										-
									</Button>
									<Input
										type="number"
										min={6}
										max={64}
										value={length}
										onChange={(e) =>
											setLength(Math.min(64, Math.max(6, parseInt(e.target.value, 10) || 6)))
										}
										className="h-7 w-12 rounded-none border-terminal-border p-0 text-center font-mono text-white text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
									/>
									<Button
										type="button"
										variant="outline"
										className="h-7 w-7 rounded-l-none border-terminal-border border-l-0 p-0 text-slate-400 hover:bg-terminal-border/20 hover:text-white"
										onClick={() => setLength((l) => Math.min(64, l + 1))}
									>
										+
									</Button>
								</div>
							</div>
						</div>

						{/* Toggles */}
						<div className="space-y-3 border-terminal-border border-t pt-4">
							<div className="flex items-center gap-2.5">
								<Checkbox
									id="uppercase"
									checked={uppercase}
									onCheckedChange={(checked) => setUppercase(checked === true)}
								/>
								<label
									htmlFor="uppercase"
									className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
								>
									UPPERCASE (A-Z)
								</label>
							</div>

							<div className="flex items-center gap-2.5">
								<Checkbox
									id="lowercase"
									checked={lowercase}
									onCheckedChange={(checked) => setLowercase(checked === true)}
								/>
								<label
									htmlFor="lowercase"
									className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
								>
									LOWERCASE (a-z)
								</label>
							</div>

							<div className="flex items-center gap-2.5">
								<Checkbox
									id="digits"
									checked={digits}
									onCheckedChange={(checked) => setDigits(checked === true)}
								/>
								<label
									htmlFor="digits"
									className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
								>
									NUMBERS (0-9)
								</label>
							</div>

							<div className="flex items-center gap-2.5">
								<Checkbox
									id="symbols"
									checked={symbols}
									onCheckedChange={(checked) => setSymbols(checked === true)}
								/>
								<label
									htmlFor="symbols"
									className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
								>
									SYMBOLS (!@#$...)
								</label>
							</div>

							<div className="flex items-center gap-2.5 border-terminal-border border-t pt-3">
								<Checkbox
									id="avoidAmbiguous"
									checked={avoidAmbiguous}
									onCheckedChange={(checked) => setAvoidAmbiguous(checked === true)}
								/>
								<label
									htmlFor="avoidAmbiguous"
									className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
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
				<div className="flex flex-col gap-3 rounded-sm border border-terminal-border bg-terminal-card/60 p-6">
					<div className="flex items-center justify-between font-bold text-slate-300 text-xs uppercase tracking-wider">
						<span>Password Strength:</span>
						<span
							className={cn(
								'rounded px-2 py-0.5 font-bold text-[10px] text-black',
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

					<div className="h-2 w-full overflow-hidden rounded-full border border-terminal-border bg-terminal-bg">
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
