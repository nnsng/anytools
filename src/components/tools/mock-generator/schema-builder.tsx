import { Plus, Trash2 } from 'lucide-react'
import { Pane } from '@/components/tools/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

export type MockField = {
	name: string
	type: string
}

export const MOCK_FIELD_GROUPS = [
	{
		label: 'System & Identifiers',
		types: [
			{ value: 'uuid', label: 'UUID String' },
			{ value: 'number', label: 'Random Integer' },
			{ value: 'boolean', label: 'Boolean Value' },
			{ value: 'date', label: 'Recent Date' },
		],
	},
	{
		label: 'Personal & Identity',
		types: [
			{ value: 'name', label: 'Full Name' },
			{ value: 'firstName', label: 'First Name' },
			{ value: 'lastName', label: 'Last Name' },
			{ value: 'avatar', label: 'Avatar URL' },
			{ value: 'job', label: 'Job Title' },
		],
	},
	{
		label: 'Contact & Location',
		types: [
			{ value: 'email', label: 'Email Address' },
			{ value: 'phone', label: 'Phone Number' },
			{ value: 'website', label: 'Website URL' },
			{ value: 'address', label: 'Street Address' },
			{ value: 'company', label: 'Company Name' },
		],
	},
	{
		label: 'Text & Content',
		types: [
			{ value: 'lorem', label: 'Lorem Paragraph' },
			{ value: 'sentence', label: 'Lorem Sentence' },
			{ value: 'word', label: 'Single Word' },
		],
	},
	{
		label: 'Commerce & Finance',
		types: [
			{ value: 'amount', label: 'Amount / Price' },
			{ value: 'currency', label: 'Currency Code' },
		],
	},
	{
		label: 'Media & Design',
		types: [
			{ value: 'image', label: 'Image URL' },
			{ value: 'color', label: 'Color Name' },
		],
	},
]

export const MOCK_FIELD_TYPES = MOCK_FIELD_GROUPS.flatMap((group) => group.types)

type SchemaBuilderProps = {
	fields: MockField[]
	count: number
	onAddField: () => void
	onRemoveField: (idx: number) => void
	onFieldChange: (idx: number, key: keyof MockField, val: string) => void
	onCountChange: (count: number) => void
	onGenerate: () => void
	className?: string
}

export function SchemaBuilder(props: SchemaBuilderProps) {
	const {
		fields,
		count,
		onAddField,
		onRemoveField,
		onFieldChange,
		onCountChange,
		onGenerate,
		className,
	} = props

	return (
		<Pane
			title="Schema Definition"
			type="input"
			editor
			actions={
				<Button
					variant="ghost"
					size="sm"
					onClick={onAddField}
					className="flex h-7 items-center gap-1 px-2 text-xs"
				>
					<Plus className="h-3.5 w-3.5" /> ADD
				</Button>
			}
			className={className}
		>
			<div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
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
								<Select value={field.type} onValueChange={(v) => onFieldChange(idx, 'type', v)}>
									<SelectTrigger className="h-8 w-full text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="max-h-60 border-terminal-border bg-terminal-card font-mono text-xs">
										{MOCK_FIELD_GROUPS.map((group) => (
											<SelectGroup key={group.label}>
												<SelectLabel className="font-bold text-[10px] text-slate-500 uppercase">
													{group.label}
												</SelectLabel>
												{group.types.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectGroup>
										))}
									</SelectContent>
								</Select>
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
			<div className="flex flex-col gap-4 border-terminal-border border-t bg-terminal-bg/30 p-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex gap-3">
					<div className="flex items-center gap-3">
						<span className="font-bold text-slate-500 text-xs uppercase">Rows:</span>
						<div className="flex items-center">
							<Button
								variant="outline"
								size="sm"
								className="h-8 rounded-r-none border-r-0 px-2.5 text-slate-400 hover:text-white"
								onClick={() => onCountChange(Math.max(1, count - 1))}
							>
								-
							</Button>
							<Input
								type="number"
								min="1"
								max="500"
								value={count}
								onChange={(e) =>
									onCountChange(Math.min(500, Math.max(1, parseInt(e.target.value, 10) || 1)))
								}
								className="h-8 w-16 rounded-none border-terminal-border text-center font-mono text-xs [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
							/>
							<Button
								variant="outline"
								size="sm"
								className="h-8 rounded-l-none border-l-0 px-2.5 text-slate-400 hover:text-white"
								onClick={() => onCountChange(Math.min(500, count + 1))}
							>
								+
							</Button>
						</div>
					</div>
					<div className="flex items-center gap-1.5">
						{[10, 50, 100, 500].map((preset) => (
							<Button
								key={preset}
								variant={count === preset ? 'default' : 'outline'}
								size="sm"
								className="h-7 px-2 text-[10px]"
								onClick={() => onCountChange(preset)}
							>
								{preset}
							</Button>
						))}
					</div>
				</div>

				<Button onClick={onGenerate} className="flex h-8 items-center gap-1.5 px-4">
					<span>GENERATE</span>
				</Button>
			</div>
		</Pane>
	)
}
