export type SourceTab = 'image' | 'text'
export type ShapeType = 'circle' | 'square' | 'rounded' | 'transparent'
export type ImageFit = 'contain' | 'cover' | 'stretch'
export type FontFamily = 'sans-serif' | 'serif' | 'monospace'

export type FaviconSettings = {
	tab: SourceTab
	shape: ShapeType
	bgColor: string
	imageFit: ImageFit
	text: string
	textColor: string
	fontFamily: FontFamily
}
