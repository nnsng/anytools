import { useEffect, useRef, useState } from 'react'
import { EditorPane } from '../shared/editor-pane'

export default function HtmlPreview() {
	const [input, setInput] = useState<string>(`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background-color: #0b0c10;
      color: #e2e8f0;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      border: 1px solid #1f242d;
      background: #11141a;
      padding: 30px;
      border-radius: 4px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 255, 102, 0.1);
    }
    h1 {
      color: #00ff66;
      margin-top: 0;
    }
    button {
      background: #00ff66;
      color: #000;
      border: none;
      padding: 10px 20px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 2px;
      transition: all 0.2s;
    }
    button:hover {
      box-shadow: 0 0 10px #00ff66;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>AnyTools Sandbox</h1>
    <p>This is a live, secure client-side HTML preview!</p>
    <button onclick="alert('JS is active inside sandboxed iframe!')">Trigger Action</button>
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
		<div className="grid h-[calc(100vh-220px)] min-h-[500px] grid-cols-1 gap-6 lg:grid-cols-2">
			<EditorPane
				title="HTML/CSS/JS Source"
				value={input}
				onChange={setInput}
				placeholder="Enter HTML source code here..."
				allowUpload={true}
			/>

			<div className="flex flex-col rounded-sm border border-terminal-border bg-terminal-card/60">
				{/* Pane Header */}
				<div className="flex items-center justify-between border-terminal-border border-b bg-terminal-bg/40 px-4 py-2">
					<span className="flex items-center gap-2 font-bold font-mono text-slate-300 text-xs uppercase tracking-wider">
						<span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
						Live Preview (Sandboxed Frame)
					</span>
				</div>

				{/* Frame Content */}
				<div className="relative min-h-[200px] flex-1 bg-white">
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
			</div>
		</div>
	)
}
