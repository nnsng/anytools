import { useDeferredValue, useMemo, useState } from 'react'

import { EditorPane } from '@/components/tools/shared/editor-pane'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { runConversion } from '@/lib/convert'

import { JSON_SAMPLE, YAML_SAMPLE } from './samples'
import { type Indent, jsonToYaml, yamlToJson } from './utils'

type ActiveTab = 'json-to-yaml' | 'yaml-to-json'

const INDENTS: Array<{ value: Indent; label: string }> = [
	{ value: 2, label: '2 Spaces' },
	{ value: 4, label: '4 Spaces' },
]

function isActiveTab(value: string): value is ActiveTab {
	return value === 'json-to-yaml' || value === 'yaml-to-json'
}

export default function JsonYaml() {
	const [activeTab, setActiveTab] = useState<ActiveTab>('json-to-yaml')
	const [input, setInput] = useState<string>(JSON_SAMPLE)
	const [indent, setIndent] = useState<Indent>(2)

	const deferredInput = useDeferredValue(input)
	const isJsonToYaml = activeTab === 'json-to-yaml'

	const { output, error } = useMemo(() => {
		if (!deferredInput.trim()) return { output: '', error: null }
		return runConversion(
			() => (isJsonToYaml ? jsonToYaml(deferredInput, indent) : yamlToJson(deferredInput, indent)),
			'Conversion failed. Check the input syntax.',
		)
	}, [deferredInput, isJsonToYaml, indent])

	const handleTabChange = (value: string) => {
		if (!isActiveTab(value)) return
		setActiveTab(value)
		// Carry the result over so the tabs act as a round trip
		if (output && !error) setInput(output)
		else setInput(value === 'json-to-yaml' ? JSON_SAMPLE : YAML_SAMPLE)
	}

	return (
		<Tabs value={activeTab} onValueChange={handleTabChange} className="flex h-full flex-col gap-4">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="json-to-yaml">JSON → YAML</TabsTrigger>
				<TabsTrigger value="yaml-to-json">YAML → JSON</TabsTrigger>
			</TabsList>

			<div className="flex flex-1 flex-col gap-6 lg:flex-row">
				<EditorPane
					title={isJsonToYaml ? 'JSON Input' : 'YAML Input'}
					value={input}
					onChange={setInput}
					placeholder={isJsonToYaml ? 'Paste JSON here...' : 'Paste YAML here...'}
					allowUpload={true}
					error={error}
					className="min-h-80 lg:flex-1"
				/>

				<EditorPane
					title={isJsonToYaml ? 'YAML Output' : 'JSON Output'}
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName={isJsonToYaml ? 'data.yaml' : 'data.json'}
					actions={
						<Select
							value={String(indent)}
							onValueChange={(value) => {
								const next = INDENTS.find((option) => String(option.value) === value)
								if (next) setIndent(next.value)
							}}
						>
							<SelectTrigger
								aria-label="Indentation"
								className="border-terminal-border h-8 font-mono text-xs"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
								{INDENTS.map((option) => (
									<SelectItem key={option.value} value={String(option.value)}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					}
					className="min-h-80 lg:flex-1"
				/>
			</div>
		</Tabs>
	)
}
