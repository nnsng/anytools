import { describe, expect, it } from 'vite-plus/test'

import { hasToolComponent } from './tool-components'
import { TOOLS } from './tools-registry'

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
})
