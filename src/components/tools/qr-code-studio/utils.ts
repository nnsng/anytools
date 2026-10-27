export type QrSize = '128' | '256' | '384' | '512'
export type QrErrorLevel = 'L' | 'M' | 'Q' | 'H'

export const QR_SIZES: Array<{ value: QrSize; label: string }> = [
	{ value: '128', label: '128 x 128' },
	{ value: '256', label: '256 x 256' },
	{ value: '384', label: '384 x 384' },
	{ value: '512', label: '512 x 512' },
]

export const QR_ERROR_LEVELS: Array<{ value: QrErrorLevel; label: string }> = [
	{ value: 'L', label: 'L (7% recovery)' },
	{ value: 'M', label: 'M (15% recovery)' },
	{ value: 'Q', label: 'Q (25% recovery)' },
	{ value: 'H', label: 'H (30% recovery)' },
]

// Large photos freeze the main thread in getImageData/jsQR, so cap the scan size
const MAX_SCAN_DIMENSION = 1024

export function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error('Failed to load image'))
		img.src = src
	})
}

/** Returns the decoded QR text, or null when no code is found. jsQR is loaded on demand. */
export async function scanQrFromImage(img: HTMLImageElement): Promise<string | null> {
	const scale = Math.min(1, MAX_SCAN_DIMENSION / Math.max(img.width, img.height))
	const canvas = document.createElement('canvas')
	canvas.width = Math.round(img.width * scale)
	canvas.height = Math.round(img.height * scale)

	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Failed to get 2D context from canvas.')
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

	const { default: jsQR } = await import('jsqr')
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
	const code = jsQR(imageData.data, imageData.width, imageData.height, {
		inversionAttempts: 'dontInvert',
	})
	return code?.data ?? null
}
