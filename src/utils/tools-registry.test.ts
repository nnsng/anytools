import { describe, expect, it } from 'vite-plus/test'

import { hasToolComponent } from './tool-components'
import { CATEGORIES, groupToolsByCategory, TOOLS } from './tools-registry'

describe('tools registry', () => {
	it('has unique kebab-case ids', () => {
		const ids = TOOLS.map((tool) => tool.id)
		expect(new Set(ids).size).toBe(ids.length)
		for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
	})

	it('has a component folder for every tool', () => {
		const missing = TOOLS.filter((tool) => !hasToolComponent(tool.id)).map((tool) => tool.id)
		expect(missing).toEqual([])
	})

	it('assigns every tool a known category', () => {
		for (const tool of TOOLS) expect(CATEGORIES).toContain(tool.category)
	})

	it('groups in CATEGORIES order and sorts tools by name inside each group', () => {
		const groups = groupToolsByCategory(TOOLS)
		const keys = Object.keys(groups)
		expect(keys).toEqual(CATEGORIES.filter((category) => keys.includes(category)))
		for (const list of Object.values(groups)) {
			const names = list?.map((tool) => tool.name) ?? []
			expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
		}
	})

	it('omits categories with no matching tools', () => {
		const onlyCss = TOOLS.filter((tool) => tool.id === 'css-generator')
		expect(Object.keys(groupToolsByCategory(onlyCss))).toEqual(['Generators'])
	})
})
