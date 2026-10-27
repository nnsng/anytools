import { Image as ImageIcon, Type } from 'lucide-react'
import { useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { downloadBlob, readFileAsDataUrl } from '@/lib/file'

import { FaviconControls } from './favicon-controls'
import { FaviconPreview } from './favicon-preview'
import type { FaviconSettings, SourceTab } from './types'
import { generateIco } from './utils'

const DEFAULT_SETTINGS: FaviconSettings = {
	tab: 'image',
	shape: 'rounded',
	bgColor: '#00ff66',
	imageFit: 'contain',
	text: 'GO',
	textColor: '#000000',
	fontFamily: 'sans-serif',
}

function isSourceTab(value: string): value is SourceTab {
	return value === 'image' || value === 'text'
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => resolve(image)
		image.onerror = () => reject(new Error('Failed to load image'))
		image.src = src
	})
}

export default function FaviconGenerator() {
	const [settings, setSettings] = useState<FaviconSettings>(DEFAULT_SETTINGS)
	// The decoded image is kept once so redraws (e.g. dragging a color picker) don't re-decode it
	const [image, setImage] = useState<HTMLImageElement | null>(null)
	const [error, setError] = useState<string | null>(null)

	const handleChange = (patch: Partial<FaviconSettings>) =>
		setSettings((current) => ({ ...current, ...patch }))

	const handleImageSelected = async (file: File) => {
		try {
			setImage(await loadImage(await readFileAsDataUrl(file)))
			setError(null)
		} catch {
			setError('Could not load this image. Try a PNG, JPG or SVG file.')
		}
	}

	const handleDownloadIco = async () => {
		try {
			downloadBlob(await generateIco(settings, image), 'favicon.ico')
			setError(null)
		} catch {
			setError('Failed to generate the ICO file.')
		}
	}

	return (
		<Tabs
			value={settings.tab}
			onValueChange={(tab) => {
				if (isSourceTab(tab)) handleChange({ tab })
			}}
			className="gap-4"
		>
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

			{error && (
				<div role="alert" className="text-destructive font-mono text-xs">
					{error}
				</div>
			)}

			<div className="flex flex-col gap-6 lg:flex-row">
				<FaviconControls
					settings={settings}
					hasImage={image !== null}
					onChange={handleChange}
					onImageSelected={handleImageSelected}
					onDownloadIco={handleDownloadIco}
				/>
				<FaviconPreview settings={settings} image={image} />
			</div>
		</Tabs>
	)
}
