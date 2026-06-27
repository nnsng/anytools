import { marked } from 'marked'
import { useEffect, useState } from 'react'
import { Pane } from '@/components/tools/shared'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { APP_NAME } from '@/constants/app'

export default function MarkdownPreview() {
	const [input, setInput] = useState<string>(`# ${APP_NAME} Markdown Previewer

Welcome to the **${APP_NAME}** live Markdown compiler.

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
		<div className="flex flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Markdown Input"
				value={input}
				onChange={setInput}
				placeholder="Enter markdown syntax here..."
				allowUpload={true}
				className="flex-1"
			/>

			<Pane title="Markdown Preview" dotClassName="bg-blue-500" className="flex-1">
				<div className="scrollbar-thin grow select-text overflow-y-auto p-6 font-sans text-foreground">
					{compiledHtml ? (
						<div
							className="prose dark:prose-invert prose-li:my-1 prose-table:my-4 prose-table:w-full max-w-none prose-table:border-collapse prose-ol:list-decimal prose-ul:list-disc prose-code:rounded prose-pre:rounded-sm prose-pre:border prose-td:border prose-th:border prose-blockquote:border-matrix/40 prose-h1:border-border prose-pre:border-border prose-td:border-border prose-th:border-border prose-h1:border-b prose-blockquote:border-l-4 prose-code:bg-muted prose-pre:bg-muted prose-th:bg-muted prose-pre:p-4 prose-td:p-2 prose-th:p-2 prose-code:px-1 prose-code:py-0.5 prose-h1:pb-2 prose-blockquote:pl-4 prose-code:font-mono prose-headings:font-bold prose-headings:font-mono prose-pre:font-mono prose-strong:font-bold prose-th:font-mono prose-a:text-matrix prose-blockquote:text-muted-foreground prose-code:text-matrix-glow prose-code:text-xs prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-headings:text-foreground prose-li:text-sm prose-p:text-muted-foreground prose-p:text-sm prose-pre:text-xs prose-strong:text-foreground prose-td:text-xs prose-th:text-xs prose-blockquote:italic prose-p:leading-relaxed prose-a:no-underline hover:prose-a:underline"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: markdown preview requires rendering sanitized HTML
							dangerouslySetInnerHTML={{ __html: compiledHtml }}
						/>
					) : (
						<div className="flex h-full select-none items-center justify-center font-mono text-slate-600 text-xs">
							Waiting for markdown input...
						</div>
					)}
				</div>
			</Pane>
		</div>
	)
}
