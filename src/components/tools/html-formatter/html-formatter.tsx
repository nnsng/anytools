import { html_beautify as beautifyHtml } from 'js-beautify'
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

function minifyHtml(rawCode: string): string {
	return rawCode
		.replace(/<!--[\s\S]*?-->/g, '') // Remove comments
		.replace(/\s+/g, ' ') // Collapse whitespace
		.replace(/>\s+</g, '><') // Collapse spaces between tags
		.trim()
}

export default function HtmlFormatter() {
	const [input, setInput] = useState<string>(
		`<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Demo Page</title>\n<style>body { font-family: sans-serif; }</style>\n</head>\n<body>\n<div class="card"><h1>Hello World</h1><p>Formatting HTML templates has never been easier.</p></div>\n<script>console.log("Hello from script tag!");</script>\n</body>\n</html>`,
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

		const processHtml = () => {
			try {
				const result =
					indent === 'minify'
						? minifyHtml(input)
						: beautifyHtml(input, { indent_size: Number(indent) })
				setOutput(result)
				setError(null)
			} catch (err) {
				console.dir(err)
				setError(err instanceof Error ? err.message : 'HTML formatting failed.')
				setOutput('')
			}
		}

		processHtml()
	}, [input, indent])

	return (
		<div className="flex flex-1 flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Input"
				value={input}
				onChange={setInput}
				placeholder="Paste HTML code here..."
				allowUpload={true}
				error={error}
				className="flex-1"
			/>

			<EditorPane
				title="Output"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName={indent === 'minify' ? 'minified.html' : 'formatted.html'}
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
