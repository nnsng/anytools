import { CronExpressionParser } from 'cron-parser'
import { useMemo, useState } from 'react'

import { CronBreakdown } from './cron-breakdown'
import { CronInput } from './cron-input'
import { CronSchedule } from './cron-schedule'
import { describeCronPart } from './utils'

type CronExplanation = {
	minute: string
	hour: string
	dayOfMonth: string
	month: string
	dayOfWeek: string
}

type CronResult = {
	error: string | null
	nextRuns: string[]
	explanation: CronExplanation | null
}

const NEXT_RUN_COUNT = 5

function parseCron(expression: string): CronResult {
	const expr = expression.trim()
	if (!expr) return { error: null, nextRuns: [], explanation: null }

	try {
		const interval = CronExpressionParser.parse(expr)
		const nextRuns = Array.from({ length: NEXT_RUN_COUNT }, () => interval.next().toString())

		const parts = expr.split(/\s+/)
		const explanation =
			parts.length >= 5
				? {
						minute: describeCronPart(parts[0] ?? '*', 'minute'),
						hour: describeCronPart(parts[1] ?? '*', 'hour'),
						dayOfMonth: describeCronPart(parts[2] ?? '*', 'day of month'),
						month: describeCronPart(parts[3] ?? '*', 'month'),
						dayOfWeek: describeCronPart(parts[4] ?? '*', 'day of week'),
					}
				: null

		return { error: null, nextRuns, explanation }
	} catch (err) {
		return {
			error: err instanceof Error ? err.message : 'Invalid cron expression',
			nextRuns: [],
			explanation: null,
		}
	}
}

export default function CronParser() {
	const [cronString, setCronString] = useState<string>('* * * * *')
	const { error, nextRuns, explanation } = useMemo(() => parseCron(cronString), [cronString])

	return (
		<div className="flex flex-1 flex-col gap-6">
			<CronInput cronString={cronString} setCronString={setCronString} error={error} />

			<div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-start">
				<CronBreakdown explanation={explanation} className="lg:flex-7" />
				<CronSchedule nextRuns={nextRuns} className="lg:flex-5" />
			</div>
		</div>
	)
}
