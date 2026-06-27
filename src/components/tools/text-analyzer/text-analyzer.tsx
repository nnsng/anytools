import { useState } from 'react'
import { BorderBox } from '@/components/tools/shared'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { APP_NAME } from '@/constants/app'

function calculateStats(text: string) {
	if (!text) {
		return {
			charsWithSpaces: 0,
			charsNoSpaces: 0,
			words: 0,
			sentences: 0,
			paragraphs: 0,
			lines: 0,
			readTime: 0,
			speakTime: 0,
			letterFreq: [] as { char: string; count: number; pct: number }[],
			wordFreq: [] as { word: string; count: number; pct: number }[],
		}
	}

	const charsWithSpaces = text.length
	const charsNoSpaces = text.replace(/\s/g, '').length

	// Words count
	const wordsArr = text.trim().split(/\s+/).filter(Boolean)
	const words = wordsArr.length

	// Sentences count
	const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length

	// Paragraphs
	const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length

	// Lines
	const lines = text.split(/\r\n|\r|\n/).length

	// Read & Speak time (minutes)
	const readTime = Math.ceil(words / 200)
	const speakTime = Math.ceil(words / 130)

	// Letter frequency (case-insensitive)
	const letterMap: Record<string, number> = {}
	let totalLetters = 0
	for (const char of text.toLowerCase()) {
		if (/[a-z0-9]/.test(char)) {
			letterMap[char] = (letterMap[char] || 0) + 1
			totalLetters++
		}
	}
	const letterFreq = Object.entries(letterMap)
		.map(([char, count]) => ({
			char,
			count,
			pct: totalLetters > 0 ? (count / totalLetters) * 100 : 0,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10)

	// Word frequency
	const wordMap: Record<string, number> = {}
	let totalWords = 0
	for (const rawWord of wordsArr) {
		const clean = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '')
		if (clean) {
			wordMap[clean] = (wordMap[clean] || 0) + 1
			totalWords++
		}
	}
	const wordFreq = Object.entries(wordMap)
		.map(([word, count]) => ({
			word,
			count,
			pct: totalWords > 0 ? (count / totalWords) * 100 : 0,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10)

	return {
		charsWithSpaces,
		charsNoSpaces,
		words,
		sentences,
		paragraphs,
		lines,
		readTime,
		speakTime,
		letterFreq,
		wordFreq,
	}
}

export default function TextAnalyzer() {
	const [text, setText] = useState<string>(
		`Type or paste your content here. ${APP_NAME} will analyze word density, read time, character frequencies, and other readability statistics on the fly in real-time!`,
	)

	const stats = calculateStats(text)

	return (
		<div className="flex flex-col gap-6">
			{/* Text input */}
			<EditorPane
				title="Input Text Document"
				value={text}
				onChange={setText}
				placeholder="Type or paste your text here..."
				className="min-h-75 flex-1"
			/>

			{/* Metrics Dashboard */}
			<div className="scrollbar-thin flex flex-col gap-6">
				{/* Basic Counters */}
				<BorderBox className="grid grid-cols-3 gap-4 p-4">
					<BorderBox className="bg-terminal-bg p-3 text-center">
						<span className="block text-slate-500 text-xs uppercase">Words</span>
						<span className="font-bold text-lg text-matrix">{stats.words}</span>
					</BorderBox>
					<BorderBox className="bg-terminal-bg p-3 text-center">
						<span className="block text-slate-500 text-xs uppercase">Characters</span>
						<span className="font-bold text-foreground text-lg">{stats.charsWithSpaces}</span>
					</BorderBox>
					<BorderBox className="bg-terminal-bg p-3 text-center">
						<span className="block text-slate-500 text-xs uppercase">No Space</span>
						<span className="font-bold text-foreground text-lg">{stats.charsNoSpaces}</span>
					</BorderBox>
					<BorderBox className="bg-terminal-bg p-3 text-center">
						<span className="block text-slate-500 text-xs uppercase">Sentences</span>
						<span className="font-bold text-foreground text-lg">{stats.sentences}</span>
					</BorderBox>
					<BorderBox className="bg-terminal-bg p-3 text-center">
						<span className="block text-slate-500 text-xs uppercase">Paragraphs</span>
						<span className="font-bold text-foreground text-lg">{stats.paragraphs}</span>
					</BorderBox>
					<BorderBox className="bg-terminal-bg p-3 text-center">
						<span className="block text-slate-500 text-xs uppercase">Lines</span>
						<span className="font-bold text-foreground text-lg">{stats.lines}</span>
					</BorderBox>
				</BorderBox>

				{/* Time Estimations */}
				<BorderBox className="grid grid-cols-2 gap-4 p-4">
					<BorderBox className="bg-terminal-bg p-3 text-center">
						<span className="block text-slate-500 text-xs uppercase">Reading Time</span>
						<span className="font-bold text-base text-matrix-glow">{stats.readTime} min</span>
					</BorderBox>
					<BorderBox className="bg-terminal-bg p-3 text-center">
						<span className="block text-slate-500 text-xs uppercase">Speaking Time</span>
						<span className="font-bold text-base text-matrix-glow">{stats.speakTime} min</span>
					</BorderBox>
				</BorderBox>
			</div>
		</div>
	)
}
