import { FormatterTool } from '@/components/tools/shared'

import { SAMPLE } from './samples'
import { formatHtml } from './utils'

export default function HtmlFormatter() {
	return <FormatterTool language="HTML" extension="html" sample={SAMPLE} format={formatHtml} />
}
