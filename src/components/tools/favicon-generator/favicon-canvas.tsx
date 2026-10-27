import { useEffect, useRef } from 'react'

import type { FaviconSettings } from './types'
import { drawFavicon } from './utils'

type FaviconCanvasProps = {
	size: number
	settings: FaviconSettings
	image: HTMLImageElement | null
	className?: string
}

export function FaviconCanvas({ size, settings, image, className }: FaviconCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const ctx = canvasRef.current?.getContext('2d')
		if (ctx) drawFavicon(ctx, size, settings, image)
	}, [size, settings, image])

	return <canvas ref={canvasRef} width={size} height={size} className={className} />
}
