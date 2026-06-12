type StubProps = {
	toolId: string
	name: string
}

export default function ToolStub({ toolId, name }: StubProps) {
	return (
		<div className="rounded border border-terminal-border border-dashed bg-terminal-card/50 p-8">
			<h2 className="mb-2 cursor-blink font-bold font-mono text-matrix text-xl">{name}</h2>
			<p className="font-mono text-slate-400 text-sm">
				Status: Under Construction (Tool ID:{' '}
				<code className="rounded bg-slate-900 px-1 py-0.5 text-slate-300">{toolId}</code>)
			</p>
			<div className="mt-6 rounded border border-terminal-border bg-terminal-bg p-4 font-mono text-slate-500 text-xs">
				$ ./load-tool --id={toolId}
				<br />
				<span className="pulse-fast text-matrix">System initializing module core...</span>
			</div>
		</div>
	)
}
