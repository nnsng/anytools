import { useDeferredValue, useMemo, useState } from 'react'

import { CodeBlock, EditorPane } from '@/components/tools/shared'
import { Input } from '@/components/ui/input'
import { runConversion } from '@/lib/convert'

import { generateTsInterfaces } from './ts-generator'

export default function JsonToCode() {
	const [jsonInput, setJsonInput] = useState<string>(
		`{\n  "id": 101,\n  "title": "Inception",\n  "released": true,\n  "ratings": [8.8, 9.0, 8.5],\n  "director": {\n    "name": "Christopher Nolan",\n    "age": 53\n  },\n  "cast": [\n    {\n      "actor": "Leonardo DiCaprio",\n      "character": "Cobb"\n    }\n  ]\n}`,
	)
	const [interfaceName, setInterfaceName] = useState<string>('Movie')

	const deferredJson = useDeferredValue(jsonInput)

	const { output: codeOutput, error } = useMemo(() => {
		if (!deferredJson.trim()) return { output: '', error: null }
		return runConversion(() => {
			const formattedName = interfaceName.trim().replace(/[^a-zA-Z0-9]/g, '') || 'RootObject'
			return generateTsInterfaces(deferredJson, formattedName)
		}, 'Failed to parse JSON. Please check your syntax.')
	}, [deferredJson, interfaceName])

	return (
		<div className="flex flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Source JSON"
				value={jsonInput}
				onChange={setJsonInput}
				placeholder="Paste your JSON object here..."
				allowUpload={true}
				error={error}
				className="lg:flex-1"
			/>

			<EditorPane
				title="TypeScript Interfaces"
				value={codeOutput}
				readOnly={true}
				allowDownload={true}
				downloadFileName={`${interfaceName || 'models'}.ts`}
				actions={
					<div className="flex items-center gap-2 font-mono">
						<span className="text-xs font-bold text-slate-500 uppercase">Root:</span>
						<Input
							type="text"
							value={interfaceName}
							onChange={(e) => setInterfaceName(e.target.value)}
							className="border-terminal-border text-foreground h-8 w-32 font-mono text-xs"
						/>
					</div>
				}
				className="lg:flex-1"
			>
				<CodeBlock
					className="flex-1"
					value={codeOutput}
					placeholder="Waiting for valid JSON input..."
				/>
			</EditorPane>
		</div>
	)
}
