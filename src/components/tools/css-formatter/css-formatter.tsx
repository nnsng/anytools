import { css_beautify as beautifyCss } from 'js-beautify'
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

function minifyCss(rawCode: string): string {
	return rawCode
		.replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
		.replace(/\s+/g, ' ') // Collapse whitespace
		.replace(/ ?([{}:;,]) ?/g, '$1') // Remove spacing around symbols
		.replace(/;}/g, '}') // Remove trailing semicolons
		.trim()
}

export default function CssFormatter() {
	const [input, setInput] = useState<string>(
		`/* CSS Demo */\nbody { background-color: #08090c; color: #ffffff; font-family: sans-serif; }\n.card { margin: 2rem auto; padding: 1.5rem; border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 4px; max-width: 500px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); }\n.card h1 { font-size: 1.5rem; margin-bottom: 1rem; color: #22c55e; }`,
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

		const processCss = () => {
			try {
				const result =
					indent === 'minify'
						? minifyCss(input)
						: beautifyCss(input, { indent_size: Number(indent) })
				setOutput(result)
				setError(null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'CSS formatting failed.')
				setOutput('')
			}
		}

		processCss()
	}, [input, indent])

	return (
		<div className="flex flex-1 flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Input"
				value={input}
				onChange={setInput}
				placeholder="Paste CSS code here..."
				allowUpload={true}
				error={error}
				className="flex-1"
			/>

			<EditorPane
				title="Output"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName={indent === 'minify' ? 'minified.css' : 'formatted.css'}
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
				className="flex-1"
			>
				<CodeBlock className="flex-1" value={output} />
			</EditorPane>
		</div>
	)
}
