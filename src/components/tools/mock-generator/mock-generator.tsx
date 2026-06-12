import { faker } from '@faker-js/faker'
import { useCallback, useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { PrismHighlighter } from '@/components/tools/shared/prism-highlighter'
import { type MockField, SchemaBuilder } from './schema-builder'

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

	const handleAddField = () => {
		setFields((prev) => [...prev, { name: `field_${prev.length + 1}`, type: 'name' }])
	}

	const handleRemoveField = (idx: number) => {
		setFields((prev) => prev.filter((_, i) => i !== idx))
	}

	const handleFieldChange = (idx: number, key: keyof MockField, val: string) => {
		setFields((prev) => {
			const copy = [...prev]
			copy[idx] = { ...copy[idx], [key]: val }
			return copy
		})
	}

	const generateData = useCallback(() => {
		faker.seed(Math.floor(Math.random() * 10000))

		const list = Array.from({ length: count }, () => {
			const record: Record<string, unknown> = {}
			for (const field of fields) {
				if (!field.name.trim()) continue
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
			}
			return record
		})

		setOutput(JSON.stringify(list, null, 2))
	}, [fields, count])

	useEffect(() => {
		generateData()
	}, [generateData])

	return (
		<div className="grid h-full grid-cols-1 gap-6 font-mono lg:grid-cols-12">
			<SchemaBuilder
				fields={fields}
				count={count}
				onAddField={handleAddField}
				onRemoveField={handleRemoveField}
				onFieldChange={handleFieldChange}
				onCountChange={setCount}
				onGenerate={generateData}
			/>

			{/* Code output */}
			<div className="flex h-full min-h-75 flex-col lg:col-span-7">
				<EditorPane
					title="Generated Dataset JSON"
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName="mock-data.json"
				>
					{output ? (
						<PrismHighlighter code={output} language="json" className="flex-1" />
					) : (
						<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
							Click Generate to forge data...
						</div>
					)}
				</EditorPane>
			</div>
		</div>
	)
}
