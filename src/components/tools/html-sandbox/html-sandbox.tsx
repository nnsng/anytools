import { useEffect, useRef, useState } from 'react'
import { Pane } from '@/components/tools/shared'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { APP_NAME } from '@/constants/app'
import { useThemeContext } from '@/contexts/theme-context'

export default function HtmlPreview() {
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

	const [blobUrl, setBlobUrl] = useState<string>('')
	const iframeRef = useRef<HTMLIFrameElement>(null)

	useEffect(() => {
		if (!input.trim()) {
			setBlobUrl('')
			return
		}

		const blob = new Blob([input], { type: 'text/html' })
		const url = URL.createObjectURL(blob)
		setBlobUrl(url)

		return () => {
			URL.revokeObjectURL(url)
		}
	}, [input])

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
				<div className="relative min-h-50 flex-1 bg-background">
					{blobUrl ? (
						<iframe
							ref={iframeRef}
							src={blobUrl}
							title="HTML Sandbox Preview"
							sandbox="allow-scripts"
							className="h-full w-full border-none bg-transparent"
						/>
					) : (
						<div className="absolute inset-0 flex select-none items-center justify-center bg-terminal-bg font-mono text-slate-600 text-xs">
							Waiting for HTML source input...
						</div>
					)}
				</div>
			</Pane>
		</div>
	)
}
