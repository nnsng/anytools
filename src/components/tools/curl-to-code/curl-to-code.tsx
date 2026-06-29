import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { APP_NAME } from '@/constants/app'
import { generateAxios, generateFetch, parseCurl } from './curl-parsers'

type TabType = 'fetch' | 'axios'

const options = [
	{ value: 'fetch', label: 'Fetch API' },
	{ value: 'axios', label: 'Axios' },
]

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
					<Select value={activeTab} onValueChange={setActiveTab}>
						<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
							{options.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				}
				className="lg:flex-1"
			>
				<CodeBlock
					className="flex-1"
					value={codeOutput}
					placeholder="Waiting for valid cURL input..."
				/>
			</EditorPane>
		</div>
	)
}
