import { useMemo, useState } from 'react'

import { CodeBlock, EditorPane } from '@/components/tools/shared'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

import { type MockField, SchemaBuilder } from './schema-builder'
import { generateRecords } from './utils'

export default function MockDataGenerator() {
	const [fields, setFields] = useState<MockField[]>([
		{ name: 'id', type: 'uuid' },
		{ name: 'fullName', type: 'name' },
		{ name: 'emailAddress', type: 'email' },
		{ name: 'companyName', type: 'company' },
		{ name: 'createdAt', type: 'date' },
	])

	const [count, setCount] = useState<number>(10)

	const handleAddField = () => {
		setFields((prev) => [...prev, { name: `field_${prev.length + 1}`, type: 'name' }])
	}

	const handleRemoveField = (idx: number) => {
		setFields((prev) => prev.filter((_, i) => i !== idx))
	}

	const handleFieldChange = (idx: number, key: keyof MockField, val: string) => {
		setFields((prev) => {
			const current = prev[idx]
			if (!current) return prev
			const copy = [...prev]
			copy[idx] = { ...current, [key]: val }
			return copy
		})
	}

	// Bumped by the Generate button to force a fresh dataset with the same schema
	const [generation, setGeneration] = useState<number>(0)
	const generateData = () => setGeneration((value) => value + 1)

	// Typing a field name or count shouldn't regenerate hundreds of records per keystroke
	const debouncedSchema = useDebouncedValue({ fields, count }, 300)

	const output = useMemo(() => {
		void generation
		return JSON.stringify(generateRecords(debouncedSchema.fields, debouncedSchema.count), null, 2)
	}, [debouncedSchema, generation])

	return (
		<div className="flex flex-col gap-6 lg:h-full lg:min-h-0 lg:flex-row">
			<SchemaBuilder
				fields={fields}
				count={count}
				onAddField={handleAddField}
				onRemoveField={handleRemoveField}
				onFieldChange={handleFieldChange}
				onCountChange={setCount}
				onGenerate={generateData}
				className="flex-1 lg:min-h-0"
			/>

			<EditorPane
				title="Generated Dataset JSON"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName="mock-data.json"
				className="flex-1 lg:min-h-0"
			>
				<CodeBlock
					className="flex-1"
					value={output}
					placeholder="Click Generate to forge data..."
				/>
			</EditorPane>
		</div>
	)
}
