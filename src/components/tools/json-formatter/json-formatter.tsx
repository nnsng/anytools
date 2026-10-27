import { FormatterTool } from '@/components/tools/shared'

import { SAMPLE } from './samples'
import { formatJson } from './utils'

export default function JsonFormatter() {
	return (
		<FormatterTool
			language="JSON"
			extension="json"
			sample={SAMPLE}
			outputPlaceholder="Waiting for valid JSON input..."
			format={formatJson}
		/>
	)
}
