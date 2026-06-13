import { CronExpressionParser } from 'cron-parser'
import { useCallback, useEffect, useState } from 'react'
import { CronBreakdown } from './cron-breakdown'
import { CronInput } from './cron-input'
import { CronSchedule } from './cron-schedule'
import { describeCronPart } from './cron-utils'

export default function CronParser() {
	const [cronString, setCronString] = useState<string>('*/15 9-17 * * 1-5')
	const [error, setError] = useState<string | null>(null)
	const [nextRuns, setNextRuns] = useState<string[]>([])
	const [explanation, setExplanation] = useState<{
		minute: string
		hour: string
		dayOfMonth: string
		month: string
		dayOfWeek: string
	} | null>(null)

	const parseCron = useCallback((expression: string) => {
		const expr = expression.trim()
		if (!expr) {
			setError(null)
			setNextRuns([])
			setExplanation(null)
			return
		}

		try {
			// Parse expression
			const interval = CronExpressionParser.parse(expr)
			setError(null)

			// Calculate next 5 runs
			const runs: string[] = []
			for (let i = 0; i < 5; i++) {
				runs.push(interval.next().toString())
			}
			setNextRuns(runs)

			// Break down columns
			const parts = expr.split(/\s+/)
			if (parts.length >= 5) {
				setExplanation({
					minute: describeCronPart(parts[0], 'minute'),
					hour: describeCronPart(parts[1], 'hour'),
					dayOfMonth: describeCronPart(parts[2], 'day of month'),
					month: describeCronPart(parts[3], 'month'),
					dayOfWeek: describeCronPart(parts[4], 'day of week'),
				})
			} else {
				setExplanation(null)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Invalid cron expression')
			setNextRuns([])
			setExplanation(null)
		}
	}, [])

	useEffect(() => {
		parseCron(cronString)
	}, [cronString, parseCron])

	return (
		<div className="grid grid-cols-1 grid-rows-[auto_1fr] items-start gap-6 font-mono lg:grid-cols-12">
			<CronInput cronString={cronString} setCronString={setCronString} error={error} />
			<CronBreakdown explanation={explanation} />
			<CronSchedule nextRuns={nextRuns} />
		</div>
	)
}
