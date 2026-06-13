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
		<div className="flex flex-col gap-6">
			<RegexInput
				pattern={pattern}
				setPattern={setPattern}
				flags={flags}
				handleFlagToggle={handleFlagToggle}
				regexError={regexError}
			/>

			<div className="flex flex-col gap-6 lg:flex-row">
				<RegexPanel
					subjectText={subjectText}
					setSubjectText={setSubjectText}
					highlightedNode={highlightedNode}
					className="flex-2"
				/>
				<RegexMatches matches={matches} className="flex-1" />
			</div>
		</div>
	)
}
