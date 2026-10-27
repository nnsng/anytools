import { useState } from 'react'

import { Pane } from '@/components/tools/shared'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { APP_NAME } from '@/constants/app'
import { useThemeContext } from '@/contexts/theme-context'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

const PREVIEW_DEBOUNCE_MS = 300

export default function HtmlSandbox() {
	const { theme } = useThemeContext()

	const [input, setInput] = useState<string>(`<!DOCTYPE html>
<html${theme === 'dark' ? ' class="dark"' : ''}>
<head>
  <style>
    :root {
      --bg: #f8fafc;
      --fg: #0f172a;
      --card: #ffffff;
      --border: #e2e8f0;
      --primary: #16a34a;
      --primary-fg: #ffffff;
    }
    .dark {
      --bg: #08090c;
      --fg: #e2e8f0;
      --card: #0e1117;
      --border: #1a202c;
      --primary: #22c55e;
      --primary-fg: #08090c;
    }
    body {
      background-color: var(--bg);
      color: var(--fg);
      font-family: ui-sans-serif, system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      border: 1px solid var(--border);
      background: var(--card);
      padding: 32px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      max-width: 400px;
    }
    h1 {
      color: var(--primary);
      margin-top: 0;
      font-size: 24px;
    }
    button {
      background: var(--primary);
      color: var(--primary-fg);
      border: none;
      padding: 10px 20px;
      font-weight: 600;
      cursor: pointer;
      border-radius: 4px;
      transition: opacity 0.2s;
      margin-top: 16px;
    }
    button:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>${APP_NAME} Sandbox</h1>
    <p style="color: var(--fg); opacity: 0.8; font-size: 14px;">This is a live, secure client-side HTML preview that matches your system theme!</p>
    <button onclick="console.log('JavaScript is active inside the sandboxed iframe!')">Trigger Action</button>
  </div>
</body>
</html>`)

	// Re-rendering the iframe re-runs its scripts, so wait for typing to settle
	const previewHtml = useDebouncedValue(input, PREVIEW_DEBOUNCE_MS)

	return (
		<div className="flex flex-col gap-6 lg:flex-row">
			<EditorPane
				title="HTML/CSS/JS Source"
				value={input}
				onChange={setInput}
				placeholder="Enter HTML source code here..."
				allowUpload={true}
				className="flex-1"
			/>

			<Pane title="Live Preview (Sandboxed Frame)" dotClassName="bg-blue-500" className="flex-1">
				<div className="bg-background relative min-h-50 flex-1">
					{previewHtml.trim() ? (
						<iframe
							srcDoc={previewHtml}
							title="HTML Sandbox Preview"
							// no allow-same-origin: sandboxed scripts must not reach the app origin
							sandbox="allow-scripts"
							className="h-full w-full border-none bg-transparent"
						/>
					) : (
						<div className="bg-terminal-bg absolute inset-0 flex items-center justify-center font-mono text-xs text-slate-600 select-none">
							Waiting for HTML source input...
						</div>
					)}
				</div>
			</Pane>
		</div>
	)
}
