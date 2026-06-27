import { diff_match_patch as DiffMatchPatch } from 'diff-match-patch'
import { useEffect, useState } from 'react'
import { Pane } from '@/components/tools/shared'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { InlineDiffView, SideBySideView } from './diff-views'

const viewOptions = [
	{ value: 'inline', label: 'Inline' },
	{ value: 'side-by-side', label: 'Side by Side' },
]

export default function DiffChecker() {
	const [textA, setTextA] = useState<string>(
		'const user = {\n  name: "Neo",\n  role: "The One",\n  skills: ["Kung Fu", "Flight"]\n};\nconsole.log(user);',
	)
	const [textB, setTextB] = useState<string>(
		'const user = {\n  name: "Thomas Anderson",\n  role: "Developer",\n  skills: ["Kung Fu", "Flight", "Hacking"],\n  status: "active"\n};\nconsole.log(user);',
	)
	const [diffMode, setDiffMode] = useState<string>('inline')

	const [diffs, setDiffs] = useState<[number, string][]>([])

	useEffect(() => {
		const dmp = new DiffMatchPatch()
		const computedDiffs = dmp.diff_main(textA, textB)
		dmp.diff_cleanupSemantic(computedDiffs)
		setDiffs(computedDiffs)
	}, [textA, textB])

	const DiffComponent = diffMode === 'inline' ? InlineDiffView : SideBySideView

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-1 flex-col gap-6 lg:flex-row">
				<EditorPane
					title="Original Text (A)"
					value={textA}
					onChange={setTextA}
					placeholder="Enter the original code or text block here..."
					allowUpload={true}
					className="flex-1"
				/>
				<EditorPane
					title="Modified Text (B)"
					value={textB}
					onChange={setTextB}
					placeholder="Enter the modified code or text block here..."
					allowUpload={true}
					className="flex-1"
				/>
			</div>

			<Pane
				title="Comparison Results"
				dotClassName="bg-blue-500"
				actions={
					<div className="flex items-center gap-2 font-mono">
						<span className="font-bold text-[10px] text-slate-500 uppercase">View:</span>
						<Select value={diffMode} onValueChange={setDiffMode}>
							<SelectTrigger className="h-8 w-36 border-terminal-border bg-terminal-bg font-mono text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
								{viewOptions.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				}
				className="flex-1"
			>
				<div className="h-full p-4">
					<DiffComponent diffs={diffs} className="h-full" />
				</div>
			</Pane>
		</div>
	)
}
