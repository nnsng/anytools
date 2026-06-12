import { marked } from 'marked'
import { useEffect, useState } from 'react'
import { EditorPane } from '../shared/editor-pane'

export default function MarkdownPreview() {
	const [input, setInput] = useState<string>(`# AnyTools Markdown Previewer

Welcome to the **AnyTools** live Markdown compiler.

## Key Features

1. **Pure Client-Side**: All parsing happens in your browser.
2. **Real-Time Rendering**: Type on the left, see the results on the right.
3. **Github Flavored**: Supports lists, code blocks, tables, and more.

### Code Block Demo

\`\`\`javascript
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};
greet('Matrix Operator');
\`\`\`

> "The Matrix is everywhere. It is all around us. Even now, in this very room." - Morpheus

| Feature | Supported | Latency |
| :--- | :---: | :---: |
| Tables | Yes | 0ms |
| Bold/Italics | Yes | 0ms |
| Inline Code | Yes | 0ms |
`)

	const [compiledHtml, setCompiledHtml] = useState<string>('')

	useEffect(() => {
		const renderMarkdown = async () => {
			if (!input.trim()) {
				setCompiledHtml('')
				return
			}

			try {
				const html = await marked.parse(input)
				setCompiledHtml(html)
			} catch (err) {
				console.error('Failed to parse markdown: ', err)
			}
		}

		renderMarkdown()
	}, [input])

	return (
		<div className="grid h-[calc(100vh-220px)] min-h-[500px] grid-cols-1 gap-6 lg:grid-cols-2">
			<EditorPane
				title="Markdown Input"
				value={input}
				onChange={setInput}
				placeholder="Enter markdown syntax here..."
				allowUpload={true}
			/>

			<div className="flex flex-col rounded-sm border border-terminal-border bg-terminal-card/60">
				{/* Pane Header */}
				<div className="flex items-center justify-between border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
					<span className="flex items-center gap-2 font-bold font-mono text-slate-300 text-xs uppercase tracking-wider">
						<span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
						Markdown Preview
					</span>
				</div>

				{/* Preview Scrollbox */}
				<div className="scrollbar-thin flex-grow select-text overflow-y-auto p-6 font-sans text-slate-300">
					{compiledHtml ? (
						<div
							className="prose prose-invert prose-li:my-1 prose-table:my-4 prose-table:w-full max-w-none prose-table:border-collapse prose-ol:list-decimal prose-ul:list-disc prose-code:rounded prose-pre:rounded-sm prose-pre:border prose-td:border prose-th:border prose-blockquote:border-matrix/40 prose-h1:border-slate-800 prose-pre:border-slate-800 prose-td:border-slate-800 prose-th:border-slate-800 prose-h1:border-b prose-blockquote:border-l-4 prose-code:bg-slate-900 prose-pre:bg-slate-900 prose-th:bg-slate-900 prose-pre:p-4 prose-td:p-2 prose-th:p-2 prose-code:px-1 prose-code:py-0.5 prose-h1:pb-2 prose-blockquote:pl-4 prose-code:font-mono prose-headings:font-bold prose-headings:font-mono prose-pre:font-mono prose-strong:font-bold prose-th:font-mono prose-a:text-matrix prose-blockquote:text-slate-500 prose-code:text-matrix-glow prose-code:text-xs prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-headings:text-white prose-li:text-sm prose-p:text-slate-400 prose-p:text-sm prose-pre:text-xs prose-strong:text-white prose-td:text-xs prose-th:text-xs prose-blockquote:italic prose-p:leading-relaxed prose-a:no-underline hover:prose-a:underline"
							dangerouslySetInnerHTML={{ __html: compiledHtml }}
						/>
					) : (
						<div className="flex h-full select-none items-center justify-center font-mono text-slate-600 text-xs">
							Waiting for markdown input...
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
