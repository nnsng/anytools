import { useEffect, useRef, useState } from 'react'
import { Pane } from '@/components/tools/shared'
import { EditorPane } from '@/components/tools/shared/editor-pane'

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
    <button onclick="console.log('JS is active inside sandboxed iframe!')">Trigger Action</button>
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

			<Pane title="Live Preview (Sandboxed Frame)" type="output" className="flex-1">
				<div className="relative min-h-50 flex-1 bg-white">
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
