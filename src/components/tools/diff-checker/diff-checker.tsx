import { diff_match_patch } from 'diff-match-patch'
import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InlineDiffView, SideBySideView } from './diff-views'

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
		const dmp = new diff_match_patch()
		const computedDiffs = dmp.diff_main(textA, textB)
		dmp.diff_cleanupSemantic(computedDiffs)
		setDiffs(computedDiffs)
	}, [textA, textB])

	return (
		<div className="flex h-full flex-col gap-6 font-mono">
			<div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
				<EditorPane
					title="Original Text (A)"
					value={textA}
					onChange={setTextA}
					placeholder="Enter the original code or text block here..."
					allowUpload={true}
				/>
				<EditorPane
					title="Modified Text (B)"
					value={textB}
					onChange={setTextB}
					placeholder="Enter the modified code or text block here..."
					allowUpload={true}
				/>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between border-terminal-border border-b pb-2">
					<span className="flex items-center gap-2 font-bold text-slate-300 text-xs uppercase tracking-wider">
						<span className="h-1.5 w-1.5 rounded-full bg-matrix" />
						Comparison Results
					</span>

					<Tabs value={diffMode} onValueChange={setDiffMode}>
						<TabsList>
							<TabsTrigger value="inline">Inline View</TabsTrigger>
							<TabsTrigger value="side-by-side">Split View</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				<div>
					{diffMode === 'inline' ? (
						<InlineDiffView diffs={diffs} />
					) : (
						<SideBySideView diffs={diffs} />
					)}
				</div>
			</div>
		</div>
	)
}
