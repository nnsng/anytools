import { html_beautify as beautifyHtml } from 'js-beautify'

import type { Indent } from '@/components/tools/shared'

function minify(rawCode: string): string {
	return rawCode
		.replace(/<!--[\s\S]*?-->/g, '') // Remove comments
		.replace(/\s+/g, ' ') // Collapse whitespace
		.replace(/>\s+</g, '><') // Collapse spaces between tags
		.trim()
}

export function formatHtml(input: string, indent: Indent): string {
	return indent === 'minify' ? minify(input) : beautifyHtml(input, { indent_size: Number(indent) })
}
