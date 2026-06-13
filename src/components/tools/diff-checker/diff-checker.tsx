import { diff_match_patch as DiffMatchPatch } from 'diff-match-patch'
import { useEffect, useState } from 'react'
import { Pane } from '@/components/tools/shared'
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
				type="output"
				actions={
					<Tabs value={diffMode} onValueChange={setDiffMode}>
						<TabsList>
							<TabsTrigger value="inline">Inline View</TabsTrigger>
							<TabsTrigger value="side-by-side">Split View</TabsTrigger>
						</TabsList>
					</Tabs>
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
