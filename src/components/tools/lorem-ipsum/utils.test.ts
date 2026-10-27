import { describe, expect, it } from 'vite-plus/test'

import { clampCount, generateLorem, type LoremOptions } from './utils'

/** Small deterministic generator so assertions don't depend on Math.random. */
function seeded(seed: number) {
	let state = seed
	return () => {
		state = (state * 1664525 + 1013904223) % 4294967296
		return state / 4294967296
	}
}

const BASE: LoremOptions = { unit: 'words', count: 10, startWithClassic: false }

describe('generateLorem', () => {
	it('produces exactly the requested number of words', () => {
		for (const count of [1, 7, 100]) {
			const text = generateLorem({ ...BASE, count }, seeded(1))
			expect(text.split(' ')).toHaveLength(count)
		}
	})

	it('produces the requested number of sentences, each ending with a period', () => {
		const text = generateLorem({ ...BASE, unit: 'sentences', count: 5 }, seeded(2))
		expect(text.match(/\./g)).toHaveLength(5)
		expect(text.endsWith('.')).toBe(true)
		expect(text.charAt(0)).toMatch(/[A-Z]/)
	})

	it('produces the requested number of paragraphs of 3-6 sentences', () => {
		const text = generateLorem({ ...BASE, unit: 'paragraphs', count: 4 }, seeded(3))
		const paragraphs = text.split('\n\n')
		expect(paragraphs).toHaveLength(4)
		for (const paragraph of paragraphs) {
			const sentences = paragraph.match(/\./g)?.length ?? 0
			expect(sentences).toBeGreaterThanOrEqual(3)
			expect(sentences).toBeLessThanOrEqual(6)
		}
	})

	it('starts with the classic opening when asked', () => {
		const opening = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
		for (const unit of ['paragraphs', 'sentences'] as const) {
			const text = generateLorem({ ...BASE, unit, count: 2, startWithClassic: true }, seeded(4))
			expect(text.replace(',', '').startsWith(opening.replace(',', ''))).toBe(true)
		}
		const words = generateLorem({ ...BASE, count: 3, startWithClassic: true }, seeded(4))
		expect(words).toBe('Lorem ipsum dolor')
	})

	it('is deterministic for the same random source', () => {
		const a = generateLorem({ ...BASE, unit: 'paragraphs', count: 2 }, seeded(9))
		const b = generateLorem({ ...BASE, unit: 'paragraphs', count: 2 }, seeded(9))
		expect(a).toBe(b)
	})

	it('never repeats a word back to back', () => {
		const words = generateLorem({ ...BASE, count: 500 }, seeded(11)).split(' ')
		for (let i = 1; i < words.length; i++) expect(words[i]).not.toBe(words[i - 1])
	})
})

describe('clampCount', () => {
	it('keeps counts within each unit limit', () => {
		expect(clampCount('paragraphs', 0)).toBe(1)
		expect(clampCount('paragraphs', 999)).toBe(50)
		expect(clampCount('words', 5000)).toBe(2000)
		expect(clampCount('sentences', Number.NaN)).toBe(1)
	})
})
