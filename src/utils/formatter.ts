import type { BuiltInParserName, LiteralUnion, Options } from 'prettier'
import parserBabel from 'prettier/plugins/babel'
import parserEstree from 'prettier/plugins/estree'
import parserHtml from 'prettier/plugins/html'
import parserPostcss from 'prettier/plugins/postcss'
import prettier from 'prettier/standalone'

type SupportedLanguages = 'html' | 'css' | 'js' | 'json'

const parsers: Record<SupportedLanguages, LiteralUnion<BuiltInParserName, string>> = {
	html: 'html',
	css: 'css',
	js: 'babel',
	json: 'json',
}

export async function beautify(
	rawCode: string,
	language: SupportedLanguages,
	options?: Options,
): Promise<string> {
	if (!rawCode.trim()) return ''

	const formatted = await prettier.format(rawCode, {
		parser: parsers[language],
		plugins: [parserHtml, parserBabel, parserEstree, parserPostcss],
		semi: true,
		singleQuote: true,
		tabWidth: 2,
		trailingComma: 'es5',
		...options,
	})
	return formatted
}

export function minify(rawCode: string, language: SupportedLanguages): string {
	switch (language) {
		case 'html':
			return minifyHtml(rawCode)
		case 'css':
			return minifyCss(rawCode)
		case 'js':
			return minifyJs(rawCode)
		case 'json':
			return JSON.stringify(JSON.parse(rawCode))
		default:
			return rawCode
	}
}

function minifyHtml(rawCode: string): string {
	return rawCode
		.replace(/<!--[\s\S]*?-->/g, '') // Remove comments
		.replace(/\s+/g, ' ') // Collapse whitespace
		.replace(/>\s+</g, '><') // Collapse spaces between tags
		.trim()
}

function minifyCss(rawCode: string): string {
	return rawCode
		.replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
		.replace(/\s+/g, ' ') // Collapse whitespace
		.replace(/ ?([{}:;,]) ?/g, '$1') // Remove spacing around symbols
		.replace(/;}/g, '}') // Remove trailing semicolons
		.trim()
}

function minifyJs(rawCode: string): string {
	return rawCode
		.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Strip comments
		.replace(/\s+/g, ' ') // Collapse whitespace
		.replace(/([{};,()[\]])\s+|\s+([{};,()[\]])/g, '$1$2') // Clean spacing around operators
		.trim()
}
