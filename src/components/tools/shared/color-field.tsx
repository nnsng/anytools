import { Input } from '@/components/ui/input'

type ColorFieldProps = {
	id: string
	label: string
	value: string
	onChange: (value: string) => void
	className?: string
}

export function ColorField({ id, label, value, onChange, className }: ColorFieldProps) {
	return (
		<div className={`flex flex-col gap-1 ${className ?? ''}`}>
			<label htmlFor={id} className="font-bold text-slate-500 uppercase">
				{label}
			</label>
			<div className="flex items-center gap-1.5">
				<input
					id={id}
					type="color"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="border-terminal-border h-7 w-7 cursor-pointer rounded border bg-transparent p-0"
				/>
				<Input
					type="text"
					aria-label={`${label} (hex)`}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="border-terminal-border text-foreground h-7 font-mono text-[10px]"
				/>
			</div>
		</div>
	)
}
