import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane, Pane } from '@/components/tools/shared'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

function deduplicate(
	text: string,
	caseSensitive: boolean,
	trimWhitespace: boolean,
	removeEmpty: boolean,
	sortOrder: string,
	separator: string,
): string {
	if (!text) return ''

	let items: string[] = []
	if (separator === 'comma') {
		items = text.split(',')
	} else if (separator === 'semicolon') {
		items = text.split(';')
	} else {
		items = text.split(/\r?\n/)
	}

	if (trimWhitespace) {
		items = items.map((item) => item.trim())
	}

	if (removeEmpty) {
		items = items.filter((item) => item.length > 0)
	}

	const seen = new Set<string>()
	const result: string[] = []

	for (const item of items) {
		const key = caseSensitive ? item : item.toLowerCase()
		if (!seen.has(key)) {
			seen.add(key)
			result.push(item)
		}
	}

	if (sortOrder === 'asc') {
		result.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
	} else if (sortOrder === 'desc') {
		result.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }))
	}

	if (separator === 'comma') {
		return result.join(', ')
	}
	if (separator === 'semicolon') {
		return result.join('; ')
	}
	return result.join('\n')
}

export default function Dedupe() {
	const [input, setInput] = useState<string>(
		'apple\nBanana\napple\norange\nbanana\n  orange  \n\npear',
	)
	const [output, setOutput] = useState<string>('')
	const [caseSensitive, setCaseSensitive] = useState<boolean>(true)
	const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true)
	const [removeEmpty, setRemoveEmpty] = useState<boolean>(true)
	const [sortOrder, setSortOrder] = useState<string>('none')
	const [separator, setSeparator] = useState<string>('newline')

	useEffect(() => {
		const result = deduplicate(
			input,
			caseSensitive,
			trimWhitespace,
			removeEmpty,
			sortOrder,
			separator,
		)
		setOutput(result)
	}, [input, caseSensitive, trimWhitespace, removeEmpty, sortOrder, separator])

	return (
		<div className="flex flex-1 flex-col gap-6">
			{/* Config Bar */}
			<Pane title="Deduplication Settings" className="lg:col-span-12">
				<div className="flex flex-wrap items-center gap-6 p-4 font-mono text-xs">
					<div className="flex items-center gap-2.5">
						<Checkbox
							id="case-sensitive"
							checked={caseSensitive}
							onCheckedChange={(checked) => setCaseSensitive(checked === true)}
						/>
						<label
							htmlFor="case-sensitive"
							className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
						>
							Case Sensitive
						</label>
					</div>

					<div className="flex items-center gap-2.5">
						<Checkbox
							id="trim-whitespace"
							checked={trimWhitespace}
							onCheckedChange={(checked) => setTrimWhitespace(checked === true)}
						/>
						<label
							htmlFor="trim-whitespace"
							className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
						>
							Trim Whitespace
						</label>
					</div>

					<div className="flex items-center gap-2.5">
						<Checkbox
							id="remove-empty"
							checked={removeEmpty}
							onCheckedChange={(checked) => setRemoveEmpty(checked === true)}
						/>
						<label
							htmlFor="remove-empty"
							className="cursor-pointer select-none font-semibold text-slate-300 hover:text-white"
						>
							Remove Empty Lines
						</label>
					</div>

					<div className="flex items-center gap-2 lg:ml-auto">
						<span className="font-bold text-[10px] text-slate-500 uppercase">Separator:</span>
						<Select value={separator} onValueChange={setSeparator}>
							<SelectTrigger className="h-8 w-32 border-terminal-border bg-terminal-bg font-mono text-white text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-terminal-border bg-terminal-card font-mono text-white text-xs">
								<SelectItem value="newline">New Line</SelectItem>
								<SelectItem value="comma">Comma (,)</SelectItem>
								<SelectItem value="semicolon">Semicolon (;)</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<span className="font-bold text-[10px] text-slate-500 uppercase">Sort:</span>
						<Select value={sortOrder} onValueChange={setSortOrder}>
							<SelectTrigger className="h-8 w-32 border-terminal-border bg-terminal-bg font-mono text-white text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-terminal-border bg-terminal-card font-mono text-white text-xs">
								<SelectItem value="none">None</SelectItem>
								<SelectItem value="asc">Ascending</SelectItem>
								<SelectItem value="desc">Descending</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</Pane>

			{/* Editors */}
			<div className="flex flex-1 flex-col gap-6 lg:flex-row">
				<EditorPane
					title="Input List"
					value={input}
					onChange={setInput}
					placeholder="Enter list items here..."
					allowUpload={true}
					className="lg:flex-1"
				/>

				<EditorPane
					title="Deduplicated Output"
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName="deduplicated.txt"
					className="lg:flex-1"
				>
					{output ? (
						<CodeBlock className="flex-1">{output}</CodeBlock>
					) : (
						<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
							Waiting for input...
						</div>
					)}
				</EditorPane>
			</div>
		</div>
	)
}
