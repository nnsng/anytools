import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
		<Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col gap-4">
			<TabsList className="grid w-full grid-cols-2 border-terminal-border bg-terminal-bg/40 p-1">
				<TabsTrigger
					value="encode"
					className="border-none font-bold text-xs uppercase data-[state=active]:bg-matrix data-[state=active]:text-black"
				>
					HTML Entity Encode
				</TabsTrigger>
				<TabsTrigger
					value="decode"
					className="border-none font-bold text-xs uppercase data-[state=active]:bg-matrix data-[state=active]:text-black"
				>
					HTML Entity Decode
				</TabsTrigger>
			</TabsList>

			<div className="flex flex-1 flex-col gap-6 lg:flex-row">
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
					className="lg:flex-1"
				/>

				<EditorPane
					title={activeTab === 'encode' ? 'Encoded Output Entities' : 'Decoded Output HTML / Text'}
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName={activeTab === 'encode' ? 'html-encoded.txt' : 'html-decoded.txt'}
					className="lg:flex-1"
				/>
			</div>
		</Tabs>
	)
}
