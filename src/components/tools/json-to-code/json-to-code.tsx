import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { PrismHighlighter } from '@/components/tools/shared/prism-highlighter'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateGoStructs } from './go-generator'
import { generateTsInterfaces } from './ts-generator'

export default function JsonToCode() {
	const [jsonInput, setJsonInput] = useState<string>(
		`{\n  "id": 101,\n  "title": "Inception",\n  "released": true,\n  "ratings": [8.8, 9.0, 8.5],\n  "director": {\n    "name": "Christopher Nolan",\n    "age": 53\n  },\n  "cast": [\n    {\n      "actor": "Leonardo DiCaprio",\n      "character": "Cobb"\n    }\n  ]\n}`,
	)
	const [interfaceName, setInterfaceName] = useState<string>('Movie')
	const [codeOutput, setCodeOutput] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [targetLang, setTargetLang] = useState<string>('typescript')

	useEffect(() => {
		if (!jsonInput.trim()) {
			setCodeOutput('')
			setError(null)
			return
		}

		try {
			const formattedName = interfaceName.trim().replace(/[^a-zA-Z0-9]/g, '') || 'RootObject'
			const generated =
				targetLang === 'typescript'
					? generateTsInterfaces(jsonInput, formattedName)
					: generateGoStructs(jsonInput, formattedName)
			setCodeOutput(generated)
			setError(null)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to parse JSON. Please check your syntax.',
			)
			setCodeOutput('')
		}
	}, [jsonInput, interfaceName, targetLang])

	return (
		<Tabs value={targetLang} onValueChange={setTargetLang} className="flex flex-col gap-4">
			<TabsList className="grid w-full grid-cols-2 border-terminal-border bg-terminal-bg/40 p-1">
				<TabsTrigger
					value="typescript"
					className="border-none font-bold text-xs uppercase data-[state=active]:bg-matrix data-[state=active]:text-black"
				>
					TypeScript Types
				</TabsTrigger>
				<TabsTrigger
					value="go"
					className="border-none font-bold text-xs uppercase data-[state=active]:bg-matrix data-[state=active]:text-black"
				>
					Go Struct
				</TabsTrigger>
			</TabsList>

			<div className="flex flex-1 flex-col gap-6 lg:flex-row">
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
					title={targetLang === 'typescript' ? 'TypeScript Types' : 'Go Structs'}
					value={codeOutput}
					readOnly={true}
					allowDownload={true}
					downloadFileName={`${interfaceName || 'models'}.${targetLang === 'typescript' ? 'ts' : 'go'}`}
					actions={
						<div className="flex items-center gap-2 font-mono">
							<span className="font-bold text-[10px] text-slate-500 uppercase">Root:</span>
							<Input
								type="text"
								value={interfaceName}
								onChange={(e) => setInterfaceName(e.target.value)}
								className="h-8 w-32 border-terminal-border font-mono text-white text-xs"
							/>
						</div>
					}
					className="lg:flex-1"
				>
					{codeOutput ? (
						<PrismHighlighter
							code={codeOutput}
							language={targetLang === 'typescript' ? 'typescript' : 'go'}
							className="flex-1"
						/>
					) : (
						<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
							Waiting for valid JSON input...
						</div>
					)}
				</EditorPane>
			</div>
		</Tabs>
	)
}
