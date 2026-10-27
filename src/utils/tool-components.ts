import { type ComponentType, lazy } from 'react'

type ToolModule = { default: ComponentType }

// Every tool lives in src/components/tools/<tool-id>/ and default-exports its component from index.ts
const toolModules = import.meta.glob<ToolModule>('/src/components/tools/*/index.ts')

const lazyComponents = new Map<string, ComponentType>()

export function getToolModulePath(toolId: string): string {
	return `/src/components/tools/${toolId}/index.ts`
}

export function hasToolComponent(toolId: string): boolean {
	return getToolModulePath(toolId) in toolModules
}

export function getToolComponent(toolId: string): ComponentType | undefined {
	const cached = lazyComponents.get(toolId)
	if (cached) return cached

	const load = toolModules[getToolModulePath(toolId)]
	if (!load) return undefined

	const component = lazy(load)
	lazyComponents.set(toolId, component)
	return component
}
