import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type NumberFieldProps = {
	id: string
	label: string
	value: number
	onChange: (value: number) => void
	min?: number
	max?: number
	step?: number
	className?: string
}

export function NumberField(props: NumberFieldProps) {
	const { id, label, value, onChange, min, max, step = 1, className } = props

	return (
		<div className={cn('flex flex-col gap-1', className)}>
			<label htmlFor={id} className="text-xs font-bold text-slate-500 uppercase">
				{label}
			</label>
			<Input
				id={id}
				type="number"
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={(e) =>
					onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)
				}
				className="border-terminal-border text-foreground h-8 font-mono text-xs"
			/>
		</div>
	)
}
