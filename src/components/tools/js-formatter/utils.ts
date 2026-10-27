import { js_beautify as beautifyJs } from 'js-beautify'

import type { Indent } from '@/components/tools/shared'

function minify(rawCode: string): string {
	return rawCode
		.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Strip comments
		.replace(/\s+/g, ' ') // Collapse whitespace
		.replace(/([{};,()[\]])\s+|\s+([{};,()[\]])/g, '$1$2') // Clean spacing around operators
		.trim()
}

export function formatJs(input: string, indent: Indent): string {
	return indent === 'minify' ? minify(input) : beautifyJs(input, { indent_size: Number(indent) })
}
