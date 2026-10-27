import type { Indent } from '@/components/tools/shared'

export function formatJson(input: string, indent: Indent): string {
	const parsed: unknown = JSON.parse(input)
	return indent === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, Number(indent))
}
