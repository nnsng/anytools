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
	// 1. DATA & SECURITY (JSON, Encoders, Tokens)
	// ==========================================
	{
		id: 'base64-image',
		name: 'Base64 Image',
		description: 'Convert images to Base64 and vice-versa.',
		category: 'Data & Security',
		icon: Image,
		tags: ['base64', 'image', 'encode', 'decode'],
	},
	{
		id: 'base64-text',
		name: 'Base64 Text',
		description: 'Encode and decode Base64 strings.',
		category: 'Data & Security',
		icon: Binary,
		tags: ['base64', 'text', 'encode', 'decode'],
	},
	{
		id: 'json-formatter',
		name: 'JSON Formatter',
		description: 'Format, minify, and validate JSON data.',
		category: 'Data & Security',
		icon: Braces,
		tags: ['json', 'formatter', 'minify', 'validate'],
	},
	{
		id: 'json-to-code',
		name: 'JSON to Code',
		description: 'Generate TypeScript interfaces or Go structs from JSON.',
		category: 'Data & Security',
		icon: FileJson,
		tags: ['json', 'typescript', 'interface', 'converter', 'go'],
	},
	{
		id: 'jwt-debugger',
		name: 'JWT Debugger',
		description: 'Decode, verify, and generate JSON Web Tokens.',
		category: 'Data & Security',
		icon: Shield,
		tags: ['jwt', 'debugger', 'token', 'decode'],
	},

	// ==========================================
	// 2. WEB UTILITIES (Web formats, Sandbox, Visuals)
	// ==========================================
	{
		id: 'color-converter',
		name: 'Color Converter',
		description: 'Convert color formats and pick colors.',
		category: 'Web Utilities',
		icon: Palette,
		tags: ['color', 'converter', 'picker', 'hex', 'rgb'],
	},
	{
		id: 'favicon-generator',
		name: 'Favicon Generator',
		description: 'Create favicon packages from images, emojis, or text.',
		category: 'Web Utilities',
		icon: Image,
		tags: ['favicon', 'generator', 'icon'],
	},
	{
		id: 'html-entity-encoder',
		name: 'HTML Entity Encoder',
		description: 'Encode and decode HTML character entities.',
		category: 'Web Utilities',
		icon: FileCode,
		tags: ['html', 'entities', 'encoder', 'encode', 'decode'],
	},
	{
		id: 'html-sandbox',
		name: 'HTML Sandbox',
		description: 'Live preview HTML, CSS, and JavaScript in a sandbox.',
		category: 'Web Utilities',
		icon: Eye,
		tags: ['html', 'sandbox', 'preview', 'live'],
	},
	{
		id: 'markdown-preview',
		name: 'Markdown Preview',
		description: 'Render Markdown to HTML with live preview.',
		category: 'Web Utilities',
		icon: FileText,
		tags: ['markdown', 'preview', 'render', 'html'],
	},
	{
		id: 'url-encoder',
		name: 'URL Encoder',
		description: 'Encode and decode URL parameters.',
		category: 'Web Utilities',
		icon: Link,
		tags: ['url', 'encoder', 'decode', 'encode'],
	},

	// ==========================================
	// 3. GENERATORS (Building data out of nothing)
	// ==========================================
	{
		id: 'mock-data-generator',
		name: 'Mock Data Generator',
		description: 'Generate mock JSON data using customizable schemas.',
		category: 'Generates',
		icon: Database,
		tags: ['mock', 'data', 'generator', 'json'],
	},
	{
		id: 'password-generator',
		name: 'Password Generator',
		description: 'Generate strong, secure random passwords.',
		category: 'Generates',
		icon: Key,
		tags: ['password', 'generator', 'random'],
	},
	{
		id: 'qr-code-studio',
		name: 'QR Code Studio',
		description: 'Generate and scan QR codes client-side.',
		category: 'Generates',
		icon: QrCode,
		tags: ['qrcode', 'qr', 'generator', 'scanner'],
	},
	{
		id: 'uuid-generator',
		name: 'UUID Generator',
		description: 'Bulk generate random UUID v1 and v4 identifiers.',
		category: 'Generates',
		icon: Hash,
		tags: ['uuid', 'generator', 'id'],
	},

	// ==========================================
	// 4. DEVELOPMENT & FORMATTERS (Code, Timing, Specs)
	// ==========================================
	{
		id: 'cron-parser',
		name: 'Cron Parser',
		description: 'Parse cron expressions and predict execution times.',
		category: 'Dev & Syntax',
		icon: CalendarRange,
		tags: ['cron', 'parser', 'schedule'],
	},
	{
		id: 'curl-to-code',
		name: 'cURL to Code',
		description: 'Convert cURL commands to Fetch, Python, and Go code.',
		category: 'Dev & Syntax',
		icon: Terminal,
		tags: ['curl', 'code', 'converter', 'api'],
	},
	{
		id: 'diff-checker',
		name: 'Diff Checker',
		description: 'Compare two text snippets side-by-side or inline.',
		category: 'Dev & Syntax',
		icon: GitCompare,
		tags: ['diff', 'compare', 'text'],
	},
	{
		id: 'js-formatter',
		name: 'JS Formatter',
		description: 'Format and minify JavaScript code.',
		category: 'Dev & Syntax',
		icon: Code2,
		tags: ['javascript', 'js', 'formatter', 'minify'],
	},
	{
		id: 'regex-tester',
		name: 'Regex Tester',
		description: 'Test and debug regular expressions in real-time.',
		category: 'Dev & Syntax',
		icon: Code2,
		tags: ['regex', 'tester', 'match', 'pattern'],
	},
	{
		id: 'text-analyzer',
		name: 'Text Analyzer',
		description: 'Analyze text statistics and transform string cases.',
		category: 'Dev & Syntax',
		icon: FileText,
		tags: ['text', 'analyzer', 'stats'],
	},
	{
		id: 'timestamp-converter',
		name: 'Timestamp Converter',
		description: 'Convert Unix epoch timestamps to dates and vice-versa.',
		category: 'Dev & Syntax',
		icon: Clock,
		tags: ['unix', 'epoch', 'timestamp', 'converter', 'date'],
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
