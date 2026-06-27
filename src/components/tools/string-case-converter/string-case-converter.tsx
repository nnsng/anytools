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

type Case =
	| 'lower'
	| 'upper'
	| 'title'
	| 'sentence'
	| 'camel'
	| 'snake'
	| 'kebab'
	| 'pascal'
	| 'constant'
	| (string & {})

const casingOptions: Array<{ value: Case; label: string; fn: (input: string) => string }> = [
	{ value: 'lower', label: 'lowercase', fn: toLowerCase },
	{ value: 'upper', label: 'UPPERCASE', fn: toUpperCase },
	{ value: 'title', label: 'Title Case', fn: toTitleCase },
	{ value: 'sentence', label: 'Sentence case', fn: toSentenceCase },
	{ value: 'camel', label: 'camelCase', fn: toCamelCase },
	{ value: 'snake', label: 'snake_case', fn: toSnakeCase },
	{ value: 'kebab', label: 'kebab-case', fn: toKebabCase },
	{ value: 'pascal', label: 'PascalCase', fn: toPascalCase },
	{ value: 'constant', label: 'CONSTANT_CASE', fn: toConstantCase },
]

export default function StringCaseConverter() {
	const [input, setInput] = useState<string>('Welcome to the developer utilities suite!')
	const [output, setOutput] = useState<string>('')
	const [casingType, setCasingType] = useState<Case>('upper')

	useEffect(() => {
		if (!input.trim()) {
			setOutput('')
			return
		}

		const option = casingOptions.find((o) => o.value === casingType)
		if (option) {
			setOutput(option.fn(input))
		}
	}, [input, casingType])

	return (
		<div className="flex flex-1 flex-col gap-6 lg:flex-row">
			<EditorPane
				title="Input"
				value={input}
				onChange={setInput}
				placeholder="Type or paste text to convert..."
				allowUpload={true}
				className="flex-1"
			/>

			<EditorPane
				title="Output"
				value={output}
				readOnly={true}
				allowDownload={true}
				downloadFileName="converted-text.txt"
				actions={
					<div className="flex items-center gap-2 font-mono">
						<span className="font-bold text-[10px] text-slate-500 uppercase">Case:</span>
						<Select value={casingType} onValueChange={setCasingType}>
							<SelectTrigger className="h-8 w-40 border-terminal-border bg-terminal-bg font-mono text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
								{casingOptions.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				}
				className="flex-1"
			>
				<CodeBlock className="flex-1" value={output} />
			</EditorPane>
		</div>
	)
}
