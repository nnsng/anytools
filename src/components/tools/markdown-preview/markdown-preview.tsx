import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useDeferredValue, useMemo, useState } from 'react'

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

	const deferredInput = useDeferredValue(input)

	const { html: compiledHtml, error } = useMemo(() => {
		if (!deferredInput.trim()) return { html: '', error: '' }
		try {
			const rawHtml = marked.parse(deferredInput, { async: false })
			return { html: DOMPurify.sanitize(rawHtml), error: '' }
		} catch (err) {
			return { html: '', error: err instanceof Error ? err.message : 'Failed to parse markdown' }
		}
	}, [deferredInput])

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
				<div className="text-foreground grow scrollbar-thin overflow-y-auto p-6 font-sans select-text">
					{compiledHtml ? (
						<div
							className="prose dark:prose-invert prose-li:my-1 prose-table:my-4 prose-table:w-full prose-table:border-collapse prose-ol:list-decimal prose-ul:list-disc prose-code:rounded prose-pre:rounded-sm prose-pre:border prose-td:border prose-th:border prose-blockquote:border-matrix/40 prose-h1:border-border prose-pre:border-border prose-td:border-border prose-th:border-border prose-h1:border-b prose-blockquote:border-l-4 prose-code:bg-muted prose-pre:bg-muted prose-th:bg-muted prose-pre:p-4 prose-td:p-2 prose-th:p-2 prose-code:px-1 prose-code:py-0.5 prose-h1:pb-2 prose-blockquote:pl-4 prose-code:font-mono prose-headings:font-bold prose-headings:font-mono prose-pre:font-mono prose-strong:font-bold prose-th:font-mono prose-a:text-matrix prose-blockquote:text-muted-foreground prose-code:text-matrix-glow prose-code:text-xs prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-headings:text-foreground prose-li:text-sm prose-p:text-muted-foreground prose-p:text-sm prose-pre:text-xs prose-strong:text-foreground prose-td:text-xs prose-th:text-xs prose-blockquote:italic prose-p:leading-relaxed prose-a:no-underline hover:prose-a:underline max-w-none"
							// oxlint-disable-next-line react/no-danger -- HTML is sanitized with DOMPurify above
							dangerouslySetInnerHTML={{ __html: compiledHtml }}
						/>
					) : error ? (
						<div role="alert" className="text-destructive font-mono text-xs">
							{error}
						</div>
					) : (
						<div className="flex h-full items-center justify-center font-mono text-xs text-slate-600 select-none">
							Waiting for markdown input...
						</div>
					)}
				</div>
			</Pane>
		</div>
	)
}
