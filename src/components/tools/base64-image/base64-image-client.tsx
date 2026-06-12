import { Download, FileImage, Upload } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../ui/button'
import { Tabs } from '../../ui/tabs'
import { EditorPane } from '../shared/editor-pane'

export default function Base64Image() {
	const [activeTab, setActiveTab] = useState<string>('encode')

	// Encode side (Image to string)
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [imagePreview, setImagePreview] = useState<string>('')
	const [base64Output, setBase64Output] = useState<string>('')
	const [encodeError, setEncodeError] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Decode side (String to image)
	const [base64Input, setBase64Input] = useState<string>('')
	const [decodedSrc, setDecodedSrc] = useState<string>('')
	const [decodeError, setDecodeError] = useState<string | null>(null)

	// Encoding logic
	const handleFileChange = (file: File) => {
		if (!file.type.startsWith('image/')) {
			setEncodeError('Selected file is not an image.')
			return
		}
		setEncodeError(null)
		setImageFile(file)

		const reader = new FileReader()
		reader.onload = (e) => {
			const result = e.target?.result as string
			setImagePreview(result)
			setBase64Output(result)
		}
		reader.readAsDataURL(file)
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		const file = e.dataTransfer.files?.[0]
		if (file) handleFileChange(file)
	}

	// Decoding logic
	useEffect(() => {
		if (activeTab === 'decode') {
			const val = base64Input.trim()
			if (!val) {
				setDecodedSrc('')
				setDecodeError(null)
				return
			}

			// Add standard base64 image prefix if missing
			let src = val
			if (!val.startsWith('data:image/')) {
				// Try to guess extension
				if (val.startsWith('iVBORw0KGgo')) {
					src = `data:image/png;base64,${val}`
				} else if (val.startsWith('/9j/')) {
					src = `data:image/jpeg;base64,${val}`
				} else if (val.startsWith('R0lGOD')) {
					src = `data:image/gif;base64,${val}`
				} else if (val.startsWith('UklGR')) {
					src = `data:image/webp;base64,${val}`
				} else {
					src = `data:image/png;base64,${val}` // fallback
				}
			}

			// Verify if it is valid
			const img = new window.Image()
			img.onload = () => {
				setDecodedSrc(src)
				setDecodeError(null)
			}
			img.onerror = () => {
				setDecodeError(
					'Failed to parse image from Base64 string. Ensure it is a valid format.',
				)
				setDecodedSrc('')
			}
			img.src = src
		}
	}, [base64Input, activeTab])

	const handleDownloadDecoded = () => {
		if (!decodedSrc) return
		const link = document.createElement('a')
		link.href = decodedSrc
		// Guess file extension
		const mime = decodedSrc.match(/data:(image\/[a-zA-Z+]+);base64,/)
		const ext = mime ? mime[1].split('/')[1] : 'png'
		link.download = `decoded-image.${ext}`
		link.click()
	}

	return (
		<div className="space-y-4 font-mono">
			<Tabs
				tabs={[
					{ id: 'encode', label: 'Image to Base64' },
					{ id: 'decode', label: 'Base64 to Image' },
				]}
				activeTab={activeTab}
				onChange={setActiveTab}
			/>

			{activeTab === 'encode' ? (
				<div className="grid min-h-[450px] grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Drag & Drop Area */}
					<div className="flex flex-col justify-between space-y-4 rounded-sm border border-terminal-border bg-terminal-card/60 p-6">
						<div className="space-y-2">
							<span className="flex items-center gap-2 font-bold text-slate-300 text-xs uppercase tracking-wider">
								<span className="h-1.5 w-1.5 rounded-full bg-matrix" />
								Select Image File
							</span>
							<p className="text-slate-400 text-xs">
								Drag & drop or upload an image file (PNG, JPG, WEBP, GIF, SVG).
							</p>
						</div>

						<div
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
							className="flex min-h-[220px] flex-1 cursor-pointer flex-col items-center justify-center rounded border-2 border-terminal-border border-dashed bg-terminal-bg/40 p-6 transition-all duration-150 hover:border-matrix/40 hover:bg-terminal-bg/80"
						>
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								accept="image/*"
								onChange={(e) => {
									const file = e.target.files?.[0]
									if (file) handleFileChange(file)
								}}
							/>

							{imagePreview ? (
								<div className="relative max-h-[200px] max-w-full overflow-hidden rounded border border-terminal-border">
									<img
										src={imagePreview}
										alt="Preview"
										className="max-h-[180px] w-auto object-contain"
									/>
								</div>
							) : (
								<div className="space-y-3 text-center">
									<Upload className="pulse-fast mx-auto h-8 w-8 text-slate-600" />
									<span className="font-bold text-slate-500 text-xs">
										DRAG & DROP IMAGE FILE OR CLICK TO BROWSE
									</span>
								</div>
							)}
						</div>

						{imageFile && (
							<div className="space-y-1 rounded border border-terminal-border bg-terminal-bg p-3 text-[11px] text-slate-400">
								<div>
									FILENAME:{' '}
									<span className="font-bold text-white">{imageFile.name}</span>
								</div>
								<div>
									FILESIZE:{' '}
									<span className="font-bold text-white">
										{(imageFile.size / 1024).toFixed(2)} KB
									</span>
								</div>
								<div>
									TYPE:{' '}
									<span className="font-bold text-white">{imageFile.type}</span>
								</div>
							</div>
						)}

						{encodeError && (
							<p className="text-red-400 text-xs">{encodeError}</p>
						)}
					</div>

					{/* Base64 Output */}
					<EditorPane
						title="Base64 Output String"
						value={base64Output}
						readOnly={true}
						allowDownload={true}
						downloadFileName="image-base64.txt"
						placeholder="Base64 output string will appear here..."
					/>
				</div>
			) : (
				<div className="grid min-h-[450px] grid-cols-1 gap-6 lg:grid-cols-2">
					{/* Base64 Input */}
					<EditorPane
						title="Base64 Input String"
						value={base64Input}
						onChange={setBase64Input}
						placeholder="Paste your Base64 string (with or without data URI prefix) here..."
						allowUpload={true}
						error={decodeError}
					/>

					{/* Image Preview */}
					<div className="flex flex-col justify-between space-y-4 rounded-sm border border-terminal-border bg-terminal-card/60 p-6">
						<div className="flex items-center justify-between border-terminal-border border-b pb-2">
							<span className="flex items-center gap-2 font-bold text-slate-300 text-xs uppercase tracking-wider">
								<span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
								Decoded Image Preview
							</span>

							{decodedSrc && (
								<Button
									variant="outline"
									size="sm"
									onClick={handleDownloadDecoded}
									className="flex items-center gap-1.5 py-1 text-xs"
								>
									<Download className="h-3.5 w-3.5" /> DOWNLOAD IMAGE
								</Button>
							)}
						</div>

						<div className="flex min-h-[200px] flex-1 items-center justify-center rounded border border-terminal-border bg-terminal-bg/40 p-4">
							{decodedSrc ? (
								<div className="relative max-h-[300px] max-w-full overflow-hidden rounded border border-terminal-border bg-[size:16px_16px] bg-checkered">
									<img
										src={decodedSrc}
										alt="Decoded preview"
										className="max-h-[280px] object-contain"
									/>
								</div>
							) : (
								<div className="space-y-2 text-center text-slate-600">
									<FileImage className="mx-auto h-8 w-8" />
									<span className="text-xs">
										Waiting for valid Base64 string input...
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
