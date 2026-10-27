type StubProps = {
	toolId: string
	name: string
}

export function ToolStub({ toolId, name }: StubProps) {
	return (
		<div className="border-terminal-border bg-terminal-card/50 h-fit rounded border border-dashed p-8">
			<h2 className="text-matrix mb-2 font-mono text-xl font-bold">{name}</h2>
			<p className="font-mono text-sm text-slate-400">
				Status: Under Construction (Tool ID:{' '}
				<code className="bg-muted rounded px-1 py-0.5 text-slate-300">{toolId}</code>)
			</p>
			<div className="border-terminal-border bg-terminal-bg mt-6 rounded border p-4 font-mono text-xs text-slate-500">
				$ ./load-tool --id={toolId}
				<br />
				<span className="pulse-fast text-matrix">System initializing module core...</span>
			</div>
		</div>
	)
}
