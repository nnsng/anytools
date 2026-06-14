import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { beautify, minify } from '@/utils/formatter'

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

		const processJs = async () => {
			try {
				const result = activeTab === 'beautify' ? await beautify(input, 'js') : minify(input, 'js')
				setOutput(result)
				setError(null)
			} catch (err) {
				console.dir(err)
				setError(err instanceof Error ? err.message : 'JS formatting failed.')
				setOutput('')
			}
		}

		processJs()
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
				<CodeBlock className="flex-1" value={output} />
			</EditorPane>
		</div>
	)
}
