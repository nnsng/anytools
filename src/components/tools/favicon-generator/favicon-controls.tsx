import { Download, Upload } from 'lucide-react'
import { useRef } from 'react'

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

import type { FaviconSettings, FontFamily, ImageFit, ShapeType } from './types'

const IMAGE_FITS: Array<{ value: ImageFit; label: string }> = [
	{ value: 'contain', label: 'Contain (Keep ratio)' },
	{ value: 'cover', label: 'Cover (Fill canvas)' },
	{ value: 'stretch', label: 'Stretch to fill' },
]

const FONT_FAMILIES: Array<{ value: FontFamily; label: string }> = [
	{ value: 'sans-serif', label: 'Sans-Serif' },
	{ value: 'serif', label: 'Serif' },
	{ value: 'monospace', label: 'Monospace' },
]

const SHAPES: Array<{ value: ShapeType; label: string }> = [
	{ value: 'transparent', label: 'Transparent' },
	{ value: 'rounded', label: 'Rounded Square' },
	{ value: 'circle', label: 'Circle' },
	{ value: 'square', label: 'Square' },
]

function isOption<T extends string>(options: Array<{ value: T }>, value: string): value is T {
	return options.some((option) => option.value === value)
}

type OptionSelectProps<T extends string> = {
	id: string
	label: string
	value: T
	options: Array<{ value: T; label: string }>
	onChange: (value: T) => void
	className?: string
}

function OptionSelect<T extends string>(props: OptionSelectProps<T>) {
	const { id, label, value, options, onChange, className } = props
	return (
		<div className={`flex flex-col gap-1 ${className ?? ''}`}>
			<label htmlFor={id} className="font-bold text-slate-500 uppercase">
				{label}
			</label>
			<Select
				value={value}
				onValueChange={(next) => {
					if (isOption(options, next)) onChange(next)
				}}
			>
				<SelectTrigger id={id} className="border-terminal-border h-8 w-full font-mono text-xs">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

type ColorFieldProps = {
	id: string
	label: string
	value: string
	onChange: (value: string) => void
	className?: string
}

function ColorField({ id, label, value, onChange, className }: ColorFieldProps) {
	return (
		<div className={`flex flex-col gap-1 ${className ?? ''}`}>
			<label htmlFor={id} className="font-bold text-slate-500 uppercase">
				{label}
			</label>
			<div className="flex items-center gap-1.5">
				<input
					id={id}
					type="color"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="border-terminal-border h-7 w-7 cursor-pointer rounded border bg-transparent p-0"
				/>
				<Input
					type="text"
					aria-label={`${label} (hex)`}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="border-terminal-border text-foreground h-7 font-mono text-[10px]"
				/>
			</div>
		</div>
	)
}

type FaviconControlsProps = {
	settings: FaviconSettings
	hasImage: boolean
	onChange: (patch: Partial<FaviconSettings>) => void
	onImageSelected: (file: File) => void
	onDownloadIco: () => void
}

export function FaviconControls(props: FaviconControlsProps) {
	const { settings, hasImage, onChange, onImageSelected, onDownloadIco } = props
	const imageInputRef = useRef<HTMLInputElement>(null)

	return (
		<Pane title="Design controls" className="lg:flex-4">
			<div className="flex flex-col gap-6 p-6">
				<div className="text-xs">
					{settings.tab === 'image' && (
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1">
								<span className="font-bold text-slate-500 uppercase">Image File</span>
								<input
									type="file"
									ref={imageInputRef}
									aria-label="Image file"
									onChange={(e) => {
										const file = e.target.files?.[0]
										if (file) onImageSelected(file)
										e.target.value = ''
									}}
									accept="image/*"
									className="hidden"
								/>
								<button
									type="button"
									onClick={() => imageInputRef.current?.click()}
									className="border-terminal-border bg-terminal-bg/20 hover:bg-terminal-bg/40 focus:ring-matrix/50 flex w-full cursor-pointer flex-col items-center justify-center border border-dashed p-6 focus:ring-1 focus:outline-none"
								>
									{hasImage ? (
										<span className="text-matrix text-xs uppercase">
											File Loaded (Click to replace)
										</span>
									) : (
										<>
											<Upload className="mb-2 h-5 w-5 text-slate-500" />
											<span className="text-xs text-slate-400">Upload square image</span>
										</>
									)}
								</button>
							</div>

							{hasImage && (
								<OptionSelect
									id="fit-mode"
									label="Fit Mode"
									value={settings.imageFit}
									options={IMAGE_FITS}
									onChange={(imageFit) => onChange({ imageFit })}
								/>
							)}
						</div>
					)}

					{settings.tab === 'text' && (
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1">
								<label htmlFor="text-val" className="font-bold text-slate-500 uppercase">
									Icon Text (1-3 chars)
								</label>
								<Input
									id="text-val"
									type="text"
									maxLength={3}
									value={settings.text}
									onChange={(e) => onChange({ text: e.target.value.toUpperCase() })}
									className="border-terminal-border text-foreground h-8 font-mono text-xs"
								/>
							</div>
							<div className="flex flex-row gap-4">
								<ColorField
									id="text-color"
									label="Text Color"
									value={settings.textColor}
									onChange={(textColor) => onChange({ textColor })}
									className="flex-1"
								/>
								<OptionSelect
									id="font-fam"
									label="Font Family"
									value={settings.fontFamily}
									options={FONT_FAMILIES}
									onChange={(fontFamily) => onChange({ fontFamily })}
									className="flex-1"
								/>
							</div>
						</div>
					)}

					<div className="border-terminal-border mt-4 flex flex-col gap-4 border-t pt-4">
						<OptionSelect
							id="shape-sel"
							label="Background Shape"
							value={settings.shape}
							options={SHAPES}
							onChange={(shape) => onChange({ shape })}
						/>

						{settings.shape !== 'transparent' && (
							<ColorField
								id="bg-color"
								label="Background Color"
								value={settings.bgColor}
								onChange={(bgColor) => onChange({ bgColor })}
							/>
						)}
					</div>
				</div>

				<div className="mt-auto flex flex-col gap-2">
					<Button onClick={onDownloadIco} className="w-full text-xs font-bold">
						<Download className="mr-2 h-3.5 w-3.5" />
						DOWNLOAD MULTI-SIZE ICO
					</Button>
					<span className="text-center text-[10px] text-slate-500 uppercase">
						Includes 16x16, 32x32, and 48x48 PNG sizes
					</span>
				</div>
			</div>
		</Pane>
	)
}
