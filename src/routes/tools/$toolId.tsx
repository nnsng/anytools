import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import Base64Image from '../../components/tools/base64-image/base64-image-client'
import Base64String from '../../components/tools/base64-string/base64-string-client'
import ColorConverter from '../../components/tools/color-converter/color-converter-client'
import CronParser from '../../components/tools/cron-parser/cron-parser-client'
import CurlToCode from '../../components/tools/curl-to-code/curl-to-code-client'
import DiffChecker from '../../components/tools/diff-checker/diff-checker-client'
import HtmlEncoder from '../../components/tools/html-encoder/html-encoder-client'
import HtmlPreview from '../../components/tools/html-preview/html-preview-client'
import JsonFormatter from '../../components/tools/json-formatter/json-formatter-client'
import JsonToCode from '../../components/tools/json-to-code/json-to-code-client'
import MarkdownPreview from '../../components/tools/markdown-preview/markdown-preview-client'
import MockGenerator from '../../components/tools/mock-generator/mock-generator-client'
import RegexTester from '../../components/tools/regex-tester/regex-tester-client'
import ToolStub from '../../components/tools/stub'
// Imports of implemented tools will go here:
import UnixConverter from '../../components/tools/unix-converter/unix-converter-client'
import UrlEncoder from '../../components/tools/url-encoder/url-encoder-client'
import { TOOLS } from '../../utils/tools-registry'

const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
	'unix-converter': UnixConverter,
	'json-formatter': JsonFormatter,
	'base64-string': Base64String,
	'base64-image': Base64Image,
	'regex-tester': RegexTester,
	'url-encoder': UrlEncoder,
	'html-encoder': HtmlEncoder,
	'html-preview': HtmlPreview,
	'markdown-preview': MarkdownPreview,
	'diff-checker': DiffChecker,
	'cron-parser': CronParser,
	'color-converter': ColorConverter,
	'curl-to-code': CurlToCode,
	'json-to-code': JsonToCode,
	'mock-generator': MockGenerator,
}

export const Route = createFileRoute('/tools/$toolId')({
	component: ToolContainer,
})

function ToolContainer() {
	const { toolId } = Route.useParams()
	const tool = TOOLS.find((t) => t.id === toolId)

	if (!tool) {
		return (
			<div className="mx-auto my-12 max-w-2xl rounded border border-red-500/30 bg-red-950/20 p-8 text-center font-mono">
				<h2 className="mb-4 font-bold text-red-500 text-xl">
					ERROR 404: MODULE_NOT_FOUND
				</h2>
				<p className="mb-6 text-slate-400 text-sm">
					The requested system utility{' '}
					<code className="rounded bg-red-900/30 px-1 py-0.5 text-red-300">
						{toolId}
					</code>{' '}
					is not registered in the system index.
				</p>
				<div className="inline-block rounded border border-red-500/50 bg-red-900/20 px-4 py-2 text-red-400 text-xs">
					$ cd /bin && ./run {toolId} --verbose
				</div>
			</div>
		)
	}

	const Component =
		TOOL_COMPONENTS[tool.id] ||
		(() => <ToolStub toolId={tool.id} name={tool.name} />)

	return (
		<div className="animate-fade-in space-y-6">
			<div className="flex flex-col justify-between gap-4 border-terminal-border border-b pb-4 md:flex-row md:items-center">
				<div>
					<div className="mb-1 flex items-center gap-2 font-mono text-matrix text-xs">
						<span>[ SYSTEM_BIN ]</span>
						<span>/</span>
						<span>{tool.category.toLowerCase().replace(/\s+/g, '-')}</span>
					</div>
					<h1 className="flex cursor-blink items-center gap-3 font-bold font-mono text-2xl text-white tracking-tight md:text-3xl">
						{React.createElement(tool.icon, {
							className: 'w-7 h-7 text-matrix text-glow',
						})}
						{tool.name}
					</h1>
					<p className="mt-1 max-w-3xl font-mono text-slate-400 text-sm">
						{tool.description}
					</p>
				</div>
			</div>

			<div className="min-h-[500px]">
				<Component />
			</div>
		</div>
	)
}
