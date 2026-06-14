import { useEffect, useState } from 'react'
import { CodeBlock, EditorPane } from '@/components/tools/shared'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	toCamelCase,
	toConstantCase,
	toKebabCase,
	toLowerCase,
	toPascalCase,
	toSentenceCase,
	toSnakeCase,
	toTitleCase,
	toUpperCase,
} from './converter'

const casingOptions = [
	{ id: 'lower', label: 'lowercase', fn: toLowerCase },
	{ id: 'upper', label: 'UPPERCASE', fn: toUpperCase },
	{ id: 'title', label: 'Title Case', fn: toTitleCase },
	{ id: 'sentence', label: 'Sentence case', fn: toSentenceCase },
	{ id: 'camel', label: 'camelCase', fn: toCamelCase },
	{ id: 'snake', label: 'snake_case', fn: toSnakeCase },
	{ id: 'kebab', label: 'kebab-case', fn: toKebabCase },
	{ id: 'pascal', label: 'PascalCase', fn: toPascalCase },
	{ id: 'constant', label: 'CONSTANT_CASE', fn: toConstantCase },
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
