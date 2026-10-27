import { FormatterTool } from '@/components/tools/shared'

import { SAMPLE } from './samples'
import { formatJs } from './utils'

export default function JsFormatter() {
	return <FormatterTool language="JavaScript" extension="js" sample={SAMPLE} format={formatJs} />
}
