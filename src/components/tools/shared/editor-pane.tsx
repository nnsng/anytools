import { Check, Copy, Download, Trash2, Upload } from 'lucide-react'
import type React from 'react'
import { useMemo, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { downloadBlob, readFileAsText } from '@/lib/file'
import { cn } from '@/lib/utils'

import { CodeBlock } from './code-block'
import { Pane } from './pane'

type EditorPaneProps = {
	title: string
	value: string
	onChange?: (value: string) => void
	placeholder?: string
	readOnly?: boolean
	error?: string | null
	allowUpload?: boolean
	allowDownload?: boolean
	downloadFileName?: string
	actions?: React.ReactNode
	className?: string
	children?: React.ReactNode // For custom content (like syntax highlighters or preview blocks)
}

export function EditorPane(props: EditorPaneProps) {
	const {
		title,
		value,
		onChange,
		placeholder = 'Enter input here...',
		readOnly = false,
		error = null,
		allowUpload = false,
		allowDownload = false,
		downloadFileName = 'output.txt',
		actions,
		className,
		children,
	} = props

	const { isCopied, copy } = useCopyToClipboard()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleDownload = () => {
		if (!value) return
		downloadBlob(new Blob([value], { type: 'text/plain;charset=utf-8' }), downloadFileName)
	}

	const handleCopy = () => copy(value)

	const handleClear = () => {
		if (onChange) onChange('')
	}

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target
		const file = input.files?.[0]
		if (!file || !onChange) return
		try {
			onChange(await readFileAsText(file))
		} finally {
			// allow re-uploading the same file
			input.value = ''
		}
	}

	const characterCount = value.length
	const lineCount = useMemo(() => {
		if (!value) return 0
		let count = 1
		for (let i = value.indexOf('\n'); i !== -1; i = value.indexOf('\n', i + 1)) count++
		return count
	}, [value])

	const editorActions = (
		<div className="flex items-center gap-1">
			{actions}

			{allowUpload && onChange && (
				<>
					<Input
						type="file"
						ref={fileInputRef}
						onChange={handleFileUpload}
						className="hidden"
						tabIndex={-1}
						aria-hidden="true"
						accept=".txt,.json,.xml,.csv,.html,.js,.css,.md"
					/>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0"
						onClick={() => fileInputRef.current?.click()}
						title="Upload file"
						aria-label="Upload file"
					>
						<Upload className="h-3.5 w-3.5" />
					</Button>
				</>
			)}

			{value && (
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0"
					onClick={handleCopy}
					title="Copy to clipboard"
					aria-label="Copy to clipboard"
				>
					{isCopied ? (
						<Check className="text-matrix h-3.5 w-3.5" />
					) : (
						<Copy className="h-3.5 w-3.5" />
					)}
				</Button>
			)}

			{allowDownload && value && (
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0"
					onClick={handleDownload}
					title="Download as file"
					aria-label="Download as file"
				>
					<Download className="h-3.5 w-3.5" />
				</Button>
			)}

			{!readOnly && onChange && value && (
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0 hover:border-red-500/20 hover:text-red-500"
					onClick={handleClear}
					title="Clear input"
					aria-label="Clear input"
				>
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			)}
		</div>
	)

	return (
		<Pane
			title={title}
			scrollable={false}
			actions={editorActions}
			className={className}
			dotClassName={readOnly ? 'bg-blue-500' : ''}
			footer={
				<div className="flex items-center justify-between px-4 py-1.5 font-mono text-xs text-slate-500 select-none">
					<span>LINES: {lineCount}</span>
					<span>CHARS: {characterCount}</span>
				</div>
			}
		>
			{/* Pane Content */}
			<div className="relative flex min-h-55 flex-1 flex-col lg:min-h-0">
				{children ? (
					<div className="flex flex-1 flex-col overflow-auto font-mono text-sm">{children}</div>
				) : (
					<textarea
						aria-label={title}
						value={value}
						onChange={(e) => onChange?.(e.target.value)}
						placeholder={placeholder}
						readOnly={readOnly}
						className={cn(
							'text-foreground placeholder:text-muted-foreground w-full flex-1 resize-none scrollbar-thin bg-transparent p-4 font-mono text-sm focus:outline-none',
							error && 'border border-red-500/20 focus:border-red-500/40',
						)}
					/>
				)}

				{error && (
					<CodeBlock
						value={error}
						className="absolute right-0 bottom-0 left-0 overflow-y-auto border-t border-red-500/20 bg-red-950/40 p-3 text-xs text-red-400"
					/>
				)}
			</div>
		</Pane>
	)
}
