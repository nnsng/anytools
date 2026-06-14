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

export function generateFetch(parsed: ParsedCurl): string {
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

export function generateAxios(parsed: ParsedCurl): string {
	const axiosConfig: {
		method: string
		url: string
		headers?: Record<string, string>
		// biome-ignore lint/suspicious/noExplicitAny: dynamic payload body
		data?: any
	} = {
		method: parsed.method.toLowerCase(),
		url: parsed.url,
	}

	if (Object.keys(parsed.headers).length > 0) {
		axiosConfig.headers = parsed.headers
	}

	if (parsed.body) {
		try {
			axiosConfig.data = JSON.parse(parsed.body)
		} catch {
			axiosConfig.data = parsed.body
		}
	}

	const configStr = JSON.stringify(axiosConfig, null, 2)

	return `// JavaScript (Axios)\nimport axios from 'axios';\n\nconst config = ${configStr};\n\naxios(config)\n  .then(response => {\n    console.log(response.data);\n  })\n  .catch(error => {\n    console.error(error);\n  });`
}
