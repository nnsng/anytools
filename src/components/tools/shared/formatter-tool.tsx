import { useDeferredValue, useMemo, useState } from 'react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { CodeBlock } from './code-block'
import { EditorPane } from './editor-pane'

export type Indent = '2' | '4' | 'minify'

const INDENT_OPTIONS: Array<{ value: Indent; label: string }> = [
	{ value: '2', label: '2 Spaces' },
	{ value: '4', label: '4 Spaces' },
	{ value: 'minify', label: 'Minify' },
]

function isIndent(value: string): value is Indent {
	return INDENT_OPTIONS.some((option) => option.value === value)
}

type FormatterToolProps = {
	/** Display name used in messages, e.g. "CSS". */
	language: string
	/** File extension for downloads, without the dot. */
	extension: string
	sample: string
	outputPlaceholder?: string
	format: (input: string, indent: Indent) => string
}

export function FormatterTool({
	language,
	extension,
	sample,
	outputPlaceholder,
	format,
}: FormatterToolProps) {
	const [input, setInput] = useState(sample)
	const [indent, setIndent] = useState<Indent>('2')
	const deferredInput = useDeferredValue(input)

	const { output, error } = useMemo(() => {
		if (!deferredInput.trim()) return { output: '', error: null }
		try {
			return { output: format(deferredInput, indent), error: null }
		} catch (err) {
			return {
				output: '',
				error: err instanceof Error ? err.message : `${language} formatting failed.`,
			}
		}
	}, [deferredInput, indent, format, language])

	return (
		<div className="flex flex-1 flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Input"
				value={input}
				onChange={setInput}
				placeholder={`Paste ${language} code here...`}
				allowUpload={true}
				error={error}
				className="flex-1"
			/>

			<EditorPane
				title="Output"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName={`${indent === 'minify' ? 'minified' : 'formatted'}.${extension}`}
				actions={
					<Select
						value={indent}
						onValueChange={(value) => {
							if (isIndent(value)) setIndent(value)
						}}
					>
						<SelectTrigger
							aria-label="Indentation"
							className="border-terminal-border h-8 font-mono text-xs"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
							{INDENT_OPTIONS.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				}
				className="flex-1"
			>
				<CodeBlock className="flex-1" value={output} placeholder={outputPlaceholder} />
			</EditorPane>
		</div>
	)
}
