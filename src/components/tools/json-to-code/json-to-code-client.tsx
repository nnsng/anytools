import { useEffect, useState } from 'react'
import { EditorPane } from '../shared/editor-pane'
import { PrismHighlighter } from '../shared/prism-highlighter'

const generateTsInterfaces = (jsonStr: string, rootName: string): string => {
	const parsed = JSON.parse(jsonStr)
	const interfaces: string[] = []

	// Track seen object shapes to generate separate interfaces
	const _typeRegistry: Record<string, string> = {}
	const _interfaceCounter = 0

	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

	const parseValueType = (val: any, keyName: string): string => {
		if (val === null) return 'any'
		if (typeof val === 'string') return 'string'
		if (typeof val === 'number') return 'number'
		if (typeof val === 'boolean') return 'boolean'

		if (Array.isArray(val)) {
			if (val.length === 0) return 'any[]'
			// Check types of array elements
			const elementTypes = new Set(val.map((item) => typeof item))
			if (elementTypes.size === 1) {
				const type = Array.from(elementTypes)[0]
				if (type === 'object') {
					const subName = `${capitalize(keyName)}Item`
					buildInterface(val[0], subName)
					return `${subName}[]`
				}
				return `${type}[]`
			}
			return 'any[]'
		}

		if (typeof val === 'object') {
			const subName = capitalize(keyName)
			buildInterface(val, subName)
			return subName
		}

		return 'any'
	}

	const buildInterface = (obj: any, name: string) => {
		const keys = Object.keys(obj)
		let interfaceStr = `interface ${name} {\n`

		keys.forEach((key) => {
			const typeStr = parseValueType(obj[key], key)
			interfaceStr += `  ${key}: ${typeStr};\n`
		})

		interfaceStr += '}'

		// Only push if not already generated
		if (!interfaces.includes(interfaceStr)) {
			interfaces.push(interfaceStr)
		}
	}

	buildInterface(parsed, rootName)
	// Reverse so dependencies come first
	return interfaces.reverse().join('\n\n')
}

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
			const formattedName =
				interfaceName.trim().replace(/[^a-zA-Z0-9]/g, '') || 'RootObject'
			const generated = generateTsInterfaces(jsonInput, formattedName)
			setTsOutput(generated)
			setError(null)
		} catch (err: any) {
			setError(err.message || 'Failed to parse JSON. Please check your syntax.')
			setTsOutput('')
		}
	}, [jsonInput, interfaceName])

	return (
		<div className="grid h-[calc(100vh-220px)] min-h-[500px] grid-cols-1 gap-6 lg:grid-cols-2">
			<EditorPane
				title="Source JSON"
				value={jsonInput}
				onChange={setJsonInput}
				placeholder="Paste your JSON object here..."
				allowUpload={true}
				error={error}
				actions={
					<div className="flex items-center gap-2">
						<span className="font-bold font-mono text-[10px] text-slate-500">
							ROOT NAME:
						</span>
						<input
							type="text"
							value={interfaceName}
							onChange={(e) => setInterfaceName(e.target.value)}
							className="w-[140px] rounded border border-terminal-border bg-terminal-bg px-2 py-1 font-mono text-white text-xs focus:border-matrix focus:outline-none"
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
					<PrismHighlighter
						code={tsOutput}
						language="typescript"
						className="flex-1"
					/>
				) : (
					<div className="flex flex-grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for valid JSON input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
