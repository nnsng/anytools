import { useState } from 'react'
import { RegexInput } from './regex-input'
import { RegexMatches } from './regex-matches'
import { RegexPanel } from './regex-panel'
import { useRegexMatcher } from './use-regex-matcher'

export default function RegexTester() {
	const [pattern, setPattern] = useState<string>('(\\w+)\\s(\\d+)')
	const [flags, setFlags] = useState({
		g: true,
		i: false,
		m: false,
		s: false,
		u: false,
		y: false,
	})
	const [subjectText, setSubjectText] = useState<string>('hello 123, world 456\ntest 789')

	const handleFlagToggle = (flag: keyof typeof flags) => {
		setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }))
	}

	const { matches, regexError, highlightedNode } = useRegexMatcher(pattern, flags, subjectText)

	return (
		<div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-6 font-mono lg:grid-cols-12">
			<RegexInput
				pattern={pattern}
				setPattern={setPattern}
				flags={flags}
				handleFlagToggle={handleFlagToggle}
				regexError={regexError}
			/>
			<RegexPanel
				subjectText={subjectText}
				setSubjectText={setSubjectText}
				highlightedNode={highlightedNode}
			/>
			<RegexMatches matches={matches} />
		</div>
	)
}
