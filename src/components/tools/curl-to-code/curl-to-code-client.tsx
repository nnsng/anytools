import { useEffect, useState } from 'react'
import { Tabs } from '../../ui/tabs'
import { EditorPane } from '../shared/editor-pane'
import { PrismHighlighter } from '../shared/prism-highlighter'

interface ParsedCurl {
	url: string
	method: string
	headers: Record<string, string>
	body: string
}

const parseCurl = (curl: string): ParsedCurl => {
	// Normalize multi-lines
	const cleanCurl = curl.replace(/\\\n/g, ' ').trim()

	let url = 'https://example.com/api'
	let method = 'GET'
	const headers: Record<string, string> = {}
	let body = ''

	// 1. Extract URL (matches HTTP/HTTPS links)
	const urlRegex = /(https?:\/\/[^\s"']+)/
	const urlMatch = cleanCurl.match(urlRegex)
	if (urlMatch) {
		url = urlMatch[0]
	}

	// 2. Extract Method
	const methodRegex = /(?:-X|--request)\s+([A-Z]+)/
	const methodMatch = cleanCurl.match(methodRegex)
	if (methodMatch) {
		method = methodMatch[1]
	} else if (
		cleanCurl.includes('-d ') ||
		cleanCurl.includes('--data') ||
		cleanCurl.includes('--data-raw')
	) {
		method = 'POST'
	}

	// 3. Extract Headers (-H or --header)
	// We scan globally for headers
	const headerRegex = /(?:-H|--header)\s+("([^"]+)"|'([^']+)'|([^\s]+))/g
	const matches = cleanCurl.matchAll(headerRegex)
	for (const match of matches) {
		const headerStr = match[2] || match[3] || match[4]
		if (headerStr) {
			const colonIdx = headerStr.indexOf(':')
			if (colonIdx !== -1) {
				const key = headerStr.substring(0, colonIdx).trim()
				const val = headerStr.substring(colonIdx + 1).trim()
				headers[key] = val
			}
		}
	}

	// 4. Extract Body (-d, --data, --data-raw)
	const bodyRegex = /(?:-d|--data|--data-raw)\s+("([^"]+)"|'([^']+)'|([^\s]+))/
	const bodyMatch = cleanCurl.match(bodyRegex)
	if (bodyMatch) {
		body = bodyMatch[2] || bodyMatch[3] || bodyMatch[4] || ''
	}

	return { url, method, headers, body }
}

const generateJavascript = (parsed: ParsedCurl): string => {
	const fetchOptions: {
		method: string
		headers?: Record<string, string>
		body?: string
	} = {
		method: parsed.method,
	}

	if (Object.keys(parsed.headers).length > 0) {
		fetchOptions.headers = parsed.headers
	}

	if (parsed.body) {
		fetchOptions.body = parsed.body
	}

	const optionsStr = JSON.stringify(fetchOptions, null, 2)
		// Clean up stringified quotes for methods/headers/bodies if they are variables
		.replace(/"body":\s*"([\s\S]*?)"/, (_, p1) => {
			// format nicely as JSON.stringify or template string
			try {
				JSON.parse(p1)
				return `"body": JSON.stringify(${p1.trim()})`
			} catch {
				return `"body": \`${p1}\``
			}
		})

	return `// JavaScript (Fetch API)\n\nfetch("${parsed.url}", ${optionsStr})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`
}

const generatePython = (parsed: ParsedCurl): string => {
	let code = `import requests\nimport json\n\nurl = "${parsed.url}"\n`

	if (Object.keys(parsed.headers).length > 0) {
		code += `headers = ${JSON.stringify(parsed.headers, null, 4)}\n`
	} else {
		code += `headers = {}\n`
	}

	if (parsed.body) {
		try {
			const parsedBody = JSON.parse(parsed.body)
			code += `data = ${JSON.stringify(parsedBody, null, 4)}\n`
			code += `\nresponse = requests.${parsed.method.toLowerCase()}(\n    url,\n    headers=headers,\n    json=data\n)\n`
		} catch {
			code += `data = """${parsed.body}"""\n`
			code += `\nresponse = requests.${parsed.method.toLowerCase()}(\n    url,\n    headers=headers,\n    data=data\n)\n`
		}
	} else {
		code += `\nresponse = requests.${parsed.method.toLowerCase()}(url, headers=headers)\n`
	}

	code += `\nprint("Status Code:", response.status_code)\nprint("Response Body:", response.json())`
	return code
}

const generateGo = (parsed: ParsedCurl): string => {
	let headersStr = ''
	Object.entries(parsed.headers).forEach(([k, v]) => {
		headersStr += `\treq.Header.Add("${k}", "${v}")\n`
	})

	let bodySetup = `\tresp, err := http.Get("${parsed.url}")`
	if (parsed.method !== 'GET' || parsed.body) {
		const payload = parsed.body
			? `var payload = []byte(\`${parsed.body}\`)\n\treq, err := http.NewRequest("${parsed.method}", "${parsed.url}", bytes.NewBuffer(payload))`
			: `req, err := http.NewRequest("${parsed.method}", "${parsed.url}", nil)`

		bodySetup = `\t${payload}\n\tif err != nil {\n\t\tlog.Fatal(err)\n\t}\n${headersStr}\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)`
	}

	return `package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
)

func main() {
${bodySetup}
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Status Code:", resp.StatusCode)
	fmt.Println("Response Body:", string(body))
}`
}

export default function CurlToCode() {
	const [curlInput, setCurlInput] = useState<string>(
		`curl -X POST "https://api.anytools.dev/v1/data" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer token123" \\\n  -d '{"name": "Neo", "status": "active"}'`,
	)
	const [activeTab, setActiveTab] = useState<string>('js')
	const [codeOutput, setCodeOutput] = useState<string>('')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!curlInput.trim()) {
			setCodeOutput('')
			setError(null)
			return
		}

		try {
			const parsed = parseCurl(curlInput)
			setError(null)

			if (activeTab === 'js') {
				setCodeOutput(generateJavascript(parsed))
			} else if (activeTab === 'python') {
				setCodeOutput(generatePython(parsed))
			} else if (activeTab === 'go') {
				setCodeOutput(generateGo(parsed))
			}
		} catch {
			setError('cURL parse failed. Check string structure.')
			setCodeOutput('')
		}
	}, [curlInput, activeTab])

	return (
		<div className="grid h-[calc(100vh-220px)] min-h-[500px] grid-cols-1 gap-6 lg:grid-cols-2">
			<EditorPane
				title="cURL Command Input"
				value={curlInput}
				onChange={setCurlInput}
				placeholder="Paste your cURL command here..."
				allowUpload={true}
				error={error}
			/>

			<EditorPane
				title="Code Output"
				value={codeOutput}
				readOnly={true}
				allowDownload={true}
				downloadFileName={`request.${activeTab === 'js' ? 'js' : activeTab === 'python' ? 'py' : 'go'}`}
				actions={
					<Tabs
						tabs={[
							{ id: 'js', label: 'JavaScript' },
							{ id: 'python', label: 'Python' },
							{ id: 'go', label: 'Go Lang' },
						]}
						activeTab={activeTab}
						onChange={setActiveTab}
						className="border-none"
					/>
				}
			>
				{codeOutput ? (
					<PrismHighlighter
						code={codeOutput}
						language={
							activeTab === 'js'
								? 'javascript'
								: activeTab === 'python'
									? 'javascript'
									: 'typescript'
						} // Map to closest highlight rules
						className="flex-1"
					/>
				) : (
					<div className="flex flex-grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for valid cURL input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
