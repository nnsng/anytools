export type ParsedCurl = {
	url: string
	method: string
	headers: Record<string, string>
	body: string
}

export function parseCurl(curl: string): ParsedCurl {
	const cleanCurl = curl.replace(/\\\n/g, ' ').trim()

	let url = 'https://example.com/api'
	let method = 'GET'
	const headers: Record<string, string> = {}
	let body = ''

	const urlMatch = cleanCurl.match(/(https?:\/\/[^\s"']+)/)
	if (urlMatch) url = urlMatch[0]

	const methodMatch = cleanCurl.match(/(?:-X|--request)\s+([A-Z]+)/)
	if (methodMatch) {
		method = methodMatch[1]
	} else if (
		cleanCurl.includes('-d ') ||
		cleanCurl.includes('--data') ||
		cleanCurl.includes('--data-raw')
	) {
		method = 'POST'
	}

	const headerRegex = /(?:-H|--header)\s+("([^"]+)"|'([^']+)'|([^\s]+))/g
	for (const match of cleanCurl.matchAll(headerRegex)) {
		const headerStr = match[2] || match[3] || match[4]
		if (headerStr) {
			const colonIdx = headerStr.indexOf(':')
			if (colonIdx !== -1) {
				headers[headerStr.substring(0, colonIdx).trim()] = headerStr.substring(colonIdx + 1).trim()
			}
		}
	}

	const bodyMatch = cleanCurl.match(/(?:-d|--data|--data-raw)\s+("([^"]+)"|'([^']+)'|([^\s]+))/)
	if (bodyMatch) body = bodyMatch[2] || bodyMatch[3] || bodyMatch[4] || ''

	return { url, method, headers, body }
}

export function generateJavascript(parsed: ParsedCurl): string {
	const fetchOptions: {
		method: string
		headers?: Record<string, string>
		body?: string
	} = {
		method: parsed.method,
	}
	if (Object.keys(parsed.headers).length > 0) fetchOptions.headers = parsed.headers
	if (parsed.body) fetchOptions.body = parsed.body

	const optionsStr = JSON.stringify(fetchOptions, null, 2).replace(
		/"body":\s*"([\s\S]*?)"/,
		(_, p1) => {
			try {
				JSON.parse(p1)
				return `"body": JSON.stringify(${p1.trim()})`
			} catch {
				return `"body": \`${p1}\``
			}
		},
	)

	return `// JavaScript (Fetch API)\n\nfetch("${parsed.url}", ${optionsStr})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`
}

export function generatePython(parsed: ParsedCurl): string {
	let code = `import requests\nimport json\n\nurl = "${parsed.url}"\n`

	code +=
		Object.keys(parsed.headers).length > 0
			? `headers = ${JSON.stringify(parsed.headers, null, 4)}\n`
			: `headers = {}\n`

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

export function generateGo(parsed: ParsedCurl): string {
	let headersStr = ''
	for (const [k, v] of Object.entries(parsed.headers)) {
		headersStr += `\treq.Header.Add("${k}", "${v}")\n`
	}

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
