import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useEffect, useState } from 'react'
import { DateToEpoch } from './date-to-epoch'
import { EpochToDate } from './epoch-to-date'
import { LiveClock } from './live-clock'

dayjs.extend(relativeTime)

export default function UnixConverter() {
	// Live Clock
	const [liveEpoch, setLiveEpoch] = useState<number>(Math.floor(Date.now() / 1000))
	const [isLiveActive, setIsLiveActive] = useState<boolean>(true)

	useEffect(() => {
		if (!isLiveActive) return
		const interval = setInterval(() => {
			setLiveEpoch(Math.floor(Date.now() / 1000))
		}, 1000)
		return () => clearInterval(interval)
	}, [isLiveActive])

	// Conversion: Epoch to Date
	const [inputEpoch, setInputEpoch] = useState<string>(Math.floor(Date.now() / 1000).toString())
	const [epochError, setEpochError] = useState<string | null>(null)
	const [epochResults, setEpochResults] = useState<{
		local: string
		utc: string
		iso: string
		relative: string
	} | null>(null)

	const handleConvertEpoch = useCallback((value: string) => {
		setInputEpoch(value)
		if (!value) {
			setEpochResults(null)
			setEpochError(null)
			return
		}

		const num = Number(value.trim())
		if (Number.isNaN(num)) {
			setEpochError('Invalid number value')
			setEpochResults(null)
			return
		}

		setEpochError(null)
		// Guess seconds vs milliseconds: if length >= 12, assume ms
		const isMs = value.trim().length >= 12
		const timestamp = isMs ? num : num * 1000

		try {
			const date = new Date(timestamp)
			if (Number.isNaN(date.getTime())) {
				throw new Error()
			}

			setEpochResults({
				local: date.toString(),
				utc: date.toUTCString(),
				iso: date.toISOString(),
				relative: dayjs(date).fromNow(),
			})
		} catch {
			setEpochError('Date conversion failed. Out of range?')
			setEpochResults(null)
		}
	}, [])

	// Conversion: Date to Epoch
	const [inputDate, setInputDate] = useState<string>(new Date().toISOString().substring(0, 16)) // YYYY-MM-DDTHH:MM
	const [dateError, setDateError] = useState<string | null>(null)
	const [dateResults, setDateResults] = useState<{
		seconds: number
		millis: number
	} | null>(null)

	const handleConvertDate = useCallback((value: string) => {
		setInputDate(value)
		if (!value) {
			setDateResults(null)
			setDateError(null)
			return
		}

		try {
			const date = new Date(value)
			if (Number.isNaN(date.getTime())) {
				setDateError('Invalid Date format')
				setDateResults(null)
				return
			}
			setDateError(null)
			setDateResults({
				seconds: Math.floor(date.getTime() / 1000),
				millis: date.getTime(),
			})
		} catch {
			setDateError('Failed to parse date')
			setDateResults(null)
		}
	}, [])

	// Run initial conversions on load
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs only on mount with initial values
	useEffect(() => {
		handleConvertEpoch(inputEpoch)
		handleConvertDate(inputDate)
	}, [])

	const setInputToCurrent = () => {
		const current = Math.floor(Date.now() / 1000).toString()
		handleConvertEpoch(current)
	}

	return (
		<div className="flex flex-col gap-6">
			<LiveClock
				liveEpoch={liveEpoch}
				isLiveActive={isLiveActive}
				setIsLiveActive={setIsLiveActive}
				setInputToCurrent={setInputToCurrent}
			/>

			<div className="flex flex-col items-start gap-6 lg:flex-row">
				<EpochToDate
					inputEpoch={inputEpoch}
					epochError={epochError}
					epochResults={epochResults}
					handleConvertEpoch={handleConvertEpoch}
					setInputToCurrent={setInputToCurrent}
					className="lg:flex-1"
				/>

				<DateToEpoch
					inputDate={inputDate}
					dateError={dateError}
					dateResults={dateResults}
					handleConvertDate={handleConvertDate}
					handleConvertEpoch={handleConvertEpoch}
					className="lg:flex-1"
				/>
			</div>
		</div>
	)
}
