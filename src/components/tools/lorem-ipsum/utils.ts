import { CLASSIC_WORDS, LOREM_WORDS } from './constants'

export type LoremUnit = 'paragraphs' | 'sentences' | 'words'
export type LoremFormat = 'plain' | 'html'

export type LoremOptions = {
	unit: LoremUnit
	count: number
	startWithClassic: boolean
	format: LoremFormat
}

type Random = () => number

export const UNIT_LIMITS: Record<LoremUnit, { min: number; max: number }> = {
	paragraphs: { min: 1, max: 50 },
	sentences: { min: 1, max: 200 },
	words: { min: 1, max: 2000 },
}

const SENTENCE_WORDS = { min: 6, max: 14 }
const PARAGRAPH_SENTENCES = { min: 3, max: 6 }
// Comma appears in roughly half of the longer sentences
const COMMA_CHANCE = 0.5
const MIN_WORDS_FOR_COMMA = 8

export function clampCount(unit: LoremUnit, count: number): number {
	const { min, max } = UNIT_LIMITS[unit]
	return Math.min(max, Math.max(min, Math.round(count) || min))
}

function randomInt(random: Random, min: number, max: number): number {
	return min + Math.floor(random() * (max - min + 1))
}

function randomWords(count: number, random: Random): string[] {
	const words: string[] = []
	for (let i = 0; i < count; i++) {
		let word = LOREM_WORDS[randomInt(random, 0, LOREM_WORDS.length - 1)] ?? 'lorem'
		// Avoid repeating the same word back to back
		if (word === words[i - 1])
			word = LOREM_WORDS[(LOREM_WORDS.indexOf(word) + 1) % LOREM_WORDS.length] ?? word
		words.push(word)
	}
	return words
}

function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1)
}

function makeSentence(random: Random, leadingWords: string[] = []): string {
	const wordCount = Math.max(
		randomInt(random, SENTENCE_WORDS.min, SENTENCE_WORDS.max),
		leadingWords.length,
	)
	const words = [...leadingWords, ...randomWords(wordCount - leadingWords.length, random)]

	if (wordCount >= MIN_WORDS_FOR_COMMA && random() < COMMA_CHANCE) {
		const index = randomInt(random, Math.max(3, leadingWords.length), wordCount - 3) - 1
		words[index] = `${words[index]},`
	}
	return `${capitalize(words.join(' '))}.`
}

function makeParagraph(random: Random, leadingWords: string[] = []): string {
	const sentenceCount = randomInt(random, PARAGRAPH_SENTENCES.min, PARAGRAPH_SENTENCES.max)
	return Array.from({ length: sentenceCount }, (_, i) =>
		makeSentence(random, i === 0 ? leadingWords : []),
	).join(' ')
}

/** Generates placeholder text. `random` is injectable so output can be made deterministic. */
export function generateLorem(options: LoremOptions, random: Random = Math.random): string {
	const { unit, startWithClassic, format } = options
	const count = clampCount(unit, options.count)
	const leading = startWithClassic ? CLASSIC_WORDS : []

	if (unit === 'words') {
		const words = [
			...leading.slice(0, count),
			...randomWords(Math.max(0, count - leading.length), random),
		]
		const text = words.join(' ')
		return format === 'html' ? `<p>${text}</p>` : text
	}

	if (unit === 'sentences') {
		const sentences = Array.from({ length: count }, (_, i) =>
			makeSentence(random, i === 0 ? leading : []),
		)
		const text = sentences.join(' ')
		return format === 'html' ? `<p>${text}</p>` : text
	}

	const paragraphs = Array.from({ length: count }, (_, i) =>
		makeParagraph(random, i === 0 ? leading : []),
	)
	return format === 'html'
		? paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('\n')
		: paragraphs.join('\n\n')
}
