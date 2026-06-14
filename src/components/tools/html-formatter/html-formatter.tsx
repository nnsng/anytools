import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { beautify, minify } from '@/utils/formatter'

export default function HtmlFormatter() {
	const [input, setInput] = useState<string>(
		`<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Demo Page</title>\n<style>body { font-family: sans-serif; }</style>\n</head>\n<body>\n<div class="card"><h1>Hello World</h1><p>Formatting HTML templates has never been easier.</p></div>\n<script>console.log("Hello from script tag!");</script>\n</body>\n</html>`,
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

		const processHtml = async () => {
			try {
				const result =
					activeTab === 'beautify' ? await beautify(input, 'html') : minify(input, 'html')
				setOutput(result)
				setError(null)
			} catch (err) {
				console.dir(err)
				setError(err instanceof Error ? err.message : 'HTML formatting failed.')
				setOutput('')
			}
		}

		processHtml()
	}, [input, activeTab])

	return (
		<div className="flex flex-1 flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Input"
				value={input}
				onChange={setInput}
				placeholder="Paste HTML code here..."
				allowUpload={true}
				error={error}
				className="lg:flex-1"
			/>

			<EditorPane
				title="Output"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName={activeTab === 'beautify' ? 'formatted.html' : 'minified.html'}
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
