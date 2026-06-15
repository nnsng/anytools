import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APP_NAME } from '@/constants/app'

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
	const [input, setInput] = useState<string>(`Welcome to ${APP_NAME}!`)
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
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'Decryption/decoding failed. Make sure the input is a valid Base64 string.',
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
		<Tabs
			value={activeTab}
			onValueChange={handleTabChange}
			variant="contained"
			size="lg"
			className="flex flex-col gap-4"
		>
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
