import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { APP_NAME } from '@/constants/app'

type Indent = '2' | '4' | 'minify'

const indentOptions: Array<{ value: Indent; label: string }> = [
	{ value: '2', label: '2 Spaces' },
	{ value: '4', label: '4 Spaces' },
	{ value: 'minify', label: 'Minify' },
]

export default function JsonFormatter() {
	const [input, setInput] = useState<string>(
		`{\n  "status": "online",\n  "system": "${APP_NAME} OS",\n  "version": 1.0,\n  "features": [\n    "Formatter",\n    "Base64",\n    "Epoch Converter"\n  ],\n  "nested": {\n    "valid": true,\n    "errors": null\n  }\n}`,
	)
	const [output, setOutput] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [indent, setIndent] = useState<Indent>('2')

	useEffect(() => {
		if (!input.trim()) {
			setOutput('')
			setError(null)
			return
		}

		const processJson = () => {
			try {
				const parsed = JSON.parse(input)
				const result =
					indent === 'minify'
						? JSON.stringify(parsed)
						: JSON.stringify(parsed, null, Number(indent))

				setOutput(result)
				setError(null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Invalid JSON format')
				setOutput('')
			}
		}

		processJson()
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
				downloadFileName={indent === 'minify' ? 'minified.json' : 'formatted.json'}
				actions={
					<Select value={indent} onValueChange={setIndent}>
						<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
							{indentOptions.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				}
				className="lg:flex-1"
			>
				<CodeBlock
					className="flex-1"
					value={output}
					placeholder="Waiting for valid JSON input..."
				/>
			</EditorPane>
		</div>
	)
}
