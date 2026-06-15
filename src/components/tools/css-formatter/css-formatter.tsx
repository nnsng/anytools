import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { beautify, minify } from '@/utils/formatter'

export default function CssFormatter() {
	const [input, setInput] = useState<string>(
		`/* CSS Demo */\nbody { background-color: #08090c; color: #ffffff; font-family: sans-serif; }\n.card { margin: 2rem auto; padding: 1.5rem; border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 4px; max-width: 500px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); }\n.card h1 { font-size: 1.5rem; margin-bottom: 1rem; color: #22c55e; }`,
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

		const processCss = async () => {
			try {
				const result =
					activeTab === 'beautify' ? await beautify(input, 'css') : minify(input, 'css')
				setOutput(result)
				setError(null)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'CSS formatting failed.')
				setOutput('')
			}
		}

		processCss()
	}, [input, activeTab])

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
				downloadFileName={activeTab === 'beautify' ? 'formatted.css' : 'minified.css'}
				actions={
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="beautify">Beautify</TabsTrigger>
							<TabsTrigger value="minify">Minify</TabsTrigger>
						</TabsList>
					</Tabs>
				}
				className="flex-1"
			>
				<CodeBlock className="flex-1" value={output} />
			</EditorPane>
		</div>
	)
}
