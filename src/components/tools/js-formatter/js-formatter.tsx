import { useEffect, useState } from 'react'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { PrismHighlighter } from '@/components/tools/shared/prism-highlighter'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

function beautifyJs(code: string): string {
	let formatted = ''
	let indentLevel = 0
	const indentStr = '  '
	let inString = false
	let quoteChar = ''
	let inComment = false
	let inLineComment = false

	const trimmed = code.trim()
	for (let i = 0; i < trimmed.length; i++) {
		const char = trimmed[i]
		const nextChar = trimmed[i + 1]

		if (inLineComment) {
			if (char === '\n') inLineComment = false
			formatted += char
			continue
		}
		if (inComment) {
			if (char === '*' && nextChar === '/') {
				inComment = false
				formatted += '*/'
				i++
			} else {
				formatted += char
			}
			continue
		}

		if (inString) {
			if (char === quoteChar && trimmed[i - 1] !== '\\') {
				inString = false
			}
			formatted += char
			continue
		}

		if (char === '"' || char === "'" || char === '`') {
			inString = true
			quoteChar = char
			formatted += char
			continue
		}

		if (char === '/' && nextChar === '/') {
			inLineComment = true
			formatted += char
			continue
		}
		if (char === '/' && nextChar === '*') {
			inComment = true
			formatted += char
			continue
		}

		if (char === '{' || char === '[') {
			formatted += `${char}\n${indentStr.repeat(++indentLevel)}`
			while (trimmed[i + 1] === ' ' || trimmed[i + 1] === '\t') i++
		} else if (char === '}' || char === ']') {
			indentLevel = Math.max(0, indentLevel - 1)
			if (formatted.endsWith('\n') || formatted.endsWith('\t') || formatted.endsWith(' ')) {
				formatted = formatted.trimEnd()
			}
			formatted += `\n${indentStr.repeat(indentLevel)}${char}`
			while (trimmed[i + 1] === ' ' || trimmed[i + 1] === '\t') i++
		} else if (char === ';') {
			formatted += `${char}\n${indentStr.repeat(indentLevel)}`
			while (trimmed[i + 1] === ' ' || trimmed[i + 1] === '\t') i++
		} else if (char === '\n') {
			// ignore, generated dynamically
		} else {
			formatted += char
		}
	}
	return formatted.replace(/\n\s*\n/g, '\n').trim()
}

function minifyJs(code: string): string {
	let minified = ''
	let inString = false
	let quoteChar = ''
	let inComment = false
	let inLineComment = false

	for (let i = 0; i < code.length; i++) {
		const char = code[i]
		const nextChar = code[i + 1]

		if (inLineComment) {
			if (char === '\n') inLineComment = false
			continue
		}
		if (inComment) {
			if (char === '*' && nextChar === '/') {
				inComment = false
				i++
			}
			continue
		}
		if (inString) {
			if (char === quoteChar && code[i - 1] !== '\\') {
				inString = false
			}
			minified += char
			continue
		}

		if (char === '"' || char === "'" || char === '`') {
			inString = true
			quoteChar = char
			minified += char
			continue
		}

		if (char === '/' && nextChar === '/') {
			inLineComment = true
			continue
		}
		if (char === '/' && nextChar === '*') {
			inComment = true
			continue
		}

		if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
			const prev = minified[minified.length - 1]
			if (prev && /[a-zA-Z0-9_$]/.test(prev) && nextChar && /[a-zA-Z0-9_$]/.test(nextChar)) {
				minified += ' '
			}
			continue
		}

		minified += char
	}
	return minified.trim()
}

export default function JavascriptFormatter() {
	const [input, setInput] = useState<string>(
		`// Simple JS Demo\nfunction greet(user) {\n  const message = "Hello, " + user.name + "!";\n  console.log(message);\n  return { success: true, timestamp: Date.now() };\n}`,
	)
	const [output, setOutput] = useState<string>('')
	const [activeTab, setActiveTab] = useState<string>('beautify')
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!input.trim()) {
			setOutput('')
			setError(null)
			return
		}

		try {
			if (activeTab === 'beautify') {
				setOutput(beautifyJs(input))
			} else {
				setOutput(minifyJs(input))
			}
			setError(null)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'JS formatting failed.')
			setOutput('')
		}
	}, [input, activeTab])

	return (
		<div className="flex flex-1 flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Input"
				value={input}
				onChange={setInput}
				placeholder="Paste JavaScript code here..."
				allowUpload={true}
				error={error}
				className="lg:flex-1"
			/>

			<EditorPane
				title="Output"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName={activeTab === 'beautify' ? 'formatted.js' : 'minified.js'}
				actions={
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="beautify">Beautify</TabsTrigger>
							<TabsTrigger value="minify">Minify</TabsTrigger>
						</TabsList>
					</Tabs>
				}
				className="lg:flex-1"
			>
				{output ? (
					<PrismHighlighter code={output} language="javascript" className="flex-1" />
				) : (
					<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
