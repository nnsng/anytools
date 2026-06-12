import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Select } from '@/components/ui/select'
import { Tabs } from '@/components/ui/tabs'

export default function UrlEncoder() {
	const [input, setInput] = useState<string>(
		'https://anytools.dev/search?q=developer tools&category=converters',
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
		<div className="space-y-4">
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<Tabs
					tabs={[
						{ id: 'encode', label: 'URL Encode' },
						{ id: 'decode', label: 'URL Decode' },
					]}
					activeTab={activeTab}
					onChange={handleTabChange}
				/>
				<div className="w-45">
					<Select
						label="Encode/Decode Mode"
						options={[
							{ value: 'component', label: 'All Characters (Component)' },
							{ value: 'full', label: 'Keep URL Structure (URI)' },
						]}
						value={encodeMode}
						onChange={(e) => setEncodeMode(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid h-[calc(100vh-270px)] min-h-[450px] grid-cols-1 gap-6 lg:grid-cols-2">
				<EditorPane
					title={activeTab === 'encode' ? 'Raw Input String' : 'Encoded Input URL'}
					value={input}
					onChange={setInput}
					placeholder={
						activeTab === 'encode'
							? 'Enter raw text to URL-encode...'
							: 'Enter URL-encoded string to decode...'
					}
					allowUpload={true}
					error={activeTab === 'decode' ? error : null}
				/>

				<EditorPane
					title={activeTab === 'encode' ? 'Encoded Output URL' : 'Decoded Output String'}
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName={activeTab === 'encode' ? 'url-encoded.txt' : 'url-decoded.txt'}
					error={activeTab === 'encode' ? error : null}
				/>
			</div>
		</div>
	)
}
