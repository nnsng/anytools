import { Check, Copy, Download, Trash2, Upload } from 'lucide-react'
import type React from 'react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

	const [copied, setCopied] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleDownload = () => {
		if (!value) return
		const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = downloadFileName
		link.click()
		URL.revokeObjectURL(url)
	}

	const handleCopy = async () => {
		if (!value) return
		try {
			await navigator.clipboard.writeText(value)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy text: ', err)
		}
	}

	const handleClear = () => {
		if (onChange) onChange('')
	}

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file || !onChange) return
		const reader = new FileReader()
		reader.onload = (event) => {
			if (event.target?.result) {
				onChange(event.target.result as string)
			}
		}
		reader.readAsText(file)
	}

	const characterCount = value.length
	const lineCount = value ? value.split('\n').length : 0

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
						accept=".txt,.json,.xml,.csv,.html,.js,.css,.md"
					/>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0"
						onClick={() => fileInputRef.current?.click()}
						title="Upload file"
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
				>
					{copied ? (
						<Check className="h-3.5 w-3.5 text-matrix" />
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
				>
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			)}
		</div>
	)

	return (
		<Pane
			title={title}
			type={readOnly ? 'output' : 'input'}
			scrollable={false}
			actions={editorActions}
			className={className}
			footer={
				<div className="flex select-none items-center justify-between px-4 py-1.5 font-mono text-[10px] text-slate-500">
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
						value={value}
						onChange={(e) => onChange?.(e.target.value)}
						placeholder={placeholder}
						readOnly={readOnly}
						className={cn(
							'scrollbar-thin w-full flex-1 resize-none bg-transparent p-4 font-mono text-slate-100 text-sm placeholder-slate-700 focus:outline-none',
							error && 'border border-red-500/20 focus:border-red-500/40',
						)}
					/>
				)}

				{error && (
					<CodeBlock
						value={error}
						className="absolute right-0 bottom-0 left-0 overflow-y-auto border-red-500/20 border-t bg-red-950/40 p-3 text-red-400 text-xs"
					/>
				)}
			</div>
		</Pane>
	)
}
