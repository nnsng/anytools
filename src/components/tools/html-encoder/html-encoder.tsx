import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Tabs } from '@/components/ui/tabs'

const encodeHtml = (str: string): string => {
	return str.replace(/[\u00A0-\u9999<>&"']/g, (c) => {
		switch (c) {
			case '<':
				return '&lt;'
			case '>':
				return '&gt;'
			case '&':
				return '&amp;'
			case '"':
				return '&quot;'
			case "'":
				return '&#39;'
			default:
				return `&#${c.charCodeAt(0)};`
		}
	})
}

const decodeHtml = (str: string): string => {
	const doc = new DOMParser().parseFromString(str, 'text/html')
	return doc.documentElement.textContent || ''
}

export default function HtmlEncoder() {
	const [input, setInput] = useState<string>(
		'<div class="container">\n  <h1>Hello World & welcome!</h1>\n  <p>Cost: $10 & "tax"</p>\n</div>',
	)
	const [output, setOutput] = useState<string>('')
	const [activeTab, setActiveTab] = useState<string>('encode')

	useEffect(() => {
		const handleConvert = (val: string, mode: string) => {
			if (!val) {
				setOutput('')
				return
			}

			if (mode === 'encode') {
				setOutput(encodeHtml(val))
			} else {
				setOutput(decodeHtml(val))
			}
		}
		handleConvert(input, activeTab)
	}, [input, activeTab])

	const handleTabChange = (newTab: string) => {
		setActiveTab(newTab)
		if (output) {
			setInput(output)
			setOutput(input)
		}
	}

	return (
		<div className="space-y-4">
			<Tabs
				tabs={[
					{ id: 'encode', label: 'HTML Entity Encode' },
					{ id: 'decode', label: 'HTML Entity Decode' },
				]}
				activeTab={activeTab}
				onChange={handleTabChange}
			/>

			<div className="grid h-[calc(100vh-270px)] min-h-[450px] grid-cols-1 gap-6 lg:grid-cols-2">
				<EditorPane
					title={activeTab === 'encode' ? 'Raw HTML / Text Input' : 'HTML Entities Input'}
					value={input}
					onChange={setInput}
					placeholder={
						activeTab === 'encode'
							? 'Enter text/HTML to encode...'
							: 'Enter HTML entities to decode...'
					}
					allowUpload={true}
				/>

				<EditorPane
					title={activeTab === 'encode' ? 'Encoded Output Entities' : 'Decoded Output HTML / Text'}
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName={activeTab === 'encode' ? 'html-encoded.txt' : 'html-decoded.txt'}
				/>
			</div>
		</div>
	)
}
