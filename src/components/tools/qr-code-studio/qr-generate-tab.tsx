import { Download } from 'lucide-react'
import QRCode from 'qrcode'
import { useDeferredValue, useEffect, useState } from 'react'

import { ColorField } from '@/components/tools/shared/color-field'
import { Pane } from '@/components/tools/shared/pane'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useThemeContext } from '@/contexts/theme-context'
import { downloadBlob } from '@/lib/file'

import { QR_ERROR_LEVELS, QR_SIZES, type QrErrorLevel, type QrSize } from './utils'

const QR_MARGIN = 2

// Dark modules on a light background scan most reliably, so light theme inverts the dark defaults
const DEFAULT_COLORS = {
	dark: { fg: '#00ff66', bg: '#000000' },
	light: { fg: '#15803d', bg: '#ffffff' },
} as const

function isQrSize(value: string): value is QrSize {
	return QR_SIZES.some((option) => option.value === value)
}

function isQrErrorLevel(value: string): value is QrErrorLevel {
	return QR_ERROR_LEVELS.some((option) => option.value === value)
}

export function QrGenerateTab() {
	const [text, setText] = useState<string>(() => window.location.origin)
	const [size, setSize] = useState<QrSize>('256')
	const [errorLevel, setErrorLevel] = useState<QrErrorLevel>('M')
	const { theme } = useThemeContext()
	// null means "not customised": the color follows the current theme
	const [fgOverride, setFgOverride] = useState<string | null>(null)
	const [bgOverride, setBgOverride] = useState<string | null>(null)
	const fgColor = fgOverride ?? DEFAULT_COLORS[theme].fg
	const bgColor = bgOverride ?? DEFAULT_COLORS[theme].bg
	const [error, setError] = useState<string | null>(null)
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

	// Typing and dragging a color picker redraw on every change, so let React defer them
	const deferredText = useDeferredValue(text)
	const deferredFg = useDeferredValue(fgColor)
	const deferredBg = useDeferredValue(bgColor)

	useEffect(() => {
		if (!canvas || !deferredText) return
		let isCancelled = false

		QRCode.toCanvas(canvas, deferredText, {
			width: Number(size),
			margin: QR_MARGIN,
			errorCorrectionLevel: errorLevel,
			color: { dark: deferredFg, light: deferredBg },
		})
			.then(() => {
				if (!isCancelled) setError(null)
			})
			.catch((err: unknown) => {
				if (!isCancelled)
					setError(err instanceof Error ? err.message : 'Failed to generate QR code')
			})

		return () => {
			isCancelled = true
		}
	}, [canvas, deferredText, size, errorLevel, deferredFg, deferredBg])

	const handleDownload = () => {
		canvas?.toBlob((blob) => {
			if (blob) downloadBlob(blob, `qrcode-${Date.now()}.png`)
		}, 'image/png')
	}

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
			<Pane title="Configuration" className="self-start lg:flex-1">
				<div className="flex flex-col gap-6 p-6">
					<div className="space-y-4 text-xs">
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

						<div className="grid grid-cols-2 gap-2">
							<div className="flex flex-col gap-1">
								<label htmlFor="qr-size" className="font-bold text-slate-500 uppercase">
									Size (px)
								</label>
								<Select
									value={size}
									onValueChange={(value) => {
										if (isQrSize(value)) setSize(value)
									}}
								>
									<SelectTrigger
										id="qr-size"
										className="border-terminal-border h-8 w-full font-mono text-xs"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
										{QR_SIZES.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col gap-1">
								<label htmlFor="qr-error" className="font-bold text-slate-500 uppercase">
									Error Correction
								</label>
								<Select
									value={errorLevel}
									onValueChange={(value) => {
										if (isQrErrorLevel(value)) setErrorLevel(value)
									}}
								>
									<SelectTrigger
										id="qr-error"
										className="border-terminal-border h-8 w-full font-mono text-xs"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
										{QR_ERROR_LEVELS.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<ColorField id="qr-fg" label="Foreground" value={fgColor} onChange={setFgOverride} />
							<ColorField id="qr-bg" label="Background" value={bgColor} onChange={setBgOverride} />
						</div>
					</div>
				</div>
			</Pane>

			<Pane
				title="Preview"
				dotClassName="bg-blue-500"
				actions={
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0"
						onClick={handleDownload}
						disabled={!text || !!error}
						title="Download QR code"
						aria-label="Download QR code"
					>
						<Download className="h-3.5 w-3.5" />
					</Button>
				}
				className="lg:flex-2"
			>
				<div className="flex flex-col items-center justify-center p-6">
					<div className="border-terminal-border bg-terminal-bg/30 relative flex flex-1 items-center justify-center rounded border p-8">
						{error ? (
							<div role="alert" className="text-center text-xs text-red-700 dark:text-red-400">
								{error}
							</div>
						) : (
							<canvas
								ref={setCanvas}
								className="border-terminal-border shadow-matrix/10 rounded border shadow-lg"
							/>
						)}
					</div>
				</div>
			</Pane>
		</div>
	)
}
