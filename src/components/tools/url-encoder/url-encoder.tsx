import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function UrlEncoder() {
	const [input, setInput] = useState<string>(
		`${window.location.origin}/search?q=developer tools&category=converters`,
	)
	const [output, setOutput] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<string>('encode')
	const [encodeMode, setEncodeMode] = useState<string>('component') // 'component' or 'full'

	useEffect(() => {
		const handleConvert = (val: string, mode: string, type: string) => {
			if (!val) {
				setOutput('')
				setError(null)
				return
			}

			try {
				if (mode === 'encode') {
					const encoded = type === 'component' ? encodeURIComponent(val) : encodeURI(val)
					setOutput(encoded)
					setError(null)
				} else {
					const decoded = type === 'component' ? decodeURIComponent(val) : decodeURI(val)
					setOutput(decoded)
					setError(null)
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'URL conversion failed. Verify input syntax.')
				setOutput('')
			}
		}

		handleConvert(input, activeTab, encodeMode)
	}, [input, activeTab, encodeMode])

	const handleTabChange = (newTab: string) => {
		setActiveTab(newTab)
		if (output && !error) {
			setInput(output)
			setOutput(input)
		}
	}

	return (
		<Tabs
			value={activeTab}
			onValueChange={handleTabChange}
			variant="contained"
			size="lg"
			className="flex h-full flex-col gap-4"
		>
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="encode">URL Encode</TabsTrigger>
				<TabsTrigger value="decode">URL Decode</TabsTrigger>
			</TabsList>

			<div className="flex flex-1 flex-col gap-6 lg:flex-row">
				<EditorPane
					title={activeTab === 'encode' ? 'Raw Input String' : 'Encoded Input URL'}
					value={input}
					onChange={setInput}
					placeholder={
						activeTab === 'encode'
							? 'Enter raw text to URL-encode...'
							: 'Enter URL-encoded string to decode...'
					}
					allowUpload={false}
					error={activeTab === 'decode' ? error : null}
					className="lg:flex-1"
				/>

				<EditorPane
					title={activeTab === 'encode' ? 'Encoded Output URL' : 'Decoded Output String'}
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName={activeTab === 'encode' ? 'url-encoded.txt' : 'url-decoded.txt'}
					error={activeTab === 'encode' ? error : null}
					actions={
						<div className="min-w-48">
							<Select value={encodeMode} onValueChange={setEncodeMode}>
								<SelectTrigger className="h-8 border-terminal-border font-mono text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									<SelectItem value="component">Component (Encode All)</SelectItem>
									<SelectItem value="full">URI (Keep Structure)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					}
					className="flex-1"
				/>
			</div>
		</Tabs>
	)
}
