import { js_beautify as beautifyJs } from 'js-beautify'
import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

type Indent = '2' | '4' | 'minify' | (string & {})

const indentOptions: Array<{ value: Indent; label: string }> = [
	{ value: '2', label: '2 Spaces' },
	{ value: '4', label: '4 Spaces' },
	{ value: 'minify', label: 'Minify' },
]

function minifyJs(rawCode: string): string {
	return rawCode
		.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Strip comments
		.replace(/\s+/g, ' ') // Collapse whitespace
		.replace(/([{};,()[\]])\s+|\s+([{};,()[\]])/g, '$1$2') // Clean spacing around operators
		.trim()
}

export default function JavascriptFormatter() {
	const [input, setInput] = useState<string>(
		`// Simple JS Demo\nfunction greet(user) {\n  const message = "Hello, " + user.name + "!";\n  console.log(message);\n  return { success: true, timestamp: Date.now() };\n}`,
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

		const processJs = () => {
			try {
				const result =
					indent === 'minify' ? minifyJs(input) : beautifyJs(input, { indent_size: Number(indent) })
				setOutput(result)
				setError(null)
			} catch (err) {
				console.dir(err)
				setError(err instanceof Error ? err.message : 'JS formatting failed.')
				setOutput('')
			}
		}

		processJs()
	}, [input, indent])

	return (
		<div className="flex flex-1 flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Input"
				value={input}
				onChange={setInput}
				placeholder="Paste JavaScript code here..."
				allowUpload={true}
				error={error}
				className="lg:flex-1"
			/>

			<EditorPane
				title="Output"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName={indent === 'minify' ? 'minified.js' : 'formatted.js'}
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
				<CodeBlock className="flex-1" value={output} />
			</EditorPane>
		</div>
	)
}
