import { Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Pane } from '@/components/tools/shared/pane'
import { cn } from '@/lib/utils'

type EncodeTabProps = {
	onFileChange: (file: File) => void
	className?: string
}

export function EncodeTab({ onFileChange, className }: EncodeTabProps) {
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
		<div className={cn('flex flex-col gap-6 lg:flex-row', className)}>
			{/* Drag & Drop Area */}
			<Pane title="Select Image File" className="lg:flex-1">
				<div className="flex h-full flex-col justify-between space-y-4 p-6">
					<p className="text-xs text-slate-400">
						Drag & drop or upload an image file (PNG, JPG, WEBP, GIF, SVG).
					</p>

					<label
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						className="border-terminal-border bg-terminal-bg/40 hover:border-matrix/40 hover:bg-terminal-bg/80 flex min-h-55 flex-1 cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed p-6 transition-all duration-150"
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
							<div className="border-terminal-border relative max-h-50 max-w-full overflow-hidden rounded border">
								<img src={imagePreview} alt="Preview" className="max-h-45 w-auto object-contain" />
							</div>
						) : (
							<div className="space-y-3 text-center">
								<Upload className="pulse-fast mx-auto h-8 w-8 text-slate-600" />
								<span className="text-xs font-bold text-slate-500">
									DRAG & DROP IMAGE FILE OR CLICK TO BROWSE
								</span>
							</div>
						)}
					</label>

					{imageFile && (
						<div className="border-terminal-border bg-terminal-bg space-y-1 rounded border p-3 text-xs text-slate-400">
							<div>
								FILENAME: <span className="text-foreground font-bold">{imageFile.name}</span>
							</div>
							<div>
								FILESIZE:{' '}
								<span className="text-foreground font-bold">
									{(imageFile.size / 1024).toFixed(2)} KB
								</span>
							</div>
							<div>
								TYPE: <span className="text-foreground font-bold">{imageFile.type}</span>
							</div>
						</div>
					)}

					{encodeError && <p className="text-xs text-red-400">{encodeError}</p>}
				</div>
			</Pane>

			{/* Base64 Output */}
			<EditorPane
				title="Base64 Output String"
				value={base64Output}
				readOnly={true}
				allowDownload={true}
				downloadFileName="image-base64.txt"
				placeholder="Base64 output string will appear here..."
				className="lg:flex-1"
			/>
		</div>
	)
}
