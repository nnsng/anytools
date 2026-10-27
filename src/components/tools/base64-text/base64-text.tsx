import { useDeferredValue, useMemo, useState } from 'react'

import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APP_NAME } from '@/constants/app'
import { runConversion } from '@/lib/convert'

const utf8Btoa = (str: string): string => {
	return btoa(
		encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
			return String.fromCharCode(parseInt(p1, 16))
		}),
	)
}

const utf8Atob = (str: string): string => {
	return decodeURIComponent(
		atob(str)
			.split('')
			.map((c) => {
				return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
			})
			.join(''),
	)
}

type ActiveTab = 'encode' | 'decode'

export default function Base64Text() {
	const [input, setInput] = useState<string>(`Welcome to ${APP_NAME}!`)
	const [activeTab, setActiveTab] = useState<ActiveTab>('encode')

	const deferredInput = useDeferredValue(input)

	const { output, error } = useMemo(() => {
		if (!deferredInput) return { output: '', error: null }
		return runConversion(() => {
			if (activeTab === 'encode') return utf8Btoa(deferredInput)
			const cleanValue = deferredInput.trim().replace(/\s/g, '')
			if (!/^[A-Za-z0-9+/=]*$/.test(cleanValue)) {
				throw new Error('Invalid Base64 characters detected')
			}
			return utf8Atob(cleanValue)
		}, 'Decryption/decoding failed. Make sure the input is a valid Base64 string.')
	}, [deferredInput, activeTab])

	// Swap input and output on tab switch
	const handleTabChange = (newTab: ActiveTab) => {
		setActiveTab(newTab)
		if (output && !error) setInput(output)
	}

	return (
		<Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col gap-4">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="encode">Encode Text</TabsTrigger>
				<TabsTrigger value="decode">Decode Base64</TabsTrigger>
			</TabsList>

			<div className="flex flex-1 flex-col gap-6 lg:flex-row">
				<EditorPane
					title={activeTab === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
					value={input}
					onChange={setInput}
					placeholder={
						activeTab === 'encode'
							? 'Enter plain text to encode...'
							: 'Enter Base64 string to decode...'
					}
					allowUpload={true}
					error={activeTab === 'decode' ? error : null}
					className="lg:flex-1"
				/>

				<EditorPane
					title={activeTab === 'encode' ? 'Base64 Output' : 'Plain Text Output'}
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName={activeTab === 'encode' ? 'encoded.txt' : 'decoded.txt'}
					error={activeTab === 'encode' ? error : null}
					className="lg:flex-1"
				/>
			</div>
		</Tabs>
	)
}
