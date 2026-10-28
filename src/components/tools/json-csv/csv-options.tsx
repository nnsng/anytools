import { Checkbox } from '@/components/ui/checkbox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import type { Delimiter } from './utils'

const DELIMITERS: Array<{ value: Delimiter; label: string }> = [
	{ value: ',', label: 'Comma ( , )' },
	{ value: ';', label: 'Semicolon ( ; )' },
	{ value: '\t', label: 'Tab' },
	{ value: '|', label: 'Pipe ( | )' },
]

function isDelimiter(value: string): value is Delimiter {
	return DELIMITERS.some((option) => option.value === value)
}

type CheckboxOption = {
	id: string
	label: string
	checked: boolean
	onChange: (value: boolean) => void
}

type CsvOptionsProps = {
	delimiter: Delimiter
	onDelimiterChange: (delimiter: Delimiter) => void
	checkboxes: CheckboxOption[]
}

export function CsvOptions({ delimiter, onDelimiterChange, checkboxes }: CsvOptionsProps) {
	return (
		<div className="border-terminal-border bg-terminal-card/60 flex flex-wrap items-center gap-6 rounded-sm border px-4 py-3 text-xs">
			<div className="flex items-center gap-2">
				<label htmlFor="csv-delimiter" className="font-bold text-slate-400 uppercase">
					Delimiter
				</label>
				<Select
					value={delimiter}
					onValueChange={(value) => {
						if (isDelimiter(value)) onDelimiterChange(value)
					}}
				>
					<SelectTrigger
						id="csv-delimiter"
						className="border-terminal-border h-8 w-44 font-mono text-xs"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
						{DELIMITERS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{checkboxes.map((option) => (
				<div key={option.id} className="flex items-center gap-2.5">
					<Checkbox
						id={option.id}
						checked={option.checked}
						onCheckedChange={(checked) => option.onChange(checked === true)}
					/>
					<label
						htmlFor={option.id}
						className="cursor-pointer font-semibold text-slate-300 select-none"
					>
						{option.label}
					</label>
				</div>
			))}
		</div>
	)
}
