import type React from 'react'

type PrismHighlighterProps = {
	code: string
	language: 'json' | 'html' | 'javascript' | 'typescript' | 'css' | 'text' | 'sql' | 'yaml'
	className?: string
}

export function PrismHighlighter({ code, language, className }: PrismHighlighterProps) {
	const highlight = (txt: string, lang: string): React.ReactNode => {
		if (!txt) return ''

		if (lang === 'json') {
			// Escape HTML characters to prevent XSS
			const safeTxt = txt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

			// Color-coding regex for JSON
			const jsonRegex =
				/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g

			const parts: React.ReactNode[] = []
			let lastIndex = 0

			// We do a manual tokenization to build React elements, avoiding dangerous dangerouslySetInnerHTML
			for (let match = jsonRegex.exec(safeTxt); match !== null; match = jsonRegex.exec(safeTxt)) {
				const matchStr = match[0]
				const matchIndex = match.index

				// Push text before match
				if (matchIndex > lastIndex) {
					parts.push(safeTxt.substring(lastIndex, matchIndex))
				}

				let cls = 'text-blue-400' // number
				if (/^"/.test(matchStr)) {
					if (/:$/.test(matchStr)) {
						cls = 'text-matrix font-semibold' // key
					} else {
						cls = 'text-amber-400' // string
					}
				} else if (/true|false/.test(matchStr)) {
					cls = 'text-orange-400' // boolean
				} else if (/null/.test(matchStr)) {
					cls = 'text-red-400' // null
				}

				parts.push(
					<span key={matchIndex} className={cls}>
						{matchStr}
					</span>,
				)

				lastIndex = jsonRegex.lastIndex
			}

			if (lastIndex < safeTxt.length) {
				parts.push(safeTxt.substring(lastIndex))
			}

			// Convert the string representations back for render
			const renderParts = parts.map((part, _i) => {
				if (typeof part === 'string') {
					return unescapeHtml(part)
				}
				return part
			})

			return <>{renderParts}</>
		}

		if (lang === 'html') {
			// Basic HTML tag/attribute highlighting
			const safeTxt = txt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

			// Regex to match tags, attributes, strings
			const htmlRegex = /(&lt;\/?[a-zA-Z0-9:-]+(\s|&gt;)|"([^"]*)"|'([^']*)'|(&lt;!--.*?--&gt;))/g

			const parts: React.ReactNode[] = []
			let lastIndex = 0

			for (let match = htmlRegex.exec(safeTxt); match !== null; match = htmlRegex.exec(safeTxt)) {
				const matchStr = match[0]
				const matchIndex = match.index

				if (matchIndex > lastIndex) {
					parts.push(safeTxt.substring(lastIndex, matchIndex))
				}

				let cls = 'text-blue-400' // Tag or attributes
				if (/^&lt;!--/.test(matchStr)) {
					cls = 'text-slate-500 italic' // Comment
				} else if (/^"|^'/.test(matchStr)) {
					cls = 'text-amber-400' // Attribute Value String
				} else if (/^&lt;\/?[a-zA-Z0-9:-]+/.test(matchStr)) {
					cls = 'text-matrix font-semibold' // Tag Name
				}

				parts.push(
					<span key={matchIndex} className={cls}>
						{matchStr}
					</span>,
				)

				lastIndex = htmlRegex.lastIndex
			}

			if (lastIndex < safeTxt.length) {
				parts.push(safeTxt.substring(lastIndex))
			}

			const renderParts = parts.map((part, _i) => {
				if (typeof part === 'string') {
					return unescapeHtml(part)
				}
				return part
			})

			return <>{renderParts}</>
		}

		// Fallback: simple highlighting for other code types (curly brackets, keywords, comments)
		const safeTxt = txt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

		const codeRegex =
			/(\b(const|let|var|function|return|import|export|from|default|class|interface|type|extends|implements|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|typeof|instanceof|async|await|as|null|undefined|true|false)\b|(".*?"|'.*?'|`.*?`)|(\/\/.*|\/\*[\s\S]*?\*\/))/g

		const parts: React.ReactNode[] = []
		let lastIndex = 0

		for (let match = codeRegex.exec(safeTxt); match !== null; match = codeRegex.exec(safeTxt)) {
			const matchStr = match[0]
			const matchIndex = match.index

			if (matchIndex > lastIndex) {
				parts.push(safeTxt.substring(lastIndex, matchIndex))
			}

			let cls = 'text-blue-400'
			if (/^\/\/|^\/\*/.test(matchStr)) {
				cls = 'text-slate-500 italic' // comment
			} else if (/^"|^'|^`/.test(matchStr)) {
				cls = 'text-amber-400' // string
			} else {
				cls = 'text-matrix font-bold' // keyword
			}

			parts.push(
				<span key={matchIndex} className={cls}>
					{matchStr}
				</span>,
			)

			lastIndex = codeRegex.lastIndex
		}

		if (lastIndex < safeTxt.length) {
			parts.push(safeTxt.substring(lastIndex))
		}

		const renderParts = parts.map((part, _i) => {
			if (typeof part === 'string') {
				return unescapeHtml(part)
			}
			return part
		})

		return <>{renderParts}</>
	}

	const unescapeHtml = (str: string): string => {
		return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
	}

	return (
		<pre
			className={`h-full w-full select-text overflow-auto whitespace-pre bg-transparent p-4 font-mono text-slate-200 text-sm ${className || ''}`}
		>
			<code>{highlight(code, language)}</code>
		</pre>
	)
}
