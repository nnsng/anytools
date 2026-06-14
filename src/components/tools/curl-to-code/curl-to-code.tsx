import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APP_NAME } from '@/constants/app'
import { generateAxios, generateFetch, parseCurl } from './curl-parsers'

type TabType = 'fetch' | 'axios'

export default function CurlToCode() {
	const [curlInput, setCurlInput] = useState<string>(
		`curl -X POST "https://api.${APP_NAME.toLowerCase()}.dev/v1/data" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer token123" \\\n  -d '{"name": "Neo", "status": "active"}'`,
	)
	const [activeTab, setActiveTab] = useState<TabType>('fetch')
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

			if (activeTab === 'fetch') {
				setCodeOutput(generateFetch(parsed))
			} else if (activeTab === 'axios') {
				setCodeOutput(generateAxios(parsed))
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
				downloadFileName="request.js"
				actions={
					<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
						<TabsList>
							<TabsTrigger value="fetch">Fetch API</TabsTrigger>
							<TabsTrigger value="axios">Axios</TabsTrigger>
						</TabsList>
					</Tabs>
				}
				className="lg:flex-1"
			>
				{codeOutput ? (
					<CodeBlock className="flex-1">{codeOutput}</CodeBlock>
				) : (
					<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for valid cURL input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
