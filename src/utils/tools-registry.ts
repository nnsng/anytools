import {
	Binary,
	Braces,
	CalendarRange,
	Clock,
	Code2,
	Database,
	Eye,
	FileCode,
	FileJson,
	FileText,
	GitCompare,
	Image,
	Link,
	type LucideIcon,
	Palette,
	Terminal,
} from 'lucide-react'

export interface ToolMetadata {
	id: string
	name: string
	description: string
	category: 'Converters' | 'Formatters & Parsers' | 'Dev Utilities'
	icon: LucideIcon
	tags: string[]
}

export const TOOLS: ToolMetadata[] = [
	{
		id: 'unix-converter',
		name: 'Unix Time Converter',
		description:
			'Convert epoch timestamps to human-readable dates and vice versa.',
		category: 'Converters',
		icon: Clock,
		tags: ['epoch', 'timestamp', 'date', 'time', 'unix', 'millis'],
	},
	{
		id: 'json-formatter',
		name: 'JSON Format/Validate',
		description:
			'Beautify, minify, and validate JSON data with syntax highlighting.',
		category: 'Formatters & Parsers',
		icon: Braces,
		tags: [
			'json',
			'format',
			'beautify',
			'minify',
			'validate',
			'lint',
			'prettify',
		],
	},
	{
		id: 'base64-string',
		name: 'Base64 String Encode/Decode',
		description:
			'Safely encode and decode text strings to and from Base64 format.',
		category: 'Converters',
		icon: Binary,
		tags: ['base64', 'encode', 'decode', 'string', 'text', 'binary'],
	},
	{
		id: 'base64-image',
		name: 'Base64 Image Encode/Decode',
		description:
			'Convert images to Base64 data URIs or decode Base64 strings to images.',
		category: 'Converters',
		icon: Image,
		tags: [
			'base64',
			'image',
			'encode',
			'decode',
			'file',
			'drag',
			'drop',
			'png',
			'jpg',
		],
	},
	{
		id: 'regex-tester',
		name: 'RegExp Tester',
		description:
			'Test Javascript regular expressions with color-coded group matches in real-time.',
		category: 'Dev Utilities',
		icon: Code2,
		tags: [
			'regex',
			'regexp',
			'test',
			'match',
			'pattern',
			'expression',
			'groups',
		],
	},
	{
		id: 'url-encoder',
		name: 'URL Encode/Decode',
		description: 'Safely encode and decode URI components/parameters.',
		category: 'Converters',
		icon: Link,
		tags: ['url', 'uri', 'encode', 'decode', 'percent', 'escape'],
	},
	{
		id: 'html-encoder',
		name: 'HTML Entity Encode/Decode',
		description:
			'Convert characters to their corresponding HTML entities and vice-versa.',
		category: 'Converters',
		icon: FileCode,
		tags: [
			'html',
			'entities',
			'encode',
			'decode',
			'escape',
			'unescape',
			'sanitize',
		],
	},
	{
		id: 'html-preview',
		name: 'HTML Preview',
		description:
			'Render and preview raw HTML/CSS/JS in a secured sandboxed iframe.',
		category: 'Dev Utilities',
		icon: Eye,
		tags: ['html', 'preview', 'render', 'sandbox', 'iframe', 'live', 'page'],
	},
	{
		id: 'markdown-preview',
		name: 'Markdown Preview',
		description: 'Compile and render Rich Markdown content to HTML on the fly.',
		category: 'Dev Utilities',
		icon: FileText,
		tags: ['markdown', 'md', 'preview', 'render', 'html', 'marked'],
	},
	{
		id: 'diff-checker',
		name: 'Text Diff Checker',
		description:
			'Compare two text snippets and see highlighted differences side-by-side or inline.',
		category: 'Dev Utilities',
		icon: GitCompare,
		tags: ['diff', 'compare', 'text', 'merge', 'changes', 'patch'],
	},
	{
		id: 'cron-parser',
		name: 'Cron Job Parser',
		description:
			'Decode cron expressions into human-readable text and predict next run times.',
		category: 'Formatters & Parsers',
		icon: CalendarRange,
		tags: ['cron', 'schedule', 'tab', 'parse', 'interval', 'job', 'timer'],
	},
	{
		id: 'color-converter',
		name: 'Color Converter',
		description:
			'Convert color values between HEX, RGB, HSL, and CMYK formats with a preview color box.',
		category: 'Converters',
		icon: Palette,
		tags: [
			'color',
			'hex',
			'rgb',
			'hsl',
			'cmyk',
			'picker',
			'convert',
			'palette',
		],
	},
	{
		id: 'curl-to-code',
		name: 'cURL to Code',
		description:
			'Transform client cURL command strings into Fetch API, Python, or Go request blocks.',
		category: 'Converters',
		icon: Terminal,
		tags: [
			'curl',
			'fetch',
			'python',
			'go',
			'request',
			'code',
			'generate',
			'api',
		],
	},
	{
		id: 'json-to-code',
		name: 'JSON to Code',
		description:
			'Parse raw JSON structures and auto-generate clean TypeScript interfaces.',
		category: 'Converters',
		icon: FileJson,
		tags: ['json', 'typescript', 'ts', 'interface', 'type', 'convert', 'model'],
	},
	{
		id: 'mock-generator',
		name: 'Data Forge (Mock Gen)',
		description:
			'Generate high-quality mock data datasets (JSON) using customizable schemas.',
		category: 'Dev Utilities',
		icon: Database,
		tags: [
			'mock',
			'data',
			'forge',
			'json',
			'generate',
			'schema',
			'faker',
			'test',
		],
	},
]
