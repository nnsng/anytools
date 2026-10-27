import { Button } from '@/components/ui/button'
import { downloadBlob } from '@/lib/file'

import { FaviconCanvas } from './favicon-canvas'
import type { FaviconSettings } from './types'
import { canvasToPng, createFaviconCanvas } from './utils'

type SizeCard = {
	size: number
	label: string
	/** Tailwind classes for the on-screen canvas size. */
	displayClassName: string
	caption: string
}

const SIZE_CARDS: SizeCard[] = [
	{ size: 16, label: '16 x 16 (Standard)', displayClassName: 'h-4 w-4', caption: 'ACTUAL SIZE' },
	{ size: 32, label: '32 x 32 (Taskbar)', displayClassName: 'h-8 w-8', caption: 'ACTUAL SIZE' },
	{ size: 48, label: '48 x 48 (Desktop)', displayClassName: 'h-12 w-12', caption: 'ACTUAL SIZE' },
	{
		size: 180,
		label: '180 x 180 (Apple Touch)',
		displayClassName: 'h-14 w-14',
		caption: 'SCALED PREVIEW',
	},
]

type FaviconPreviewProps = {
	settings: FaviconSettings
	image: HTMLImageElement | null
}

export function FaviconPreview({ settings, image }: FaviconPreviewProps) {
	const handleDownloadPng = async (size: number) => {
		const png = await canvasToPng(createFaviconCanvas(size, settings, image))
		downloadBlob(png, `favicon-${size}x${size}.png`)
	}

	return (
		<div className="flex flex-col gap-6 lg:flex-8">
			{/* Mock Browser Tab Preview */}
			<div className="border-terminal-border bg-muted/50 rounded border p-1">
				<div className="border-border bg-muted flex items-center gap-2 border-b px-3 py-2">
					<div className="flex gap-1.5" aria-hidden="true">
						<div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
						<div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
						<div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
					</div>
					<div className="bg-muted/50 text-foreground ml-4 flex h-7 items-center gap-2 rounded-t-sm px-3 font-sans text-xs">
						<FaviconCanvas
							size={16}
							settings={settings}
							image={image}
							className="h-4 w-4 bg-transparent"
						/>
						<span className="max-w-20 truncate">Your Web App</span>
						<span className="text-muted-foreground ml-1 text-xs">×</span>
					</div>
				</div>
				<div className="bg-muted/50 flex h-12 items-center px-3 py-2">
					<div className="border-border bg-muted text-muted-foreground flex h-6 w-full items-center rounded-sm border px-3 font-sans text-xs">
						https://yourdomain.com
					</div>
				</div>
			</div>

			{/* Sizes Grid */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				{SIZE_CARDS.map((card) => (
					<div
						key={card.size}
						className="border-terminal-border bg-terminal-card/30 flex flex-col items-center justify-between rounded border p-4"
					>
						<span className="mb-2 text-xs text-slate-500">{card.label}</span>
						<div className="flex h-20 items-center justify-center">
							<div className="flex flex-col items-center gap-2">
								<FaviconCanvas
									size={card.size}
									settings={settings}
									image={image}
									className={`${card.displayClassName} rounded border border-slate-800`}
								/>
								<span className="text-[8px] text-slate-600">{card.caption}</span>
							</div>
						</div>
						<Button
							variant="secondary"
							size="sm"
							onClick={() => handleDownloadPng(card.size)}
							className="mt-2 h-7 w-full text-[10px]"
						>
							DOWNLOAD PNG
						</Button>
					</div>
				))}
			</div>
		</div>
	)
}
