import {
	ArrowLeftRight,
	Binary,
	Braces,
	CalendarRange,
	Calculator,
	Clock,
	Code2,
	CopyMinus,
	Database,
	Eye,
	FileCode,
	FileText,
	GitCompare,
	Hash,
	Image,
	Key,
	Link,
	type LucideIcon,
	Paintbrush,
	Palette,
	Pilcrow,
	QrCode,
	Shield,
	Table,
	Type,
} from 'lucide-react'

/** Sidebar and home-page sections, in display order. */
export const CATEGORIES = [
	'Converters & Encoders',
	'Formatters',
	'Text Tools',
	'Dev Utilities',
	'Generators',
	'Playgrounds',
] as const

export type ToolCategory = (typeof CATEGORIES)[number]

export type ToolMetadata = {
	id: string
	name: string
	description: string
	category: ToolCategory
	icon: LucideIcon
	tags: string[]
}

export const TOOLS: ToolMetadata[] = [
	// ========== Converters & Encoders ==========
	{
		id: 'base64-image',
		name: 'Base64 Image',
		description: 'Convert images to Base64 and vice-versa.',
		category: 'Converters & Encoders',
		icon: Image,
		tags: ['base64', 'image', 'encode', 'decode'],
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
		id: 'color-converter',
		name: 'Color Converter',
		description: 'Convert color formats and pick colors.',
		category: 'Converters & Encoders',
		icon: Palette,
		tags: ['color', 'converter', 'picker', 'hex', 'rgb'],
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
		id: 'json-csv',
		name: 'JSON ⇄ CSV',
		description: 'Convert between JSON and CSV with delimiter, header and type options.',
		category: 'Converters & Encoders',
		icon: Table,
		tags: ['json', 'csv', 'converter', 'table', 'spreadsheet', 'excel'],
	},
	{
		id: 'json-yaml',
		name: 'JSON ⇄ YAML',
		description: 'Convert between JSON and YAML, with error positions for invalid YAML.',
		category: 'Converters & Encoders',
		icon: ArrowLeftRight,
		tags: ['json', 'yaml', 'yml', 'converter', 'config'],
	},
	{
		id: 'number-base-converter',
		name: 'Number Base Converter',
		description: 'Convert integers between binary, octal, decimal, hex and any base up to 36.',
		category: 'Converters & Encoders',
		icon: Calculator,
		tags: ['number', 'base', 'binary', 'hex', 'octal', 'decimal', 'radix', 'converter'],
	},
	{
		id: 'timestamp-converter',
		name: 'Timestamp Converter',
		description: 'Convert Unix epoch timestamps to dates and vice-versa.',
		category: 'Converters & Encoders',
		icon: Clock,
		tags: ['unix', 'epoch', 'timestamp', 'converter', 'date'],
	},
	{
		id: 'url-encoder',
		name: 'URL Encoder',
		description: 'Encode and decode URL parameters.',
		category: 'Converters & Encoders',
		icon: Link,
		tags: ['url', 'encoder', 'decode', 'encode'],
	},

	// ========== Formatters ==========
	{
		id: 'css-formatter',
		name: 'CSS Formatter',
		description: 'Format, beautify, and minify CSS stylesheets.',
		category: 'Formatters',
		icon: FileCode,
		tags: ['css', 'formatter', 'beautify', 'minify'],
	},
	{
		id: 'html-formatter',
		name: 'HTML Formatter',
		description: 'Format, beautify, and minify HTML templates.',
		category: 'Formatters',
		icon: Code2,
		tags: ['html', 'formatter', 'beautify', 'minify'],
	},
	{
		id: 'js-formatter',
		name: 'JS Formatter',
		description: 'Format and minify JavaScript code.',
		category: 'Formatters',
		icon: Code2,
		tags: ['javascript', 'js', 'formatter', 'minify'],
	},
	{
		id: 'json-formatter',
		name: 'JSON Formatter',
		description: 'Format, minify, and validate JSON data.',
		category: 'Formatters',
		icon: Braces,
		tags: ['json', 'formatter', 'minify', 'validate'],
	},

	// ========== Text Tools ==========
	{
		id: 'diff-checker',
		name: 'Diff Checker',
		description: 'Compare two text snippets side-by-side or inline.',
		category: 'Text Tools',
		icon: GitCompare,
		tags: ['diff', 'compare', 'text'],
	},
	{
		id: 'dedupe',
		name: 'List Deduplicator',
		description: 'Remove duplicate lines or items from a text list.',
		category: 'Text Tools',
		icon: CopyMinus,
		tags: ['dedupe', 'duplicate', 'unique', 'lines', 'list'],
	},
	{
		id: 'string-case-converter',
		name: 'String Case Converter',
		description: 'Convert text strings between different case formats.',
		category: 'Text Tools',
		icon: Type,
		tags: ['string', 'case', 'converter', 'camel', 'snake'],
	},
	{
		id: 'text-analyzer',
		name: 'Text Analyzer',
		description: 'Analyze text statistics and transform string cases.',
		category: 'Text Tools',
		icon: FileText,
		tags: ['text', 'analyzer', 'stats'],
	},

	// ========== Dev Utilities ==========
	{
		id: 'cron-parser',
		name: 'Cron Parser',
		description: 'Parse cron expressions and predict execution times.',
		category: 'Dev Utilities',
		icon: CalendarRange,
		tags: ['cron', 'parser', 'schedule'],
	},
	{
		id: 'jwt-debugger',
		name: 'JWT Debugger',
		description: 'Decode, verify, and generate JSON Web Tokens.',
		category: 'Dev Utilities',
		icon: Shield,
		tags: ['jwt', 'debugger', 'token', 'decode'],
	},
	{
		id: 'regex-tester',
		name: 'Regex Tester',
		description: 'Test and debug regular expressions in real-time.',
		category: 'Dev Utilities',
		icon: Code2,
		tags: ['regex', 'tester', 'match', 'pattern'],
	},

	// ========== Generators ==========
	{
		id: 'css-generator',
		name: 'CSS Generator',
		description: 'Build box shadows, gradients and fluid clamp() sizes with a live preview.',
		category: 'Generators',
		icon: Paintbrush,
		tags: ['css', 'box-shadow', 'shadow', 'gradient', 'clamp', 'rem', 'px', 'fluid', 'generator'],
	},
	{
		id: 'favicon-generator',
		name: 'Favicon Generator',
		description: 'Create favicon packages from images, emojis, or text.',
		category: 'Generators',
		icon: Image,
		tags: ['favicon', 'generator', 'icon'],
	},
	{
		id: 'lorem-ipsum',
		name: 'Lorem Ipsum Generator',
		description: 'Generate placeholder paragraphs, sentences or words.',
		category: 'Generators',
		icon: Pilcrow,
		tags: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy', 'generator'],
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
		id: 'password-generator',
		name: 'Password Generator',
		description: 'Generate strong, secure random passwords.',
		category: 'Generators',
		icon: Key,
		tags: ['password', 'generator', 'random'],
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
		id: 'uuid-generator',
		name: 'UUID Generator',
		description: 'Bulk generate random UUID v1 and v4 identifiers.',
		category: 'Generators',
		icon: Hash,
		tags: ['uuid', 'generator', 'id'],
	},

	// ========== Playgrounds ==========
	{
		id: 'html-sandbox',
		name: 'HTML Sandbox',
		description: 'Live preview HTML, CSS, and JavaScript in a sandbox.',
		category: 'Playgrounds',
		icon: Eye,
		tags: ['html', 'sandbox', 'preview', 'live'],
	},
	{
		id: 'markdown-preview',
		name: 'Markdown Preview',
		description: 'Render Markdown to HTML with live preview.',
		category: 'Playgrounds',
		icon: FileText,
		tags: ['markdown', 'preview', 'render', 'html'],
	},
]

/** Groups tools by category in CATEGORIES order; tools inside a group are sorted by name. Empty groups are omitted. */
export const groupToolsByCategory = (tools: ToolMetadata[]) => {
	const groups = new Map<ToolCategory, ToolMetadata[]>()
	for (const category of CATEGORIES) {
		const inCategory = tools
			.filter((tool) => tool.category === category)
			.sort((a, b) => a.name.localeCompare(b.name))
		if (inCategory.length > 0) groups.set(category, inCategory)
	}
	return Object.fromEntries(groups) as Partial<Record<ToolCategory, ToolMetadata[]>>
}
