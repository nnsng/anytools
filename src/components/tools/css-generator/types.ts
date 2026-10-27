export type AlphaColor = {
	hex: string
	/** Opacity from 0 (transparent) to 1 (opaque). */
	alpha: number
}

export type ShadowLayer = {
	id: string
	x: number
	y: number
	blur: number
	spread: number
	color: AlphaColor
	inset: boolean
}

export type GradientType = 'linear' | 'radial' | 'conic'
export type RadialShape = 'circle' | 'ellipse'

export type GradientStop = {
	id: string
	color: AlphaColor
	/** Position along the gradient, 0-100 (%). */
	position: number
}

export type GradientConfig = {
	type: GradientType
	/** Degrees; used by linear and conic gradients. */
	angle: number
	/** Used by radial gradients. */
	radialShape: RadialShape
	stops: GradientStop[]
}

export type ClampConfig = {
	minSize: number
	maxSize: number
	minViewport: number
	maxViewport: number
	/** Root font size in px, used to express the result in rem. */
	rootFontSize: number
}

export type ClampResult = {
	value: string
	/** Growth of the size per 1vw, in px. */
	slopePerVw: number
	/** Size in px at a viewport width of 0. */
	interceptPx: number
}
