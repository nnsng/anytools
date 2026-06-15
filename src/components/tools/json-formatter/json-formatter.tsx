import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APP_NAME } from '@/constants/app'

type Indent = '2' | '4' | 'minify'

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
					<Tabs value={indent} onValueChange={(v) => setIndent(v as Indent)}>
						<TabsList>
							<TabsTrigger value="2">2 Spaces</TabsTrigger>
							<TabsTrigger value="4">4 Spaces</TabsTrigger>
							<TabsTrigger value="minify">Minify</TabsTrigger>
						</TabsList>
					</Tabs>
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
