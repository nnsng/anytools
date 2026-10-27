import { Check, Copy, Download, Upload } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useRef, useState } from 'react'

import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { readFileAsDataUrl } from '@/lib/file'

const MAX_SCAN_DIMENSION = 1024

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error('Failed to load image'))
		img.src = src
	})
}

type TabType = 'generate' | 'scan'
type SizeType = '128' | '256' | '384' | '512'
type ErrorLevelType = 'L' | 'M' | 'Q' | 'H'

export default function QrCodeTool() {
	const [activeTab, setActiveTab] = useState<TabType>('generate')

	// Generator State
	const [text, setText] = useState<string>(() => window.location.origin)
	const [size, setSize] = useState<SizeType>('256')
	const [errorLevel, setErrorLevel] = useState<ErrorLevelType>('M')
	const [fgColor, setFgColor] = useState<string>('#00ff66')
	const [bgColor, setBgColor] = useState<string>('#000000')
	const [genError, setGenError] = useState<string | null>(null)
	const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)

	// Scanner State
	const [scanResult, setScanResult] = useState<string>('')
	const [scanError, setScanError] = useState<string | null>(null)
	const { isCopied: scanCopied, copy } = useCopyToClipboard()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [scannedImageSrc, setScannedImageSrc] = useState<string | null>(null)

	// Generate QR Code on state change
	useEffect(() => {
		if (activeTab !== 'generate' || !canvasElement || !text) return

		const options = {
			width: parseInt(size, 10),
			margin: 2,
			errorCorrectionLevel: errorLevel,
			color: {
				dark: fgColor,
				light: bgColor,
			},
		}

		QRCode.toCanvas(canvasElement, text, options, (err) => {
			if (err) {
				console.error(err)
				setGenError(err.message)
			} else {
				setGenError(null)
			}
		})
	}, [text, size, errorLevel, fgColor, bgColor, activeTab, canvasElement])

	// Handle Download
	const handleDownload = () => {
		if (!canvasElement) return
		const link = document.createElement('a')
		link.download = `qrcode-${Date.now()}.png`
		link.href = canvasElement.toDataURL('image/png')
		link.click()
	}

	// Handle Scan Upload
	const handleScanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target
		const file = input.files?.[0]
		if (!file) return

		setScanResult('')
		setScanError(null)

		try {
			const dataUrl = await readFileAsDataUrl(file)
			setScannedImageSrc(dataUrl)

			const img = await loadImage(dataUrl)
			// Large photos freeze the main thread in getImageData/jsQR, so cap the scan size
			const scale = Math.min(1, MAX_SCAN_DIMENSION / Math.max(img.width, img.height))
			const canvas = document.createElement('canvas')
			canvas.width = Math.round(img.width * scale)
			canvas.height = Math.round(img.height * scale)
			const ctx = canvas.getContext('2d')
			if (!ctx) {
				setScanError('Failed to get 2D context from canvas.')
				return
			}
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

			const { default: jsQR } = await import('jsqr')
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
			const code = jsQR(imageData.data, imageData.width, imageData.height, {
				inversionAttempts: 'dontInvert',
			})

			if (code) {
				setScanResult(code.data)
			} else {
				setScanError('Could not find any readable QR code in this image.')
			}
		} catch {
			setScanError('Failed to load image.')
		} finally {
			// allow re-selecting the same file
			input.value = ''
		}
	}

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="generate">QR Generator</TabsTrigger>
				<TabsTrigger value="scan">QR Scanner</TabsTrigger>
			</TabsList>

			{/* GENERATOR TAB */}
			<TabsContent value="generate" className="mt-0">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
					{/* Configuration Panel */}
					<Pane title="Configuration" className="self-start lg:flex-1">
						<div className="flex flex-col gap-6 p-6">
							<div className="space-y-4 text-xs">
								{/* Text / Link */}
								<div className="flex flex-col gap-1">
									<label htmlFor="qr-content" className="font-bold text-slate-500 uppercase">
										QR Payload / URL
									</label>
									<textarea
										id="qr-content"
										value={text}
										onChange={(e) => setText(e.target.value)}
										placeholder="Enter text or URL to encode..."
										className="border-terminal-border bg-terminal-bg/50 text-foreground placeholder:text-muted-foreground min-h-20 w-full resize-none scrollbar-thin rounded-sm border p-2 font-mono text-xs focus:outline-none"
									/>
								</div>

								{/* Size & Quality */}
								<div className="grid grid-cols-2 gap-2">
									<div className="flex flex-col gap-1">
										<label htmlFor="qr-size" className="font-bold text-slate-500 uppercase">
											Size (px)
										</label>
										<Select value={size} onValueChange={setSize}>
											<SelectTrigger
												id="qr-size"
												className="border-terminal-border h-8 w-full font-mono text-xs"
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
												<SelectItem value="128">128 x 128</SelectItem>
												<SelectItem value="256">256 x 256</SelectItem>
												<SelectItem value="384">384 x 384</SelectItem>
												<SelectItem value="512">512 x 512</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="flex flex-col gap-1">
										<label htmlFor="qr-error" className="font-bold text-slate-500 uppercase">
											Error Correction
										</label>
										<Select value={errorLevel} onValueChange={setErrorLevel}>
											<SelectTrigger
												id="qr-error"
												className="border-terminal-border h-8 w-full font-mono text-xs"
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
												<SelectItem value="L">L (7% recovery)</SelectItem>
												<SelectItem value="M">M (15% recovery)</SelectItem>
												<SelectItem value="Q">Q (25% recovery)</SelectItem>
												<SelectItem value="H">H (30% recovery)</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Colors */}
								<div className="grid grid-cols-2 gap-2">
									<div className="flex flex-col gap-1">
										<label htmlFor="qr-fg" className="font-bold text-slate-500 uppercase">
											Foreground
										</label>
										<div className="flex items-center gap-1.5">
											<input
												id="qr-fg"
												type="color"
												value={fgColor}
												onChange={(e) => setFgColor(e.target.value)}
												className="border-terminal-border h-7 w-7 cursor-pointer rounded border bg-transparent p-0"
											/>
											<Input
												type="text"
												value={fgColor}
												onChange={(e) => setFgColor(e.target.value)}
												className="border-terminal-border text-foreground h-7 font-mono text-xs"
											/>
										</div>
									</div>

									<div className="flex flex-col gap-1">
										<label htmlFor="qr-bg" className="font-bold text-slate-500 uppercase">
											Background
										</label>
										<div className="flex items-center gap-1.5">
											<input
												id="qr-bg"
												type="color"
												value={bgColor}
												onChange={(e) => setBgColor(e.target.value)}
												className="border-terminal-border h-7 w-7 cursor-pointer rounded border bg-transparent p-0"
											/>
											<Input
												type="text"
												value={bgColor}
												onChange={(e) => setBgColor(e.target.value)}
												className="border-terminal-border text-foreground h-7 font-mono text-xs"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Pane>

					{/* Preview Panel */}
					<Pane
						title="Preview"
						dotClassName="bg-blue-500"
						actions={
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0"
								onClick={handleDownload}
								disabled={!text || !!genError}
								title="Download QR code"
							>
								<Download className="h-3.5 w-3.5" />
							</Button>
						}
						className="lg:flex-2"
					>
						<div className="flex flex-col items-center justify-center p-6">
							<div className="border-terminal-border bg-terminal-bg/30 relative flex flex-1 items-center justify-center rounded border p-8">
								{genError ? (
									<div className="text-center text-xs text-red-400">{genError}</div>
								) : (
									<canvas
										ref={setCanvasElement}
										className="border-terminal-border shadow-matrix/10 rounded border shadow-lg"
									/>
								)}
							</div>
						</div>
					</Pane>
				</div>
			</TabsContent>

			{/* SCANNER TAB */}
			<TabsContent value="scan" className="mt-0">
				<div className="flex flex-col gap-6 lg:flex-row">
					{/* Upload & Preview */}
					<Pane title="Upload QR Code Image" className="lg:flex-1">
						<div className="flex flex-col p-6">
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleScanUpload}
								className="hidden"
								accept="image/*"
							/>

							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="border-terminal-border bg-terminal-bg/20 hover:bg-terminal-bg/40 focus:ring-matrix/50 flex w-full flex-1 cursor-pointer flex-col items-center justify-center border border-dashed p-8 focus:ring-1 focus:outline-none"
							>
								{scannedImageSrc ? (
									<div className="flex flex-col items-center gap-4">
										<img
											src={scannedImageSrc}
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
										<span className="mt-1 text-xs text-slate-500 uppercase">
											PNG, JPG, JPEG, WEBP
										</span>
									</>
								)}
							</button>
						</div>
					</Pane>

					{/* Result Output */}
					<Pane title="Scan Results" dotClassName="bg-blue-500" className="lg:flex-1">
						<div className="flex h-full flex-col p-6">
							<div className="flex flex-1 flex-col justify-between gap-4">
								<div className="relative flex flex-1">
									<textarea
										readOnly
										value={scanResult}
										placeholder="Upload a QR code to read its content..."
										className="border-terminal-border bg-terminal-bg/50 text-foreground placeholder:text-muted-foreground min-h-40 w-full flex-1 resize-none scrollbar-thin rounded-sm border p-4 font-mono text-xs focus:outline-none"
									/>
									{scanResult && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => copy(scanResult)}
											className="absolute top-2 right-2 h-7 w-7 p-0"
										>
											{scanCopied ? (
												<Check className="text-matrix h-3.5 w-3.5" />
											) : (
												<Copy className="h-3.5 w-3.5" />
											)}
										</Button>
									)}
								</div>

								{scanError && (
									<div className="rounded border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-400">
										{scanError}
									</div>
								)}

								<Button
									variant="secondary"
									onClick={() => {
										setScanResult('')
										setScanError(null)
										setScannedImageSrc(null)
										if (fileInputRef.current) fileInputRef.current.value = ''
									}}
									disabled={!scannedImageSrc}
									className="w-full text-xs font-bold"
								>
									CLEAR SCANNER
								</Button>
							</div>
						</div>
					</Pane>
				</div>
			</TabsContent>
		</Tabs>
	)
}
