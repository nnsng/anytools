import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export type MockField = {
	name: string
	type: string
}

export const MOCK_FIELD_TYPES = [
	{ value: 'uuid', label: 'UUID String' },
	{ value: 'name', label: 'Full Name' },
	{ value: 'email', label: 'Email Address' },
	{ value: 'phone', label: 'Phone Number' },
	{ value: 'company', label: 'Company Name' },
	{ value: 'date', label: 'Recent Date' },
	{ value: 'number', label: 'Random Number' },
	{ value: 'lorem', label: 'Lorem Paragraph' },
]

type SchemaBuilderProps = {
	fields: MockField[]
	count: number
	onAddField: () => void
	onRemoveField: (idx: number) => void
	onFieldChange: (idx: number, key: keyof MockField, val: string) => void
	onCountChange: (count: number) => void
	onGenerate: () => void
}

export function SchemaBuilder({
	fields,
	count,
	onAddField,
	onRemoveField,
	onFieldChange,
	onCountChange,
	onGenerate,
}: SchemaBuilderProps) {
	return (
		<div className="flex flex-col rounded-sm border border-terminal-border bg-terminal-card/60 lg:col-span-5">
			{/* Pane Header */}
			<div className="flex items-center justify-between border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
				<span className="flex items-center gap-2 font-bold font-mono text-slate-300 text-xs uppercase tracking-wider">
					<span className="h-1.5 w-1.5 rounded-full bg-matrix" />
					Schema Definition
				</span>
				<Button
					variant="ghost"
					size="sm"
					onClick={onAddField}
					className="flex h-7 items-center gap-1 px-2 text-xs"
				>
					<Plus className="h-3.5 w-3.5" /> ADD
				</Button>
			</div>

			{/* Builder Area */}
			<div className="scrollbar-thin max-h-87.5 flex-1 space-y-3 overflow-y-auto p-4 lg:max-h-none">
				{fields.length === 0 ? (
					<div className="py-8 text-center text-slate-600 text-xs">
						No fields defined. Add one above.
					</div>
				) : (
					fields.map((field, idx) => (
						<div
							key={idx}
							className="flex items-center gap-2 rounded-xs border border-terminal-border bg-terminal-bg/50 p-2"
						>
							<div className="w-[45%]">
								<Input
									value={field.name}
									onChange={(e) => onFieldChange(idx, 'name', e.target.value)}
									placeholder="Field Name"
									className="h-8 px-2 py-1 text-xs"
								/>
							</div>

							<div className="w-[45%]">
								<Select
									options={MOCK_FIELD_TYPES}
									value={field.type}
									onChange={(e) => onFieldChange(idx, 'type', e.target.value)}
									className="h-8 px-2 py-1 text-xs"
								/>
							</div>

							<div className="w-[10%] text-center">
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
									onClick={() => onRemoveField(idx)}
									title="Remove field"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</Button>
							</div>
						</div>
					))
				)}
			</div>

			{/* Action Panel */}
			<div className="flex items-center justify-between gap-4 border-terminal-border border-t bg-terminal-bg/30 p-4">
				<div className="flex items-center gap-2">
					<span className="font-bold text-slate-500 text-xs uppercase">ROWS:</span>
					<input
						type="number"
						min="1"
						max="500"
						value={count}
						onChange={(e) =>
							onCountChange(Math.min(500, Math.max(1, parseInt(e.target.value, 10) || 1)))
						}
						className="w-15 rounded border border-terminal-border bg-terminal-bg px-2 py-1 text-center font-mono text-white text-xs focus:border-matrix focus:outline-none"
					/>
				</div>

				<Button onClick={onGenerate} className="flex items-center gap-1.5 px-4 py-1.5">
					<span>GENERATE</span>
				</Button>
			</div>
		</div>
	)
}
