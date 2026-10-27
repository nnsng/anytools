import { format } from 'date-fns'
import { useMemo, useState } from 'react'

import { DateToEpoch } from './date-to-epoch'
import { EpochToDate } from './epoch-to-date'
import { LiveClock } from './live-clock'
import { convertDate, convertEpoch, currentEpochSeconds } from './utils'

export default function TimestampConverter() {
	const [inputEpoch, setInputEpoch] = useState<string>(() => currentEpochSeconds().toString())
	const [inputDate, setInputDate] = useState<string>(() =>
		format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
	)

	const { results: epochResults, error: epochError } = useMemo(
		() => convertEpoch(inputEpoch),
		[inputEpoch],
	)
	const { results: dateResults, error: dateError } = useMemo(
		() => convertDate(inputDate),
		[inputDate],
	)

	const setInputToCurrent = () => setInputEpoch(currentEpochSeconds().toString())

	return (
		<div className="flex flex-col gap-6">
			<LiveClock setInputToCurrent={setInputToCurrent} />

			<div className="flex flex-col items-start gap-6 lg:flex-row">
				<EpochToDate
					inputEpoch={inputEpoch}
					epochError={epochError}
					epochResults={epochResults}
					handleConvertEpoch={setInputEpoch}
					setInputToCurrent={setInputToCurrent}
					className="lg:flex-1"
				/>

				<DateToEpoch
					inputDate={inputDate}
					dateError={dateError}
					dateResults={dateResults}
					handleConvertDate={setInputDate}
					handleConvertEpoch={setInputEpoch}
					className="lg:flex-1"
				/>
			</div>
		</div>
	)
}
