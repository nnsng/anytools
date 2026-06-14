import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

function toTitleCase(str: string): string {
	return str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
	)
}

function toSentenceCase(str: string): string {
	return str.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase())
}

function toCamelCase(str: string): string {
	return str
		.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
		.replace(/^[A-Z]/, (c) => c.toLowerCase())
}

function toSnakeCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, '$1_$2')
		.replace(/[^a-zA-Z0-9]+/g, '_')
		.toLowerCase()
}

function toKebabCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[^a-zA-Z0-9]+/g, '-')
		.toLowerCase()
}

function toPascalCase(str: string): string {
	const camel = toCamelCase(str)
	return camel.charAt(0).toUpperCase() + camel.slice(1)
}

function toConstantCase(str: string): string {
	return toSnakeCase(str).toUpperCase()
}

function toToggleCase(str: string): string {
	return str
		.split('')
		.map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
		.join('')
}

function toAlternatingCase(str: string): string {
	return str
		.split('')
		.map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
		.join('')
}

const casingOptions = [
	{ id: 'lower', label: 'lowercase', fn: (s: string) => s.toLowerCase() },
	{ id: 'upper', label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
	{ id: 'title', label: 'Title Case', fn: toTitleCase },
	{ id: 'sentence', label: 'Sentence case', fn: toSentenceCase },
	{ id: 'camel', label: 'camelCase', fn: toCamelCase },
	{ id: 'snake', label: 'snake_case', fn: toSnakeCase },
	{ id: 'kebab', label: 'kebab-case', fn: toKebabCase },
	{ id: 'pascal', label: 'PascalCase', fn: toPascalCase },
	{ id: 'constant', label: 'CONSTANT_CASE', fn: toConstantCase },
	{ id: 'toggle', label: 'tOGGLE cASE', fn: toToggleCase },
	{ id: 'alternate', label: 'aLtErNaTiNg CaSe', fn: toAlternatingCase },
]

export default function StringCaseConverter() {
	const [input, setInput] = useState<string>('Welcome to the developer utilities suite!')
	const [output, setOutput] = useState<string>('')
	const [casingType, setCasingType] = useState<string>('upper')

	useEffect(() => {
		if (!input.trim()) {
			setOutput('')
			return
		}

		const option = casingOptions.find((o) => o.id === casingType)
		if (option) {
			setOutput(option.fn(input))
		}
	}, [input, casingType])

	return (
		<div className="flex flex-1 flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Input Text"
				value={input}
				onChange={setInput}
				placeholder="Type or paste text to convert..."
				allowUpload={true}
				className="lg:flex-1"
			/>

			<EditorPane
				title="Output Text"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName="converted-text.txt"
				actions={
					<div className="flex items-center gap-2 font-mono">
						<span className="font-bold text-[10px] text-slate-500 uppercase">Case:</span>
						<Select value={casingType} onValueChange={setCasingType}>
							<SelectTrigger className="h-8 w-40 border-terminal-border bg-terminal-bg font-mono text-white text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-terminal-border bg-terminal-card font-mono text-white text-xs">
								{casingOptions.map((opt) => (
									<SelectItem key={opt.id} value={opt.id}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				}
				className="lg:flex-1"
			>
				{output ? (
					<CodeBlock className="flex-1">{output}</CodeBlock>
				) : (
					<div className="flex grow select-none items-center justify-center font-mono text-slate-600 text-xs">
						Waiting for input...
					</div>
				)}
			</EditorPane>
		</div>
	)
}
