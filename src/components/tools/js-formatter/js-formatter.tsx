import parserBabel from 'prettier/plugins/babel'
import parserEstree from 'prettier/plugins/estree'
import prettier from 'prettier/standalone'
import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

async function beautifyJs(rawCode: string): Promise<string> {
	if (!rawCode.trim()) return ''

	const formatted = await prettier.format(rawCode, {
		parser: 'babel',
		plugins: [parserBabel, parserEstree],
		semi: true,
		singleQuote: true,
		tabWidth: 2,
		trailingComma: 'es5',
	})
	return formatted
}

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
	const [activeTab, setActiveTab] = useState<string>('beautify')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!input.trim()) {
			setOutput('')
			setError(null)
			return
		}

		;(async () => {
			try {
				if (activeTab === 'beautify') {
					const result = await beautifyJs(input)
					setOutput(result)
				} else {
					setOutput(minifyJs(input))
				}
				setError(null)
			} catch (err) {
				console.dir(err)
				setError(err instanceof Error ? err.message : 'JS formatting failed.')
				setOutput('')
			}
		})()
	}, [input, activeTab])

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
				downloadFileName={activeTab === 'beautify' ? 'formatted.js' : 'minified.js'}
				actions={
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="beautify">Beautify</TabsTrigger>
							<TabsTrigger value="minify">Minify</TabsTrigger>
						</TabsList>
					</Tabs>
				}
				className="lg:flex-1"
			>
				{output ? (
					<CodeBlock className="flex-1">{output}</CodeBlock>
				) : (
					<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
