import { Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'

interface EncodeTabProps {
	onFileChange: (file: File) => void
}

export function EncodeTab({ onFileChange }: EncodeTabProps) {
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [imagePreview, setImagePreview] = useState<string>('')
	const [base64Output, setBase64Output] = useState<string>('')
	const [encodeError, setEncodeError] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (file: File) => {
		if (!file.type.startsWith('image/')) {
			setEncodeError('Selected file is not an image.')
			return
		}
		setEncodeError(null)
		setImageFile(file)
		onFileChange(file)

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

	return (
		<div className="grid min-h-112.5 grid-cols-1 gap-6 lg:grid-cols-2">
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

				<label
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					className="flex min-h-55 flex-1 cursor-pointer flex-col items-center justify-center rounded border-2 border-terminal-border border-dashed bg-terminal-bg/40 p-6 transition-all duration-150 hover:border-matrix/40 hover:bg-terminal-bg/80"
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
						<div className="relative max-h-50 max-w-full overflow-hidden rounded border border-terminal-border">
							<img
								src={imagePreview}
								alt="Preview"
								className="max-h-45 w-auto object-contain"
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
				</label>

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

				{encodeError && <p className="text-red-400 text-xs">{encodeError}</p>}
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
	)
}
