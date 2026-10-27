import { css_beautify as beautifyCss } from 'js-beautify'

import type { Indent } from '@/components/tools/shared'

function minify(rawCode: string): string {
	return rawCode
		.replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
		.replace(/\s+/g, ' ') // Collapse whitespace
		.replace(/ ?([{}:;,]) ?/g, '$1') // Remove spacing around symbols
		.replace(/;}/g, '}') // Remove trailing semicolons
		.trim()
}

export function formatCss(input: string, indent: Indent): string {
	return indent === 'minify' ? minify(input) : beautifyCss(input, { indent_size: Number(indent) })
}
