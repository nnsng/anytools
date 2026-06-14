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
	Hash,
	Image,
	Key,
	Link,
	type LucideIcon,
	Palette,
	QrCode,
	Shield,
	Terminal,
	Type,
} from 'lucide-react'

export type ToolMetadata = {
	id: string
	name: string
	description: string
	category: string
	icon: LucideIcon
	tags: string[]
}

export const TOOLS: ToolMetadata[] = [
	// ==========================================
	// 1. CONVERTERS & ENCODERS
	// ==========================================
	{
		id: 'timestamp-converter',
		name: 'Timestamp Converter',
		description: 'Convert Unix epoch timestamps to dates and vice-versa.',
		category: 'Converters & Encoders',
		icon: Clock,
		tags: ['unix', 'epoch', 'timestamp', 'converter', 'date'],
	},
	{
		id: 'base64-text',
		name: 'Base64 Text',
		description: 'Encode and decode Base64 strings.',
		category: 'Converters & Encoders',
		icon: Binary,
		tags: ['base64', 'text', 'encode', 'decode'],
	},
	{
		id: 'base64-image',
		name: 'Base64 Image',
		description: 'Convert images to Base64 and vice-versa.',
		category: 'Converters & Encoders',
		icon: Image,
		tags: ['base64', 'image', 'encode', 'decode'],
	},
	{
		id: 'url-encoder',
		name: 'URL Encoder',
		description: 'Encode and decode URL parameters.',
		category: 'Converters & Encoders',
		icon: Link,
		tags: ['url', 'encoder', 'decode', 'encode'],
	},
	{
		id: 'html-entity-encoder',
		name: 'HTML Entity Encoder',
		description: 'Encode and decode HTML character entities.',
		category: 'Converters & Encoders',
		icon: FileCode,
		tags: ['html', 'entities', 'encoder', 'encode', 'decode'],
	},
	{
		id: 'json-to-code',
		name: 'JSON to Code',
		description: 'Generate TypeScript interfaces from JSON.',
		category: 'Converters & Encoders',
		icon: FileJson,
		tags: ['json', 'typescript', 'interface', 'converter'],
	},
	{
		id: 'curl-to-code',
		name: 'cURL to Code',
		description: 'Convert cURL commands to JavaScript Fetch or Axios requests.',
		category: 'Converters & Encoders',
		icon: Terminal,
		tags: ['curl', 'code', 'converter', 'api', 'fetch', 'axios'],
	},
	{
		id: 'string-case-converter',
		name: 'String Case Converter',
		description: 'Convert text strings between different case formats.',
		category: 'Converters & Encoders',
		icon: Type,
		tags: ['string', 'case', 'converter', 'camel', 'snake'],
	},
	{
		id: 'color-converter',
		name: 'Color Converter',
		description: 'Convert color formats and pick colors.',
		category: 'Converters & Encoders',
		icon: Palette,
		tags: ['color', 'converter', 'picker', 'hex', 'rgb'],
	},

	// ==========================================
	// 2. FORMATTERS & PARSERS
	// ==========================================
	{
		id: 'json-formatter',
		name: 'JSON Formatter',
		description: 'Format, minify, and validate JSON data.',
		category: 'Formatters & Parsers',
		icon: Braces,
		tags: ['json', 'formatter', 'minify', 'validate'],
	},
	{
		id: 'js-formatter',
		name: 'JS Formatter',
		description: 'Format and minify JavaScript code.',
		category: 'Formatters & Parsers',
		icon: Code2,
		tags: ['javascript', 'js', 'formatter', 'minify'],
	},
	{
		id: 'css-formatter',
		name: 'CSS Formatter',
		description: 'Format, beautify, and minify CSS stylesheets.',
		category: 'Formatters & Parsers',
		icon: FileCode,
		tags: ['css', 'formatter', 'beautify', 'minify'],
	},
	{
		id: 'html-formatter',
		name: 'HTML Formatter',
		description: 'Format, beautify, and minify HTML templates.',
		category: 'Formatters & Parsers',
		icon: Code2,
		tags: ['html', 'formatter', 'beautify', 'minify'],
	},
	{
		id: 'cron-parser',
		name: 'Cron Parser',
		description: 'Parse cron expressions and predict execution times.',
		category: 'Formatters & Parsers',
		icon: CalendarRange,
		tags: ['cron', 'parser', 'schedule'],
	},

	// ==========================================
	// 3. GENERATORS
	// ==========================================
	{
		id: 'uuid-generator',
		name: 'UUID Generator',
		description: 'Bulk generate random UUID v1 and v4 identifiers.',
		category: 'Generators',
		icon: Hash,
		tags: ['uuid', 'generator', 'id'],
	},
	{
		id: 'password-generator',
		name: 'Password Generator',
		description: 'Generate strong, secure random passwords.',
		category: 'Generators',
		icon: Key,
		tags: ['password', 'generator', 'random'],
	},
	{
		id: 'mock-data-generator',
		name: 'Mock Data Generator',
		description: 'Generate mock JSON data using customizable schemas.',
		category: 'Generators',
		icon: Database,
		tags: ['mock', 'data', 'generator', 'json'],
	},
	{
		id: 'qr-code-studio',
		name: 'QR Code Studio',
		description: 'Generate and scan QR codes client-side.',
		category: 'Generators',
		icon: QrCode,
		tags: ['qrcode', 'qr', 'generator', 'scanner'],
	},
	{
		id: 'favicon-generator',
		name: 'Favicon Generator',
		description: 'Create favicon packages from images, emojis, or text.',
		category: 'Generators',
		icon: Image,
		tags: ['favicon', 'generator', 'icon'],
	},

	// ==========================================
	// 4. DEV UTILITIES
	// ==========================================
	{
		id: 'jwt-debugger',
		name: 'JWT Debugger',
		description: 'Decode, verify, and generate JSON Web Tokens.',
		category: 'Dev Utilities',
		icon: Shield,
		tags: ['jwt', 'debugger', 'token', 'decode'],
	},
	{
		id: 'diff-checker',
		name: 'Diff Checker',
		description: 'Compare two text snippets side-by-side or inline.',
		category: 'Dev Utilities',
		icon: GitCompare,
		tags: ['diff', 'compare', 'text'],
	},
	{
		id: 'regex-tester',
		name: 'Regex Tester',
		description: 'Test and debug regular expressions in real-time.',
		category: 'Dev Utilities',
		icon: Code2,
		tags: ['regex', 'tester', 'match', 'pattern'],
	},
	{
		id: 'text-analyzer',
		name: 'Text Analyzer',
		description: 'Analyze text statistics and transform string cases.',
		category: 'Dev Utilities',
		icon: FileText,
		tags: ['text', 'analyzer', 'stats'],
	},
	{
		id: 'html-sandbox',
		name: 'HTML Sandbox',
		description: 'Live preview HTML, CSS, and JavaScript in a sandbox.',
		category: 'Dev Utilities',
		icon: Eye,
		tags: ['html', 'sandbox', 'preview', 'live'],
	},
	{
		id: 'markdown-preview',
		name: 'Markdown Preview',
		description: 'Render Markdown to HTML with live preview.',
		category: 'Dev Utilities',
		icon: FileText,
		tags: ['markdown', 'preview', 'render', 'html'],
	},
]

export const groupToolsByCategory = (tools: ToolMetadata[]) => {
	return tools.reduce(
		(categories, tool) => {
			categories[tool.category] ??= []
			categories[tool.category].push(tool)
			return categories
		},
		{} as Record<string, ToolMetadata[]>,
	)
}
