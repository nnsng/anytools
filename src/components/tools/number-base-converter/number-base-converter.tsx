import { Check, Copy } from 'lucide-react'
import { useMemo, useState } from 'react'

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
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { ERROR_BOX_CLASS } from '@/lib/styles'
import { cn } from '@/lib/utils'

import { bitLength, formatInBase, MAX_BASE, MIN_BASE, parseInBase } from './utils'

type FieldId = 'bin' | 'oct' | 'dec' | 'hex' | 'custom'

const PRESET_FIELDS: Array<{ id: Exclude<FieldId, 'custom'>; label: string; base: number }> = [
	{ id: 'bin', label: 'Binary (2)', base: 2 },
	{ id: 'oct', label: 'Octal (8)', base: 8 },
	{ id: 'dec', label: 'Decimal (10)', base: 10 },
	{ id: 'hex', label: 'Hexadecimal (16)', base: 16 },
]

// Digits per group when "group digits" is on
const GROUP_SIZES: Record<number, number> = { 2: 4, 8: 3, 10: 3, 16: 4 }
const DEFAULT_GROUP_SIZE = 4
const BASE_OPTIONS = Array.from({ length: MAX_BASE - MIN_BASE + 1 }, (_, i) => MIN_BASE + i)

export default function NumberBaseConverter() {
	// Only the field being edited keeps its raw text; every other field is derived from the value
	const [edited, setEdited] = useState<{ id: FieldId; text: string }>({ id: 'dec', text: '255' })
	const [customBase, setCustomBase] = useState<number>(36)
	const [isGrouped, setIsGrouped] = useState<boolean>(false)
	const { copiedKey, copy } = useCopyToClipboard()

	const fields = [
		...PRESET_FIELDS,
		{ id: 'custom' as const, label: `Custom (${customBase})`, base: customBase },
	]
	const editedBase = fields.find((field) => field.id === edited.id)?.base ?? 10

	const { value, error } = useMemo(() => {
		try {
			return { value: parseInBase(edited.text, editedBase), error: null }
		} catch (err) {
			return { value: null, error: err instanceof Error ? err.message : 'Invalid number' }
		}
	}, [edited.text, editedBase])

	const displayText = (id: FieldId, base: number) => {
		if (id === edited.id) return edited.text
		if (value === null) return ''
		return formatInBase(value, base, isGrouped ? (GROUP_SIZES[base] ?? DEFAULT_GROUP_SIZE) : 0)
	}

	return (
		<Pane title="Number Base Converter" className="h-fit">
			<div className="flex flex-col gap-6 p-6">
				<div className="space-y-4">
					{fields.map((field) => {
						const text = displayText(field.id, field.base)
						return (
							<div key={field.id} className="grid grid-cols-1 items-center gap-2 md:grid-cols-12">
								<label
									htmlFor={`base-${field.id}`}
									className="text-xs font-bold text-slate-400 md:col-span-3"
								>
									{field.label}
								</label>
								<div className="md:col-span-7">
									<Input
										id={`base-${field.id}`}
										value={text}
										onChange={(e) => setEdited({ id: field.id, text: e.target.value })}
										spellCheck={false}
										autoComplete="off"
										aria-invalid={field.id === edited.id && error !== null}
										className="font-mono"
									/>
								</div>
								<div className="md:col-span-2">
									<Button
										variant="outline"
										disabled={!text}
										onClick={() => copy(text, field.id)}
										aria-label={`Copy ${field.label}`}
										className="flex w-full items-center justify-center gap-1.5 text-xs"
									>
										{copiedKey === field.id ? (
											<Check className="text-matrix h-3.5 w-3.5" />
										) : (
											<Copy className="h-3.5 w-3.5" />
										)}
										{copiedKey === field.id ? 'COPIED' : 'COPY'}
									</Button>
								</div>
							</div>
						)
					})}
				</div>

				{error && (
					<p role="alert" className={cn(ERROR_BOX_CLASS, 'p-2 text-xs')}>
						{error}
					</p>
				)}

				<div className="border-terminal-border flex flex-wrap items-center gap-6 border-t pt-4 text-xs">
					<div className="flex items-center gap-2">
						<label htmlFor="custom-base" className="font-bold text-slate-400">
							CUSTOM BASE
						</label>
						<Select
							value={String(customBase)}
							onValueChange={(next) => setCustomBase(Number(next))}
						>
							<SelectTrigger
								id="custom-base"
								className="border-terminal-border h-8 w-20 font-mono text-xs"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
								{BASE_OPTIONS.map((base) => (
									<SelectItem key={base} value={String(base)}>
										{base}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2.5">
						<Checkbox
							id="group-digits"
							checked={isGrouped}
							onCheckedChange={(checked) => setIsGrouped(checked === true)}
						/>
						<label
							htmlFor="group-digits"
							className="cursor-pointer font-semibold text-slate-300 select-none"
						>
							Group digits
						</label>
					</div>

					<span className="text-slate-500">
						BIT LENGTH:{' '}
						<span className="text-foreground font-bold">
							{value === null ? '-' : bitLength(value)}
						</span>
					</span>
				</div>
			</div>
		</Pane>
	)
}
