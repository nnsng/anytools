import { Check, Copy, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { readFileAsDataUrl } from '@/lib/file'

import { loadImage, scanQrFromImage } from './utils'

export function QrScanTab() {
	const [result, setResult] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [imageSrc, setImageSrc] = useState<string | null>(null)
	const { isCopied, copy } = useCopyToClipboard()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target
		const file = input.files?.[0]
		if (!file) return

		setResult('')
		setError(null)

		try {
			const dataUrl = await readFileAsDataUrl(file)
			setImageSrc(dataUrl)
			const text = await scanQrFromImage(await loadImage(dataUrl))
			if (text) setResult(text)
			else setError('Could not find any readable QR code in this image.')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load image.')
		} finally {
			// allow re-selecting the same file
			input.value = ''
		}
	}

	const handleClear = () => {
		setResult('')
		setError(null)
		setImageSrc(null)
	}

	return (
		<div className="flex flex-col gap-6 lg:flex-row">
			<Pane title="Upload QR Code Image" className="lg:flex-1">
				<div className="flex flex-col p-6">
					<input
						type="file"
						ref={fileInputRef}
						aria-label="QR code image"
						onChange={handleUpload}
						className="hidden"
						accept="image/*"
					/>

					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="border-terminal-border bg-terminal-bg/20 hover:bg-terminal-bg/40 focus:ring-matrix/50 flex w-full flex-1 cursor-pointer flex-col items-center justify-center border border-dashed p-8 focus:ring-1 focus:outline-none"
					>
						{imageSrc ? (
							<div className="flex flex-col items-center gap-4">
								<img
									src={imageSrc}
									alt="Uploaded QR Code Preview"
									className="border-terminal-border max-h-55 rounded border"
								/>
								<span className="text-xs text-slate-500 uppercase">
									Click or drag to replace image
								</span>
							</div>
						) : (
							<>
								<Upload className="mb-3 h-8 w-8 text-slate-500" />
								<span className="text-xs text-slate-400">Click to upload file</span>
								<span className="mt-1 text-xs text-slate-500 uppercase">PNG, JPG, JPEG, WEBP</span>
							</>
						)}
					</button>
				</div>
			</Pane>

			<Pane title="Scan Results" dotClassName="bg-blue-500" className="lg:flex-1">
				<div className="flex h-full flex-col p-6">
					<div className="flex flex-1 flex-col justify-between gap-4">
						<div className="relative flex flex-1">
							<textarea
								readOnly
								aria-label="Scan result"
								value={result}
								placeholder="Upload a QR code to read its content..."
								className="border-terminal-border bg-terminal-bg/50 text-foreground placeholder:text-muted-foreground min-h-40 w-full flex-1 resize-none scrollbar-thin rounded-sm border p-4 font-mono text-xs focus:outline-none"
							/>
							{result && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => copy(result)}
									aria-label="Copy scan result"
									className="absolute top-2 right-2 h-7 w-7 p-0"
								>
									{isCopied ? (
										<Check className="text-matrix h-3.5 w-3.5" />
									) : (
										<Copy className="h-3.5 w-3.5" />
									)}
								</Button>
							)}
						</div>

						{error && (
							<div
								role="alert"
								className="rounded border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-400"
							>
								{error}
							</div>
						)}

						<Button
							variant="secondary"
							onClick={handleClear}
							disabled={!imageSrc}
							className="w-full text-xs font-bold"
						>
							CLEAR SCANNER
						</Button>
					</div>
				</div>
			</Pane>
		</div>
	)
}
