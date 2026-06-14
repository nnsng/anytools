import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { APP_NAME } from '@/constants/app'
import { TOOLS } from '@/utils/tools-registry'

const Base64Image = React.lazy(() => import('@/components/tools/base64-image'))
const Base64Text = React.lazy(() => import('@/components/tools/base64-text'))
const ColorConverter = React.lazy(() => import('@/components/tools/color-converter'))
const CronParser = React.lazy(() => import('@/components/tools/cron-parser'))
const CurlToCode = React.lazy(() => import('@/components/tools/curl-to-code'))
const DiffChecker = React.lazy(() => import('@/components/tools/diff-checker'))
const HtmlEntityEncoder = React.lazy(() => import('@/components/tools/html-entity-encoder'))
const HtmlSandbox = React.lazy(() => import('@/components/tools/html-sandbox'))
const JsonFormatter = React.lazy(() => import('@/components/tools/json-formatter'))
const JsonToCode = React.lazy(() => import('@/components/tools/json-to-code'))
const MarkdownPreview = React.lazy(() => import('@/components/tools/markdown-preview'))
const MockDataGenerator = React.lazy(() => import('@/components/tools/mock-data-generator'))
const RegexTester = React.lazy(() => import('@/components/tools/regex-tester'))
const ToolStub = React.lazy(() => import('@/components/tools/stub'))
const TimestampConverter = React.lazy(() => import('@/components/tools/timestamp-converter'))
const UrlEncoder = React.lazy(() => import('@/components/tools/url-encoder'))
const JsFormatter = React.lazy(() => import('@/components/tools/js-formatter'))
const UuidGenerator = React.lazy(() => import('@/components/tools/uuid-generator'))
const PasswordGenerator = React.lazy(() => import('@/components/tools/password-generator'))
const QrCodeStudio = React.lazy(() => import('@/components/tools/qr-code-studio'))
const FaviconGenerator = React.lazy(() => import('@/components/tools/favicon-generator'))
const JwtDebugger = React.lazy(() => import('@/components/tools/jwt-debugger'))
const TextAnalyzer = React.lazy(() => import('@/components/tools/text-analyzer'))
const CssFormatter = React.lazy(() => import('@/components/tools/css-formatter'))
const HtmlFormatter = React.lazy(() => import('@/components/tools/html-formatter'))
const StringCaseConverter = React.lazy(() => import('@/components/tools/string-case-converter'))

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
	'timestamp-converter': TimestampConverter,
	'json-formatter': JsonFormatter,
	'base64-text': Base64Text,
	'base64-image': Base64Image,
	'regex-tester': RegexTester,
	'url-encoder': UrlEncoder,
	'html-entity-encoder': HtmlEntityEncoder,
	'html-sandbox': HtmlSandbox,
	'markdown-preview': MarkdownPreview,
	'diff-checker': DiffChecker,
	'cron-parser': CronParser,
	'color-converter': ColorConverter,
	'curl-to-code': CurlToCode,
	'json-to-code': JsonToCode,
	'mock-data-generator': MockDataGenerator,
	'js-formatter': JsFormatter,
	'uuid-generator': UuidGenerator,
	'password-generator': PasswordGenerator,
	'qr-code-studio': QrCodeStudio,
	'favicon-generator': FaviconGenerator,
	'jwt-debugger': JwtDebugger,
	'text-analyzer': TextAnalyzer,
	'css-formatter': CssFormatter,
	'html-formatter': HtmlFormatter,
	'string-case-converter': StringCaseConverter,
}

export const Route = createFileRoute('/tools/$toolId')({
	component: ToolContainer,
})

function ToolContainer() {
	const { toolId } = Route.useParams()
	const tool = TOOLS.find((t) => t.id === toolId)

	useEffect(() => {
		if (tool) {
			document.title = `${tool.name} - ${APP_NAME}`
		}
	}, [tool])

	if (!tool) {
		return (
			<div className="mx-auto my-12 max-w-2xl rounded border border-red-500/30 bg-red-950/20 p-8 text-center font-mono">
				<h2 className="mb-4 font-bold text-red-500 text-xl">ERROR 404: MODULE_NOT_FOUND</h2>
				<p className="mb-6 text-slate-400 text-sm">
					The requested system utility{' '}
					<code className="rounded bg-red-900/30 px-1 py-0.5 text-red-300">{toolId}</code> is not
					registered in the system index.
				</p>
				<div className="inline-block rounded border border-red-500/50 bg-red-900/20 px-4 py-2 text-red-400 text-xs">
					$ cd /bin && ./run {toolId} --verbose
				</div>
			</div>
		)
	}

	const Component =
		TOOL_COMPONENTS[tool.id] || (() => <ToolStub toolId={tool.id} name={tool.name} />)

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-1 animate-fade-in flex-col gap-4 p-4 md:p-6 lg:h-full lg:min-h-0 lg:p-8">
			<div className="flex flex-col justify-between gap-4 border-terminal-border border-b pb-4 md:flex-row md:items-center">
				<div className="flex flex-col gap-2">
					<div className="mb-1 flex items-center gap-2 font-mono text-matrix text-xs">
						<span>[ SYSTEM_BIN ]</span>
						<span>/</span>
						<span>{tool.category.toLowerCase().replace(/\s+/g, '-')}</span>
					</div>
					<h1 className="flex items-center gap-3 font-bold font-mono text-2xl text-white tracking-tight md:text-3xl">
						{React.createElement(tool.icon, {
							className: 'w-7 h-7 text-matrix text-glow',
						})}
						<span className="cursor-blink">{tool.name}</span>
					</h1>
					<p className="mt-1 font-mono text-slate-400 text-sm">{tool.description}</p>
				</div>
			</div>

			<div className="flex min-h-0 flex-1 [&>div]:w-full">
				<React.Suspense
					fallback={
						<div className="flex h-full flex-col items-center justify-center gap-3 font-mono text-matrix">
							<Loader2 className="h-8 w-8 animate-spin" />
							<span className="text-xs tracking-widest opacity-60">LOADING MODULE...</span>
						</div>
					}
				>
					<Component />
				</React.Suspense>
			</div>
		</div>
	)
}
