import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { PrismHighlighter } from '@/components/tools/shared/prism-highlighter'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APP_NAME } from '@/constants/app'
import { generateGo, generateJavascript, generatePython, parseCurl } from './curl-parsers'

export default function CurlToCode() {
	const [curlInput, setCurlInput] = useState<string>(
		`curl -X POST "https://api.${APP_NAME.toLowerCase()}.dev/v1/data" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer token123" \\\n  -d '{"name": "Neo", "status": "active"}'`,
	)
	const [activeTab, setActiveTab] = useState<string>('js')
	const [codeOutput, setCodeOutput] = useState<string>('')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!curlInput.trim()) {
			setCodeOutput('')
			setError(null)
			return
		}

		try {
			const parsed = parseCurl(curlInput)
			setError(null)

			if (activeTab === 'js') {
				setCodeOutput(generateJavascript(parsed))
			} else if (activeTab === 'python') {
				setCodeOutput(generatePython(parsed))
			} else if (activeTab === 'go') {
				setCodeOutput(generateGo(parsed))
			}
		} catch {
			setError('cURL parse failed. Check string structure.')
			setCodeOutput('')
		}
	}, [curlInput, activeTab])

	return (
		<div className="flex flex-col gap-6 lg:flex-row">
			<EditorPane
				title="cURL Command Input"
				value={curlInput}
				onChange={setCurlInput}
				placeholder="Paste your cURL command here..."
				allowUpload={true}
				error={error}
				className="lg:flex-1"
			/>

			<EditorPane
				title="Code Output"
				value={codeOutput}
				readOnly={true}
				allowDownload={true}
				downloadFileName={`request.${activeTab === 'js' ? 'js' : activeTab === 'python' ? 'py' : 'go'}`}
				actions={
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="js">JavaScript</TabsTrigger>
							<TabsTrigger value="python">Python</TabsTrigger>
							<TabsTrigger value="go">Go</TabsTrigger>
						</TabsList>
					</Tabs>
				}
				className="lg:flex-1"
			>
				{codeOutput ? (
					<PrismHighlighter
						code={codeOutput}
						language={
							activeTab === 'js'
								? 'javascript'
								: activeTab === 'python'
									? 'javascript'
									: 'typescript'
						} // Map to closest highlight rules
						className="flex-1"
					/>
				) : (
					<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for valid cURL input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
