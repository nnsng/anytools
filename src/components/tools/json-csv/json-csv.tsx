import { useDeferredValue, useMemo, useState } from 'react'

import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { runConversion } from '@/lib/convert'

import { CsvOptions } from './csv-options'
import { CSV_SAMPLE, JSON_SAMPLE } from './samples'
import { csvToJson, type Delimiter, jsonToCsv } from './utils'

type ActiveTab = 'json-to-csv' | 'csv-to-json'

function isActiveTab(value: string): value is ActiveTab {
	return value === 'json-to-csv' || value === 'csv-to-json'
}

export default function JsonCsv() {
	const [activeTab, setActiveTab] = useState<ActiveTab>('json-to-csv')
	const [input, setInput] = useState<string>(JSON_SAMPLE)
	const [delimiter, setDelimiter] = useState<Delimiter>(',')
	const [hasHeader, setHasHeader] = useState<boolean>(true)
	const [flatten, setFlatten] = useState<boolean>(true)
	const [inferTypes, setInferTypes] = useState<boolean>(true)

	const deferredInput = useDeferredValue(input)
	const isJsonToCsv = activeTab === 'json-to-csv'

	const { output, error } = useMemo(() => {
		if (!deferredInput.trim()) return { output: '', error: null }
		return runConversion(
			() =>
				isJsonToCsv
					? jsonToCsv(deferredInput, { delimiter, includeHeader: hasHeader, flatten })
					: csvToJson(deferredInput, { delimiter, hasHeader, inferTypes }),
			'Conversion failed. Check the input format.',
		)
	}, [deferredInput, isJsonToCsv, delimiter, hasHeader, flatten, inferTypes])

	const handleTabChange = (value: string) => {
		if (!isActiveTab(value)) return
		setActiveTab(value)
		// Carry the result over so the tabs act as a round trip
		if (output && !error) setInput(output)
		else setInput(value === 'json-to-csv' ? JSON_SAMPLE : CSV_SAMPLE)
	}

	return (
		<Tabs value={activeTab} onValueChange={handleTabChange} className="flex h-full flex-col gap-4">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="json-to-csv">JSON → CSV</TabsTrigger>
				<TabsTrigger value="csv-to-json">CSV → JSON</TabsTrigger>
			</TabsList>

			<CsvOptions
				delimiter={delimiter}
				onDelimiterChange={setDelimiter}
				checkboxes={[
					{ id: 'csv-header', label: 'Header row', checked: hasHeader, onChange: setHasHeader },
					isJsonToCsv
						? {
								id: 'csv-flatten',
								label: 'Flatten nested objects',
								checked: flatten,
								onChange: setFlatten,
							}
						: {
								id: 'csv-infer',
								label: 'Infer types',
								checked: inferTypes,
								onChange: setInferTypes,
							},
				]}
			/>

			<div className="flex flex-1 flex-col gap-6 lg:flex-row">
				<EditorPane
					title={isJsonToCsv ? 'JSON Input' : 'CSV Input'}
					value={input}
					onChange={setInput}
					placeholder={isJsonToCsv ? 'Paste a JSON array or object...' : 'Paste CSV text...'}
					allowUpload={true}
					error={error}
					className="min-h-80 lg:flex-1"
				/>

				<EditorPane
					title={isJsonToCsv ? 'CSV Output' : 'JSON Output'}
					value={output}
					readOnly={true}
					allowDownload={true}
					downloadFileName={isJsonToCsv ? 'data.csv' : 'data.json'}
					className="min-h-80 lg:flex-1"
				/>
			</div>
		</Tabs>
	)
}
