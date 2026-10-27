import type { FaviconSettings, ShapeType } from './types'

export const ICO_SIZES = [16, 32, 48] as const

const ROUNDED_RADIUS_RATIO = 0.2

function buildShapePath(shape: ShapeType, size: number): Path2D {
	const path = new Path2D()
	if (shape === 'circle') {
		path.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
	} else if (shape === 'rounded') {
		path.roundRect(0, 0, size, size, size * ROUNDED_RADIUS_RATIO)
	} else {
		path.rect(0, 0, size, size)
	}
	return path
}

function getImageRect(image: HTMLImageElement, size: number, fit: FaviconSettings['imageFit']) {
	if (fit === 'stretch') return { dx: 0, dy: 0, dw: size, dh: size }

	const scaleFn = fit === 'contain' ? Math.min : Math.max
	const ratio = scaleFn(size / image.width, size / image.height)
	const dw = image.width * ratio
	const dh = image.height * ratio
	return { dx: (size - dw) / 2, dy: (size - dh) / 2, dw, dh }
}

function getTextFontSize(text: string, size: number): number {
	if (text.length > 2) return size * 0.45
	if (text.length === 2) return size * 0.5
	return size * 0.6
}

/** Draws the favicon at `size` px onto a canvas context. Pure with respect to its inputs. */
export function drawFavicon(
	ctx: CanvasRenderingContext2D,
	size: number,
	settings: FaviconSettings,
	image: HTMLImageElement | null,
) {
	ctx.clearRect(0, 0, size, size)

	const shapePath = buildShapePath(settings.shape, size)
	if (settings.shape !== 'transparent') {
		ctx.fillStyle = settings.bgColor
		ctx.fill(shapePath)
	}

	ctx.save()
	if (settings.shape !== 'transparent' && settings.shape !== 'square') ctx.clip(shapePath)

	if (settings.tab === 'image' && image) {
		const { dx, dy, dw, dh } = getImageRect(image, size, settings.imageFit)
		ctx.drawImage(image, dx, dy, dw, dh)
	} else if (settings.tab === 'text') {
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillStyle = settings.textColor
		ctx.font = `bold ${getTextFontSize(settings.text, size)}px ${settings.fontFamily}`
		ctx.fillText(settings.text.substring(0, 3), size / 2, size / 2)
	}
	ctx.restore()
}

export function createFaviconCanvas(
	size: number,
	settings: FaviconSettings,
	image: HTMLImageElement | null,
): HTMLCanvasElement {
	const canvas = document.createElement('canvas')
	canvas.width = size
	canvas.height = size
	const ctx = canvas.getContext('2d')
	if (ctx) drawFavicon(ctx, size, settings, image)
	return canvas
}

export function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
			'image/png',
		)
	})
}

type IcoImage = { size: number; data: Uint8Array }

const ICO_HEADER_BYTES = 6
const ICO_ENTRY_BYTES = 16

/** Packs PNG-encoded images into a single .ico container. */
export function buildIco(images: IcoImage[]): Blob {
	let dataOffset = ICO_HEADER_BYTES + ICO_ENTRY_BYTES * images.length
	const totalLength = dataOffset + images.reduce((total, image) => total + image.data.length, 0)
	const buffer = new ArrayBuffer(totalLength)
	const view = new DataView(buffer)
	const bytes = new Uint8Array(buffer)

	view.setUint16(0, 0, true) // reserved
	view.setUint16(2, 1, true) // type 1 = ICO
	view.setUint16(4, images.length, true)

	images.forEach((image, index) => {
		const entry = ICO_HEADER_BYTES + index * ICO_ENTRY_BYTES
		const dimension = image.size >= 256 ? 0 : image.size
		view.setUint8(entry, dimension) // width
		view.setUint8(entry + 1, dimension) // height
		view.setUint8(entry + 2, 0) // palette colors
		view.setUint8(entry + 3, 0) // reserved
		view.setUint16(entry + 4, 1, true) // color planes
		view.setUint16(entry + 6, 32, true) // bits per pixel
		view.setUint32(entry + 8, image.data.length, true)
		view.setUint32(entry + 12, dataOffset, true)

		bytes.set(image.data, dataOffset)
		dataOffset += image.data.length
	})

	return new Blob([buffer], { type: 'image/x-icon' })
}

export async function generateIco(
	settings: FaviconSettings,
	image: HTMLImageElement | null,
): Promise<Blob> {
	const images: IcoImage[] = []
	for (const size of ICO_SIZES) {
		const png = await canvasToPng(createFaviconCanvas(size, settings, image))
		images.push({ size, data: new Uint8Array(await png.arrayBuffer()) })
	}
	return buildIco(images)
}
