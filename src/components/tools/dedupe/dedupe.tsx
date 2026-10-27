import { useDeferredValue, useMemo, useState } from 'react'

import { CodeBlock, EditorPane, Pane } from '@/components/tools/shared'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { deduplicate, type Separator, type SortOrder } from './utils'

export default function Dedupe() {
	const [input, setInput] = useState<string>(
		'apple\nBanana\napple\norange\nbanana\n  orange  \n\npear',
	)
	const [caseSensitive, setCaseSensitive] = useState<boolean>(true)
	const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true)
	const [removeEmpty, setRemoveEmpty] = useState<boolean>(true)
	const [sortOrder, setSortOrder] = useState<SortOrder>('none')
	const [separator, setSeparator] = useState<Separator>('newline')

	const deferredInput = useDeferredValue(input)

	const output = useMemo(
		() =>
			deduplicate(deferredInput, caseSensitive, trimWhitespace, removeEmpty, sortOrder, separator),
		[deferredInput, caseSensitive, trimWhitespace, removeEmpty, sortOrder, separator],
	)

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
							className="hover:text-foreground cursor-pointer font-semibold text-slate-300 select-none"
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
							className="hover:text-foreground cursor-pointer font-semibold text-slate-300 select-none"
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
							className="hover:text-foreground cursor-pointer font-semibold text-slate-300 select-none"
						>
							Remove Empty Lines
						</label>
					</div>

					<div className="flex items-center gap-2 lg:ml-auto">
						<span className="text-xs font-bold text-slate-500 uppercase">Separator:</span>
						<Select value={separator} onValueChange={setSeparator}>
							<SelectTrigger className="border-terminal-border bg-terminal-bg text-foreground h-8 w-32 font-mono text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-terminal-border bg-terminal-card text-foreground font-mono text-xs">
								<SelectItem value="newline">New Line</SelectItem>
								<SelectItem value="comma">Comma (,)</SelectItem>
								<SelectItem value="semicolon">Semicolon (;)</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-xs font-bold text-slate-500 uppercase">Sort:</span>
						<Select value={sortOrder} onValueChange={setSortOrder}>
							<SelectTrigger className="border-terminal-border bg-terminal-bg text-foreground h-8 w-32 font-mono text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-terminal-border bg-terminal-card text-foreground font-mono text-xs">
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
					<CodeBlock className="flex-1" value={output} />
				</EditorPane>
			</div>
		</div>
	)
}
