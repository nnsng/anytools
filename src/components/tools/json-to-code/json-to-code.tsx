import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { PrismHighlighter } from '@/components/tools/shared/prism-highlighter'
import { Input } from '@/components/ui/input'
import { generateTsInterfaces } from './ts-generator'

export default function JsonToCode() {
	const [jsonInput, setJsonInput] = useState<string>(
		`{\n  "id": 101,\n  "title": "Inception",\n  "released": true,\n  "ratings": [8.8, 9.0, 8.5],\n  "director": {\n    "name": "Christopher Nolan",\n    "age": 53\n  },\n  "cast": [\n    {\n      "actor": "Leonardo DiCaprio",\n      "character": "Cobb"\n    }\n  ]\n}`,
	)
	const [interfaceName, setInterfaceName] = useState<string>('MovieResponse')
	const [tsOutput, setTsOutput] = useState<string>('')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!jsonInput.trim()) {
			setTsOutput('')
			setError(null)
			return
		}

		try {
			const formattedName = interfaceName.trim().replace(/[^a-zA-Z0-9]/g, '') || 'RootObject'
			const generated = generateTsInterfaces(jsonInput, formattedName)
			setTsOutput(generated)
			setError(null)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to parse JSON. Please check your syntax.',
			)
			setTsOutput('')
		}
	}, [jsonInput, interfaceName])

	return (
		<div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
			<EditorPane
				title="Source JSON"
				value={jsonInput}
				onChange={setJsonInput}
				placeholder="Paste your JSON object here..."
				allowUpload={true}
				error={error}
				actions={
					<div className="flex items-center gap-2">
						<span className="font-bold font-mono text-[10px] text-slate-500">ROOT NAME:</span>
						<Input
							type="text"
							value={interfaceName}
							onChange={(e) => setInterfaceName(e.target.value)}
							className="w-35 font-mono text-xs"
						/>
					</div>
				}
			/>

			<EditorPane
				title="TypeScript Interfaces"
				value={tsOutput}
				readOnly={true}
				allowDownload={true}
				downloadFileName={`${interfaceName || 'interfaces'}.ts`}
			>
				{tsOutput ? (
					<PrismHighlighter code={tsOutput} language="typescript" className="flex-1" />
				) : (
					<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for valid JSON input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
