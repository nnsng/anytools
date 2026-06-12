import { useEffect, useState } from 'react'
import { Tabs } from '../../ui/tabs'
import { EditorPane } from '../shared/editor-pane'

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
				return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`
			})
			.join(''),
	)
}

export default function Base64String() {
	const [input, setInput] = useState<string>('Welcome to AnyTools!')
	const [output, setOutput] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<string>('encode')

	useEffect(() => {
		const handleConvert = (val: string, mode: string) => {
			if (!val) {
				setOutput('')
				setError(null)
				return
			}

			try {
				if (mode === 'encode') {
					const encoded = utf8Btoa(val)
					setOutput(encoded)
					setError(null)
				} else {
					// Basic check for base64 characters
					const cleanVal = val.trim().replace(/\s/g, '')
					if (!/^[A-Za-z0-9+/=]*$/.test(cleanVal)) {
						throw new Error('Invalid Base64 characters detected')
					}
					const decoded = utf8Atob(cleanVal)
					setOutput(decoded)
					setError(null)
				}
			} catch (err: any) {
				setError(
					err.message ||
						'Decryption/decoding failed. Make sure the input is a valid Base64 string.',
				)
				setOutput('')
			}
		}

		handleConvert(input, activeTab)
	}, [input, activeTab])

	// Swap input and output on tab switch
	const handleTabChange = (newTab: string) => {
		setActiveTab(newTab)
		if (output && !error) {
			setInput(output)
			setOutput(input)
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Tabs
					tabs={[
						{ id: 'encode', label: 'Encode Text' },
						{ id: 'decode', label: 'Decode Base64' },
					]}
					activeTab={activeTab}
					onChange={handleTabChange}
				/>
			</div>

			<div className="grid h-[calc(100vh-270px)] min-h-[450px] grid-cols-1 gap-6 lg:grid-cols-2">
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
				/>

				<EditorPane
					title={activeTab === 'encode' ? 'Base64 Output' : 'Plain Text Output'}
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName={
						activeTab === 'encode' ? 'encoded.txt' : 'decoded.txt'
					}
					error={activeTab === 'encode' ? error : null}
				/>
			</div>
		</div>
	)
}
