import { Download, Image as ImageIcon, Type, Upload } from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TabType = 'image' | 'text' | (string & {})
type ShapeType = 'circle' | 'square' | 'rounded' | 'transparent' | (string & {})
type ImageFit = 'contain' | 'cover' | 'stretch' | (string & {})

export default function FaviconGenerator() {
	const [activeTab, setActiveTab] = useState<TabType>('image')

	// Shared Config
	const [bgColor, setBgColor] = useState<string>('#00ff66')
	const [shape, setShape] = useState<ShapeType>('rounded')

	// Image state
	const [imageSrc, setImageSrc] = useState<string | null>(null)
	const [imageFit, setImageFit] = useState<ImageFit>('contain')
	const imageInputRef = useRef<HTMLInputElement>(null)

	// Text state
	const [text, setText] = useState<string>('GO')
	const [textColor, setTextColor] = useState<string>('#000000')
	const [fontFamily, setFontFamily] = useState<string>('sans-serif')

	// Canvas refs
	const canvas16Ref = useRef<HTMLCanvasElement>(null)
	const canvas32Ref = useRef<HTMLCanvasElement>(null)
	const canvas48Ref = useRef<HTMLCanvasElement>(null)
	const canvas180Ref = useRef<HTMLCanvasElement>(null)

	const renderAll = useCallback(() => {
		const sizes = [
			{ size: 16, ref: canvas16Ref },
			{ size: 32, ref: canvas32Ref },
			{ size: 48, ref: canvas48Ref },
			{ size: 180, ref: canvas180Ref },
		]

		for (const { size, ref } of sizes) {
			const canvas = ref.current
			if (!canvas) continue
			const ctx = canvas.getContext('2d')
			if (!ctx) continue

			// Clear
			ctx.clearRect(0, 0, size, size)

			// Draw Background
			if (shape !== 'transparent') {
				ctx.fillStyle = bgColor
				if (shape === 'circle') {
					ctx.beginPath()
					ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
					ctx.fill()
				} else if (shape === 'rounded') {
					const radius = size * 0.2
					ctx.beginPath()
					ctx.moveTo(radius, 0)
					ctx.lineTo(size - radius, 0)
					ctx.quadraticCurveTo(size, 0, size, radius)
					ctx.lineTo(size, size - radius)
					ctx.quadraticCurveTo(size, size, size - radius, size)
					ctx.lineTo(radius, size)
					ctx.quadraticCurveTo(0, size, 0, size - radius)
					ctx.lineTo(0, radius)
					ctx.quadraticCurveTo(0, 0, radius, 0)
					ctx.closePath()
					ctx.fill()
				} else {
					// Square
					ctx.fillRect(0, 0, size, size)
				}
			}

			// Draw Content
			if (activeTab === 'image' && imageSrc) {
				const img = new Image()
				img.onload = () => {
					// Recalculate size to handle async drawing
					ctx.clearRect(0, 0, size, size)
					// Redraw background first
					if (shape !== 'transparent') {
						ctx.fillStyle = bgColor
						if (shape === 'circle') {
							ctx.beginPath()
							ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
							ctx.fill()
						} else if (shape === 'rounded') {
							const radius = size * 0.2
							ctx.beginPath()
							ctx.moveTo(radius, 0)
							ctx.lineTo(size - radius, 0)
							ctx.quadraticCurveTo(size, 0, size, radius)
							ctx.lineTo(size, size - radius)
							ctx.quadraticCurveTo(size, size, size - radius, size)
							ctx.lineTo(radius, size)
							ctx.quadraticCurveTo(0, size, 0, size - radius)
							ctx.lineTo(0, radius)
							ctx.quadraticCurveTo(0, 0, radius, 0)
							ctx.closePath()
							ctx.fill()
						} else {
							ctx.fillRect(0, 0, size, size)
						}
					}

					// Apply clipping path for circular or rounded background if required
					ctx.save()
					if (shape === 'circle') {
						ctx.beginPath()
						ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
						ctx.clip()
					} else if (shape === 'rounded') {
						const radius = size * 0.2
						ctx.beginPath()
						ctx.moveTo(radius, 0)
						ctx.lineTo(size - radius, 0)
						ctx.quadraticCurveTo(size, 0, size, radius)
						ctx.lineTo(size, size - radius)
						ctx.quadraticCurveTo(size, size, size - radius, size)
						ctx.lineTo(radius, size)
						ctx.quadraticCurveTo(0, size, 0, size - radius)
						ctx.lineTo(0, radius)
						ctx.quadraticCurveTo(0, 0, radius, 0)
						ctx.closePath()
						ctx.clip()
					}

					let dx = 0
					let dy = 0
					let dw = size
					let dh = size

					if (imageFit === 'contain') {
						const ratio = Math.min(size / img.width, size / img.height)
						dw = img.width * ratio
						dh = img.height * ratio
						dx = (size - dw) / 2
						dy = (size - dh) / 2
					} else if (imageFit === 'cover') {
						const ratio = Math.max(size / img.width, size / img.height)
						dw = img.width * ratio
						dh = img.height * ratio
						dx = (size - dw) / 2
						dy = (size - dh) / 2
					}

					ctx.drawImage(img, dx, dy, dw, dh)
					ctx.restore()
				}
				img.src = imageSrc
			} else if (activeTab === 'text') {
				ctx.save()
				ctx.textAlign = 'center'
				ctx.textBaseline = 'middle'
				ctx.fillStyle = textColor

				// Adjust font size based on text length
				let fontSize = size * 0.6
				if (text.length > 2) fontSize = size * 0.45
				else if (text.length === 2) fontSize = size * 0.5

				ctx.font = `bold ${fontSize}px ${fontFamily}`
				ctx.fillText(text.substring(0, 3), size / 2, size / 2)
				ctx.restore()
			}
		}
	}, [activeTab, bgColor, shape, imageSrc, imageFit, text, textColor, fontFamily])

	// Trigger render when anything changes
	useEffect(() => {
		renderAll()
	}, [renderAll])

	// Image Uploader
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = (event) => {
			setImageSrc(event.target?.result as string)
		}
		reader.readAsDataURL(file)
	}

	// Single PNG downloader
	const downloadPng = (canvasRef: React.RefObject<HTMLCanvasElement | null>, size: number) => {
		const canvas = canvasRef.current
		if (!canvas) return
		const link = document.createElement('a')
		link.download = `favicon-${size}x${size}.png`
		link.href = canvas.toDataURL('image/png')
		link.click()
	}

	// ICO Pack helper
	const downloadIco = async () => {
		const canvasRefs = [
			{ width: 16, height: 16, ref: canvas16Ref },
			{ width: 32, height: 32, ref: canvas32Ref },
			{ width: 48, height: 48, ref: canvas48Ref },
		]

		try {
			const blobsData: { width: number; height: number; data: Uint8Array }[] = []

			for (const { width, height, ref } of canvasRefs) {
				const canvas = ref.current
				if (!canvas) continue
				const data = await getPngUint8Array(canvas)
				blobsData.push({ width, height, data })
			}

			if (blobsData.length === 0) return

			const icoBlob = generateIcoBlob(blobsData)
			const link = document.createElement('a')
			link.download = 'favicon.ico'
			link.href = URL.createObjectURL(icoBlob)
			link.click()
			URL.revokeObjectURL(link.href)
		} catch (error) {
			console.error('Failed to generate ICO file:', error)
		}
	}

	// Convert canvas to png Uint8Array
	const getPngUint8Array = (canvas: HTMLCanvasElement): Promise<Uint8Array> => {
		return new Promise((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (!blob) {
					reject(new Error('Canvas toBlob failed'))
					return
				}
				const reader = new FileReader()
				reader.onload = () => {
					if (reader.result instanceof ArrayBuffer) {
						resolve(new Uint8Array(reader.result))
					} else {
						reject(new Error('Failed to read array buffer'))
					}
				}
				reader.onerror = () => reject(reader.error)
				reader.readAsArrayBuffer(blob)
			}, 'image/png')
		})
	}

	// ICO compiler
	const generateIcoBlob = (
		pngBlobs: { width: number; height: number; data: Uint8Array }[],
	): Blob => {
		const headerSize = 6
		const directorySize = 16 * pngBlobs.length
		let dataOffset = headerSize + directorySize

		const totalLength = dataOffset + pngBlobs.reduce((acc, b) => acc + b.data.length, 0)
		const buffer = new ArrayBuffer(totalLength)
		const view = new DataView(buffer)
		const uint8 = new Uint8Array(buffer)

		// Header
		view.setUint16(0, 0, true) // Reserved
		view.setUint16(2, 1, true) // Type 1 = ICO
		view.setUint16(4, pngBlobs.length, true) // Quantity

		// Directory Entries
		let dirOffset = headerSize
		for (const blob of pngBlobs) {
			view.setUint8(dirOffset, blob.width >= 256 ? 0 : blob.width) // Width
			view.setUint8(dirOffset + 1, blob.height >= 256 ? 0 : blob.height) // Height
			view.setUint8(dirOffset + 2, 0) // Color count
			view.setUint8(dirOffset + 3, 0) // Reserved
			view.setUint16(dirOffset + 4, 1, true) // Planes
			view.setUint16(dirOffset + 6, 32, true) // Bits per pixel
			view.setUint32(dirOffset + 8, blob.data.length, true) // Size of data
			view.setUint32(dirOffset + 12, dataOffset, true) // Data offset

			// Write image data
			uint8.set(blob.data, dataOffset)

			dirOffset += 16
			dataOffset += blob.data.length
		}

		return new Blob([buffer], { type: 'image/x-icon' })
	}

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="image">
					<ImageIcon className="mr-1.5 h-3.5 w-3.5" />
					Image Upload
				</TabsTrigger>
				<TabsTrigger value="text">
					<Type className="mr-1.5 h-3.5 w-3.5" />
					Text Generator
				</TabsTrigger>
			</TabsList>

			<div className="flex flex-col gap-6 lg:flex-row">
				{/* Left Configuration Panel */}
				<Pane title="Design controls" className="lg:flex-4">
					<div className="flex flex-col gap-6 p-6">
						{/* Content settings based on Active Tab */}
						<div className="text-xs">
							{/* TAB CONTENT: IMAGE */}
							{activeTab === 'image' && (
								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-1">
										<span className="font-bold text-slate-500 uppercase">Image File</span>
										<input
											type="file"
											ref={imageInputRef}
											onChange={handleImageUpload}
											accept="image/*"
											className="hidden"
										/>
										<button
											type="button"
											onClick={() => imageInputRef.current?.click()}
											className="flex w-full cursor-pointer flex-col items-center justify-center border border-terminal-border border-dashed bg-terminal-bg/20 p-6 hover:bg-terminal-bg/40 focus:outline-none focus:ring-1 focus:ring-matrix/50"
										>
											{imageSrc ? (
												<span className="text-[10px] text-matrix uppercase">
													File Loaded (Click to replace)
												</span>
											) : (
												<>
													<Upload className="mb-2 h-5 w-5 text-slate-500" />
													<span className="text-[10px] text-slate-400">Upload square image</span>
												</>
											)}
										</button>
									</div>

									{imageSrc && (
										<div className="flex flex-col gap-1">
											<label htmlFor="fit-mode" className="font-bold text-slate-500 uppercase">
												Fit Mode
											</label>
											<Select value={imageFit} onValueChange={setImageFit}>
												<SelectTrigger
													id="fit-mode"
													className="h-8 border-terminal-border font-mono text-xs"
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
													<SelectItem value="contain">Contain (Keep ratio)</SelectItem>
													<SelectItem value="cover">Cover (Fill canvas)</SelectItem>
													<SelectItem value="stretch">Stretch to fill</SelectItem>
												</SelectContent>
											</Select>
										</div>
									)}
								</div>
							)}

							{/* TAB CONTENT: TEXT */}
							{activeTab === 'text' && (
								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-1">
										<label htmlFor="text-val" className="font-bold text-slate-500 uppercase">
											Icon Text (1-3 chars)
										</label>
										<Input
											id="text-val"
											type="text"
											maxLength={3}
											value={text}
											onChange={(e) => setText(e.target.value.toUpperCase())}
											className="h-8 border-terminal-border font-mono text-white text-xs"
										/>
									</div>
									<div className="flex flex-row gap-4">
										<div className="flex flex-1 flex-col gap-1">
											<label htmlFor="text-color" className="font-bold text-slate-500 uppercase">
												Text Color
											</label>
											<div className="flex items-center gap-1.5">
												<input
													id="text-color"
													type="color"
													value={textColor}
													onChange={(e) => setTextColor(e.target.value)}
													className="h-7 w-7 cursor-pointer rounded border border-terminal-border bg-transparent p-0"
												/>
												<Input
													type="text"
													value={textColor}
													onChange={(e) => setTextColor(e.target.value)}
													className="h-7 border-terminal-border font-mono text-[9px] text-white"
												/>
											</div>
										</div>

										<div className="flex flex-1 flex-col gap-1">
											<label htmlFor="font-fam" className="font-bold text-slate-500 uppercase">
												Font Family
											</label>
											<Select value={fontFamily} onValueChange={setFontFamily}>
												<SelectTrigger
													id="font-fam"
													className="h-8 w-full border-terminal-border font-mono text-xs"
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
													<SelectItem value="sans-serif">Sans-Serif</SelectItem>
													<SelectItem value="serif">Serif</SelectItem>
													<SelectItem value="monospace">Monospace</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>
							)}

							{/* SHAPE & BACKGROUND COLOR */}
							<div className="mt-4 flex flex-col gap-4 border-terminal-border border-t pt-4">
								<div className="flex flex-col gap-1">
									<label htmlFor="shape-sel" className="font-bold text-slate-500 uppercase">
										Background Shape
									</label>
									<Select value={shape} onValueChange={setShape}>
										<SelectTrigger
											id="shape-sel"
											className="h-8 border-terminal-border font-mono text-xs"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
											<SelectItem value="transparent">Transparent</SelectItem>
											<SelectItem value="rounded">Rounded Square</SelectItem>
											<SelectItem value="circle">Circle</SelectItem>
											<SelectItem value="square">Square</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{shape !== 'transparent' && (
									<div className="flex flex-col gap-1">
										<label htmlFor="bg-color" className="font-bold text-slate-500 uppercase">
											Background Color
										</label>
										<div className="flex items-center gap-1.5">
											<input
												id="bg-color"
												type="color"
												value={bgColor}
												onChange={(e) => setBgColor(e.target.value)}
												className="h-7 w-7 cursor-pointer rounded border border-terminal-border bg-transparent p-0"
											/>
											<Input
												type="text"
												value={bgColor}
												onChange={(e) => setBgColor(e.target.value)}
												className="h-7 border-terminal-border font-mono text-[9px] text-white"
											/>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="mt-auto flex flex-col gap-2">
							<Button onClick={downloadIco} className="w-full font-bold text-xs">
								<Download className="mr-2 h-3.5 w-3.5" />
								DOWNLOAD MULTI-SIZE ICO
							</Button>
							<span className="text-center text-[9px] text-slate-500 uppercase">
								Includes 16x16, 32x32, and 48x48 PNG sizes
							</span>
						</div>
					</div>
				</Pane>

				{/* Right Preview Panel */}
				<div className="flex flex-col gap-6 lg:flex-8">
					{/* Mock Browser Tab Preview */}
					<div className="rounded border border-terminal-border bg-slate-950 p-1">
						<div className="flex items-center gap-2 border-slate-800 border-b bg-slate-900 px-3 py-2">
							{/* Browser Buttons */}
							<div className="flex gap-1.5">
								<div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
								<div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
								<div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
							</div>
							{/* Browser Tab */}
							<div className="ml-4 flex h-7 items-center gap-2 rounded-t-sm bg-slate-950 px-3 font-sans text-slate-300 text-xs">
								{/* Canvas 16x16 as tab icon */}
								<canvas
									ref={canvas16Ref}
									width={16}
									height={16}
									className="h-4 w-4 bg-transparent"
								/>
								<span className="max-w-20 truncate">Your Web App</span>
								<span className="ml-1 text-[10px] text-slate-500">×</span>
							</div>
						</div>
						<div className="flex h-12 items-center bg-slate-950 px-3 py-2">
							<div className="flex h-6 w-full items-center rounded-sm border border-slate-800 bg-slate-900 px-3 font-sans text-[10px] text-slate-500">
								https://yourdomain.com
							</div>
						</div>
					</div>

					{/* Sizes Grid */}
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						{/* 16x16 */}
						<div className="flex flex-col items-center justify-between rounded border border-terminal-border bg-terminal-card/30 p-4">
							<span className="mb-2 text-[10px] text-slate-500">16 x 16 (Standard)</span>
							<div className="flex h-20 items-center justify-center">
								{/* Show actual size + zoom */}
								<div className="flex flex-col items-center gap-2">
									<canvas
										width={16}
										height={16}
										className="h-4 w-4 rounded border border-slate-800"
									/>
									<span className="text-[8px] text-slate-600">ACTUAL SIZE</span>
								</div>
							</div>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => downloadPng(canvas16Ref, 16)}
								className="mt-2 h-7 w-full text-[9px]"
							>
								DOWNLOAD PNG
							</Button>
						</div>

						{/* 32x32 */}
						<div className="flex flex-col items-center justify-between rounded border border-terminal-border bg-terminal-card/30 p-4">
							<span className="mb-2 text-[10px] text-slate-500">32 x 32 (Taskbar)</span>
							<div className="flex h-20 items-center justify-center">
								<div className="flex flex-col items-center gap-2">
									<canvas
										width={32}
										height={32}
										className="h-8 w-8 rounded border border-slate-800"
									/>
									<span className="text-[8px] text-slate-600">ACTUAL SIZE</span>
								</div>
							</div>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => downloadPng(canvas32Ref, 32)}
								className="mt-2 h-7 w-full text-[9px]"
							>
								DOWNLOAD PNG
							</Button>
						</div>

						{/* 48x48 */}
						<div className="flex flex-col items-center justify-between rounded border border-terminal-border bg-terminal-card/30 p-4">
							<span className="mb-2 text-[10px] text-slate-500">48 x 48 (Desktop)</span>
							<div className="flex h-20 items-center justify-center">
								<div className="flex flex-col items-center gap-2">
									<canvas
										ref={canvas48Ref}
										width={48}
										height={48}
										className="h-12 w-12 rounded border border-slate-800"
									/>
									<span className="text-[8px] text-slate-600">ACTUAL SIZE</span>
								</div>
							</div>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => downloadPng(canvas48Ref, 48)}
								className="mt-2 h-7 w-full text-[9px]"
							>
								DOWNLOAD PNG
							</Button>
						</div>

						{/* 180x180 */}
						<div className="flex flex-col items-center justify-between rounded border border-terminal-border bg-terminal-card/30 p-4">
							<span className="mb-2 text-[10px] text-slate-500">180 x 180 (Apple Touch)</span>
							<div className="flex h-20 items-center justify-center">
								<div className="flex flex-col items-center gap-1">
									<canvas
										ref={canvas180Ref}
										width={180}
										height={180}
										className="h-14 w-14 rounded border border-slate-800"
									/>
									<span className="text-[8px] text-slate-600">SCALED PREVIEW</span>
								</div>
							</div>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => downloadPng(canvas180Ref, 180)}
								className="mt-2 h-7 w-full text-[9px]"
							>
								DOWNLOAD PNG
							</Button>
						</div>
					</div>

					{/* Hidden canvas duplicates for scaling rendering if not already set by ref */}
					<div className="hidden">
						<canvas ref={canvas32Ref} width={32} height={32} />
					</div>
				</div>
			</div>
		</Tabs>
	)
}
