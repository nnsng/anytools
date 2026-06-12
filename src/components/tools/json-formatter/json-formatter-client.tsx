import { useEffect, useState } from 'react'
import { Select } from '../../ui/select'
import { EditorPane } from '../shared/editor-pane'
import { PrismHighlighter } from '../shared/prism-highlighter'

export default function JsonFormatter() {
	const [input, setInput] = useState<string>(
		'{\n  "status": "online",\n  "system": "AnyTools OS",\n  "version": 1.0,\n  "features": [\n    "Formatter",\n    "Base64",\n    "Epoch Converter"\n  ],\n  "nested": {\n    "valid": true,\n    "errors": null\n  }\n}',
	)
	const [output, setOutput] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [indent, setIndent] = useState<string>('2')

	useEffect(() => {
		const processJson = (rawInput: string, indentVal: string) => {
			if (!rawInput.trim()) {
				setOutput('')
				setError(null)
				return
			}

			try {
				const parsed = JSON.parse(rawInput)
				const spaces =
					indentVal === 'minify'
						? 0
						: indentVal === 'tab'
							? '\t'
							: Number(indentVal)
				const formatted =
					indentVal === 'minify'
						? JSON.stringify(parsed)
						: JSON.stringify(parsed, null, spaces)

				setOutput(formatted)
				setError(null)
			} catch (err: any) {
				setError(err.message || 'Invalid JSON format')
				setOutput('')
			}
		}

		processJson(input, indent)
	}, [input, indent])

	return (
		<div className="grid h-[calc(100vh-220px)] min-h-[500px] grid-cols-1 gap-6 lg:grid-cols-2">
			<EditorPane
				title="Raw Input JSON"
				value={input}
				onChange={setInput}
				placeholder="Paste your JSON here..."
				allowUpload={true}
				error={error}
			/>

			<EditorPane
				title="Formatted Output"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName="formatted.json"
				actions={
					<div className="flex items-center gap-2">
						<Select
							className="h-8 px-2 py-1 text-xs"
							options={[
								{ value: '2', label: '2 Spaces' },
								{ value: '4', label: '4 Spaces' },
								{ value: 'tab', label: 'Tabs' },
								{ value: 'minify', label: 'Minify' },
							]}
							value={indent}
							onChange={(e) => setIndent(e.target.value)}
						/>
					</div>
				}
			>
				{output ? (
					<PrismHighlighter code={output} language="json" className="flex-1" />
				) : (
					<div className="flex flex-grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for valid JSON input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
