import { diff_match_patch } from 'diff-match-patch'
import type React from 'react'
import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Tabs } from '@/components/ui/tabs'

export default function DiffChecker() {
	const [textA, setTextA] = useState<string>(
		'const user = {\n  name: "Neo",\n  role: "The One",\n  skills: ["Kung Fu", "Flight"]\n};\nconsole.log(user);',
	)
	const [textB, setTextB] = useState<string>(
		'const user = {\n  name: "Thomas Anderson",\n  role: "Developer",\n  skills: ["Kung Fu", "Flight", "Hacking"],\n  status: "active"\n};\nconsole.log(user);',
	)
	const [diffMode, setDiffMode] = useState<string>('inline') // 'inline' or 'side-by-side'

	const [diffs, setDiffs] = useState<[number, string][]>([])

	useEffect(() => {
		const dmp = new diff_match_patch()
		const computedDiffs = dmp.diff_main(textA, textB)
		dmp.diff_cleanupSemantic(computedDiffs)
		setDiffs(computedDiffs)
	}, [textA, textB])

	const renderInlineDiff = () => {
		if (diffs.length === 0)
			return <div className="text-slate-500 italic">No difference found.</div>

		return (
			<pre className="h-full min-h-[300px] w-full select-text whitespace-pre-wrap break-all rounded border border-terminal-border bg-slate-950 p-4 font-mono text-slate-300 text-sm">
				{diffs.map(([op, text], idx) => {
					if (op === 0) {
						return <span key={idx}>{text}</span>
					}
					if (op === -1) {
						return (
							<span
								key={idx}
								className="border border-red-500/20 bg-red-950 px-0.5 text-red-400 line-through"
							>
								{text}
							</span>
						)
					}
					return (
						<span
							key={idx}
							className="border border-matrix/20 bg-green-950 px-0.5 font-bold text-matrix-glow"
						>
							{text}
						</span>
					)
				})}
			</pre>
		)
	}

	const renderSideBySide = () => {
		// Generate split content for A and B
		const leftPane: React.ReactNode[] = []
		const rightPane: React.ReactNode[] = []

		diffs.forEach(([op, text], idx) => {
			if (op === 0) {
				leftPane.push(<span key={`l-${idx}`}>{text}</span>)
				rightPane.push(<span key={`r-${idx}`}>{text}</span>)
			} else if (op === -1) {
				leftPane.push(
					<span
						key={`l-${idx}`}
						className="block border border-red-500/20 bg-red-950 px-0.5 text-red-400 md:inline"
					>
						{text}
					</span>,
				)
			} else {
				rightPane.push(
					<span
						key={`r-${idx}`}
						className="block border border-matrix/20 bg-green-950 px-0.5 font-bold text-matrix-glow md:inline"
					>
						{text}
					</span>,
				)
			}
		})

		return (
			<div className="grid h-full min-h-[350px] grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="flex flex-col rounded-sm border border-terminal-border bg-terminal-card/40">
					<div className="border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
						<span className="font-bold font-mono text-slate-300 text-xs uppercase tracking-wider">
							Original (Text A)
						</span>
					</div>
					<pre className="scrollbar-thin max-h-[400px] flex-grow select-text overflow-y-auto whitespace-pre-wrap break-all bg-slate-950 p-4 font-mono text-slate-400 text-sm">
						{leftPane}
					</pre>
				</div>

				<div className="flex flex-col rounded-sm border border-terminal-border bg-terminal-card/40">
					<div className="border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
						<span className="font-bold font-mono text-slate-300 text-xs uppercase tracking-wider">
							Modified (Text B)
						</span>
					</div>
					<pre className="scrollbar-thin max-h-[400px] flex-grow select-text overflow-y-auto whitespace-pre-wrap break-all bg-slate-950 p-4 font-mono text-slate-200 text-sm">
						{rightPane}
					</pre>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6 font-mono">
			<div className="grid min-h-[220px] grid-cols-1 gap-6 lg:grid-cols-2">
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

					<Tabs
						tabs={[
							{ id: 'inline', label: 'Inline View' },
							{ id: 'side-by-side', label: 'Split View' },
						]}
						activeTab={diffMode}
						onChange={setDiffMode}
					/>
				</div>

				<div>
					{diffMode === 'inline' ? renderInlineDiff() : renderSideBySide()}
				</div>
			</div>
		</div>
	)
}
