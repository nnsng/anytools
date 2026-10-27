import { FormatterTool } from '@/components/tools/shared'

import { SAMPLE } from './samples'
import { formatCss } from './utils'

export default function CssFormatter() {
	return <FormatterTool language="CSS" extension="css" sample={SAMPLE} format={formatCss} />
}
