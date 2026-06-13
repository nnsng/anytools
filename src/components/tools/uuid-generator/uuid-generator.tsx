import { useState } from 'react'
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

function generateV1Uuid(): string {
	const msecs = Date.now()
	const clockseq = Math.floor(Math.random() * 0x3fff)
	const node = [0x01, 0x23, 0x45, 0x67, 0x89, 0xab]

	const timeLow = (msecs & 0xffffffff).toString(16).padStart(8, '0')
	const timeMid = ((msecs / 0x100000000) & 0xffff).toString(16).padStart(4, '0')
	const timeHi = (((msecs / 0x1000000000000) & 0x0fff) | 0x1000).toString(16).padStart(4, '0')
	const clockSeqHi = ((clockseq >> 8) | 0x80).toString(16).padStart(2, '0')
	const clockSeqLow = (clockseq & 0xff).toString(16).padStart(2, '0')
	const nodeStr = node.map((b) => b.toString(16).padStart(2, '0')).join('')

	return `${timeLow}-${timeMid}-${timeHi}-${clockSeqHi}${clockSeqLow}-${nodeStr}`
}

function generateV4Uuid(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID()
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

export default function UuidGenerator() {
	const [version, setVersion] = useState<string>('v4')
	const [quantity, setQuantity] = useState<number>(5)
	const [uppercase, setUppercase] = useState<boolean>(false)
	const [braces, setBraces] = useState<boolean>(false)
	const [hyphens, setHyphens] = useState<boolean>(true)
	const [output, setOutput] = useState<string>('')

	const handleGenerate = () => {
		const uuids: string[] = []
		for (let i = 0; i < quantity; i++) {
			let uuid = version === 'v4' ? generateV4Uuid() : generateV1Uuid()
			if (!hyphens) {
				uuid = uuid.replace(/-/g, '')
			}
			if (uppercase) {
				uuid = uuid.toUpperCase()
			}
			if (braces) {
				uuid = `{${uuid}}`
			}
			uuids.push(uuid)
		}
		setOutput(uuids.join('\n'))
	}

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
			{/* Configurations */}
			<Pane title="UUID Settings" className="lg:flex-1">
				<div className="flex flex-col gap-6 p-6">
					<div className="space-y-4 text-xs">
						{/* Version selection */}
						<div className="flex flex-col gap-1">
							<label htmlFor="select-version" className="font-bold text-slate-500 uppercase">
								UUID Version
							</label>
							<Select value={version} onValueChange={setVersion}>
								<SelectTrigger
									id="select-version"
									className="h-8 w-full border-terminal-border font-mono text-xs"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									<SelectItem value="v4">Version 4 (Random)</SelectItem>
									<SelectItem value="v1">Version 1 (Time-based)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Quantity */}
						<div className="flex flex-col gap-1">
							<label htmlFor="input-quantity" className="font-bold text-slate-500 uppercase">
								Quantity (1-100)
							</label>
							<div className="flex items-center">
								<Button
									type="button"
									variant="outline"
									className="h-8 w-8 rounded-r-none border-terminal-border border-r-0 text-slate-400 hover:bg-terminal-border/20 hover:text-white"
									onClick={() => setQuantity((q) => Math.max(1, q - 1))}
								>
									-
								</Button>
								<Input
									id="input-quantity"
									type="number"
									min={1}
									max={100}
									value={quantity}
									onChange={(e) =>
										setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))
									}
									className="h-8 w-full rounded-none border-terminal-border text-center font-mono text-white text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								/>
								<Button
									type="button"
									variant="outline"
									className="h-8 w-8 rounded-l-none border-terminal-border border-l-0 text-slate-400 hover:bg-terminal-border/20 hover:text-white"
									onClick={() => setQuantity((q) => Math.min(100, q + 1))}
								>
									+
								</Button>
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
									UPPERCASE
								</label>
							</div>

							<div className="flex items-center gap-2.5">
								<Checkbox
									id="braces"
									checked={braces}
									onCheckedChange={(checked) => setBraces(checked === true)}
								/>
								<label
									htmlFor="braces"
									className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
								>
									WRAP IN BRACES {'{}'}
								</label>
							</div>

							<div className="flex items-center gap-2.5">
								<Checkbox
									id="hyphens"
									checked={hyphens}
									onCheckedChange={(checked) => setHyphens(checked === true)}
								/>
								<label
									htmlFor="hyphens"
									className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
								>
									INCLUDE HYPHENS
								</label>
							</div>
						</div>
					</div>

					<Button onClick={handleGenerate} className="mt-auto h-9 w-full">
						GENERATE
					</Button>
				</div>
			</Pane>

			{/* Output */}
			<EditorPane
				title="Generated UUIDs"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName="uuids.txt"
				placeholder="Click Generate to produce UUIDs..."
				className="lg:flex-2 lg:self-stretch"
			/>
		</div>
	)
}
