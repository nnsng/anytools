import { Download, FileImage } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Button } from '@/components/ui/button'

function resolveBase64Src(val: string): string {
	if (val.startsWith('data:image/')) return val
	if (val.startsWith('iVBORw0KGgo')) return `data:image/png;base64,${val}`
	if (val.startsWith('/9j/')) return `data:image/jpeg;base64,${val}`
	if (val.startsWith('R0lGOD')) return `data:image/gif;base64,${val}`
	if (val.startsWith('UklGR')) return `data:image/webp;base64,${val}`
	return `data:image/png;base64,${val}`
}

export function DecodeTab() {
	const [base64Input, setBase64Input] = useState<string>('')
	const [decodedSrc, setDecodedSrc] = useState<string>('')
	const [decodeError, setDecodeError] = useState<string | null>(null)

	useEffect(() => {
		const val = base64Input.trim()
		if (!val) {
			setDecodedSrc('')
			setDecodeError(null)
			return
		}

		const src = resolveBase64Src(val)
		const img = new window.Image()
		img.onload = () => {
			setDecodedSrc(src)
			setDecodeError(null)
		}
		img.onerror = () => {
			setDecodeError('Failed to parse image from Base64 string. Ensure it is a valid format.')
			setDecodedSrc('')
		}
		img.src = src
	}, [base64Input])

	const handleDownload = () => {
		if (!decodedSrc) return
		const link = document.createElement('a')
		link.href = decodedSrc
		const mime = decodedSrc.match(/data:(image\/[a-zA-Z+]+);base64,/)
		const ext = mime ? mime[1].split('/')[1] : 'png'
		link.download = `decoded-image.${ext}`
		link.click()
	}

	return (
		<div className="grid min-h-112.5 grid-cols-1 gap-6 lg:grid-cols-2">
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
							onClick={handleDownload}
							className="flex items-center gap-1.5 py-1 text-xs"
						>
							<Download className="h-3.5 w-3.5" /> DOWNLOAD IMAGE
						</Button>
					)}
				</div>

				<div className="flex min-h-50 flex-1 items-center justify-center rounded border border-terminal-border bg-terminal-bg/40 p-4">
					{decodedSrc ? (
						<div className="relative max-h-75 max-w-full overflow-hidden rounded border border-terminal-border bg-checkered bg-size-[16px_16px]">
							<img src={decodedSrc} alt="Decoded preview" className="max-h-70 object-contain" />
						</div>
					) : (
						<div className="space-y-2 text-center text-slate-600">
							<FileImage className="mx-auto h-8 w-8" />
							<span className="text-xs">Waiting for valid Base64 string input...</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
