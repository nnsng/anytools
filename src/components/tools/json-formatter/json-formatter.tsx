import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { PrismHighlighter } from '@/components/tools/shared/prism-highlighter'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
				const spaces = indentVal === 'minify' ? 0 : Number(indentVal)
				const formatted =
					indentVal === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, spaces)

				setOutput(formatted)
				setError(null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Invalid JSON format')
				setOutput('')
			}
		}

		processJson(input, indent)
	}, [input, indent])

	return (
		<div className="flex flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Input"
				value={input}
				onChange={setInput}
				placeholder="Paste your JSON here..."
				allowUpload={true}
				error={error}
				className="lg:flex-1"
			/>

			<EditorPane
				title="Output"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName="formatted.json"
				actions={
					<Tabs value={indent} onValueChange={setIndent}>
						<TabsList>
							<TabsTrigger value="2">2 Spaces</TabsTrigger>
							<TabsTrigger value="4">4 Spaces</TabsTrigger>
							<TabsTrigger value="minify">Minify</TabsTrigger>
						</TabsList>
					</Tabs>
				}
				className="lg:flex-1"
			>
				{output ? (
					<PrismHighlighter code={output} language="json" className="flex-1" />
				) : (
					<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for valid JSON input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
