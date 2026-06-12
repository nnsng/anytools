import { faker } from '@faker-js/faker'
import { Play, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Select } from '../../ui/select'
import { EditorPane } from '../shared/editor-pane'
import { PrismHighlighter } from '../shared/prism-highlighter'

interface MockField {
	name: string
	type: string
}

export default function MockGenerator() {
	const [fields, setFields] = useState<MockField[]>([
		{ name: 'id', type: 'uuid' },
		{ name: 'fullName', type: 'name' },
		{ name: 'emailAddress', type: 'email' },
		{ name: 'companyName', type: 'company' },
		{ name: 'createdAt', type: 'date' },
	])

	const [count, setCount] = useState<number>(10)
	const [output, setOutput] = useState<string>('')

	const availableTypes = [
		{ value: 'uuid', label: 'UUID String' },
		{ value: 'name', label: 'Full Name' },
		{ value: 'email', label: 'Email Address' },
		{ value: 'phone', label: 'Phone Number' },
		{ value: 'company', label: 'Company Name' },
		{ value: 'date', label: 'Recent Date' },
		{ value: 'number', label: 'Random Number' },
		{ value: 'lorem', label: 'Lorem Paragraph' },
	]

	const handleAddField = () => {
		setFields((prev) => [
			...prev,
			{ name: `field_${prev.length + 1}`, type: 'name' },
		])
	}

	const handleRemoveField = (idx: number) => {
		setFields((prev) => prev.filter((_, i) => i !== idx))
	}

	const handleFieldChange = (
		idx: number,
		key: keyof MockField,
		val: string,
	) => {
		setFields((prev) => {
			const copy = [...prev]
			copy[idx] = { ...copy[idx], [key]: val }
			return copy
		})
	}

	const generateData = useCallback(() => {
		const list: any[] = []

		// Seed faker differently each time
		faker.seed(Math.floor(Math.random() * 10000))

		for (let i = 0; i < count; i++) {
			const record: Record<string, any> = {}
			fields.forEach((field) => {
				if (!field.name.trim()) return

				switch (field.type) {
					case 'uuid':
						record[field.name] = faker.string.uuid()
						break
					case 'name':
						record[field.name] = faker.person.fullName()
						break
					case 'email':
						record[field.name] = faker.internet.email()
						break
					case 'phone':
						record[field.name] = faker.phone.number()
						break
					case 'company':
						record[field.name] = faker.company.name()
						break
					case 'date':
						record[field.name] = faker.date.recent().toISOString()
						break
					case 'number':
						record[field.name] = faker.number.int({ min: 10, max: 10000 })
						break
					case 'lorem':
						record[field.name] = faker.lorem.paragraph(1)
						break
					default:
						record[field.name] = null
				}
			})
			list.push(record)
		}

		setOutput(JSON.stringify(list, null, 2))
	}, [fields, count])

	useEffect(() => {
		generateData()
	}, [generateData])

	return (
		<div className="grid h-[calc(100vh-220px)] min-h-[500px] grid-cols-1 gap-6 font-mono lg:grid-cols-12">
			{/* Schema builder */}
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
						onClick={handleAddField}
						className="flex h-7 items-center gap-1 px-2 text-xs"
					>
						<Plus className="h-3.5 w-3.5" /> ADD
					</Button>
				</div>

				{/* Builder Area */}
				<div className="scrollbar-thin max-h-[350px] flex-1 space-y-3 overflow-y-auto p-4 lg:max-h-none">
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
										onChange={(e) =>
											handleFieldChange(idx, 'name', e.target.value)
										}
										placeholder="Field Name"
										className="h-8 px-2 py-1 text-xs"
									/>
								</div>

								<div className="w-[45%]">
									<Select
										options={availableTypes}
										value={field.type}
										onChange={(e) =>
											handleFieldChange(idx, 'type', e.target.value)
										}
										className="h-8 px-2 py-1 text-xs"
									/>
								</div>

								<div className="w-[10%] text-center">
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
										onClick={() => handleRemoveField(idx)}
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
						<span className="font-bold text-slate-500 text-xs uppercase">
							ROWS:
						</span>
						<input
							type="number"
							min="1"
							max="500"
							value={count}
							onChange={(e) =>
								setCount(
									Math.min(500, Math.max(1, parseInt(e.target.value, 10) || 1)),
								)
							}
							className="w-[60px] rounded border border-terminal-border bg-terminal-bg px-2 py-1 text-center font-mono text-white text-xs focus:border-matrix focus:outline-none"
						/>
					</div>

					<Button
						onClick={generateData}
						className="flex items-center gap-1.5 px-4 py-1.5"
					>
						<Play className="h-3.5 w-3.5" /> GENERATE
					</Button>
				</div>
			</div>

			{/* Code output */}
			<div className="flex h-full min-h-[300px] flex-col lg:col-span-7">
				<EditorPane
					title="Generated Dataset JSON"
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName="mock-data.json"
				>
					{output ? (
						<PrismHighlighter
							code={output}
							language="json"
							className="flex-1"
						/>
					) : (
						<div className="flex flex-grow select-none items-center justify-center font-mono text-slate-600 text-xs">
							Click Generate to forge data...
						</div>
					)}
				</EditorPane>
			</div>
		</div>
	)
}
