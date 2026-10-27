import { useEffect, useRef, useState } from 'react'

import type { RegexWorkerRequest } from './regex.worker'
import { type MatchDetail, type RegexFlags, toFlagsString } from './utils'

const TIMEOUT_MS = 500
const TIMEOUT_ERROR = 'Pattern took too long to evaluate (possible catastrophic backtracking).'

type UseRegexMatcherResult = {
	matches: MatchDetail[]
	regexError: string | null
}

type WorkerResponse = {
	id: number
	matches: MatchDetail[]
	error: string | null
}

function createWorker() {
	return new Worker(new URL('./regex.worker.ts', import.meta.url), { type: 'module' })
}

export function useRegexMatcher(
	pattern: string,
	flags: RegexFlags,
	subjectText: string,
): UseRegexMatcherResult {
	const [result, setResult] = useState<UseRegexMatcherResult>({ matches: [], regexError: null })
	const workerRef = useRef<Worker | null>(null)
	const requestIdRef = useRef(0)

	useEffect(() => {
		return () => {
			workerRef.current?.terminate()
			workerRef.current = null
		}
	}, [])

	const flagsString = toFlagsString(flags)

	useEffect(() => {
		if (!pattern) {
			requestIdRef.current++
			setResult({ matches: [], regexError: null })
			return
		}

		const worker = workerRef.current ?? createWorker()
		workerRef.current = worker

		const id = ++requestIdRef.current
		let isSettled = false

		const timeoutId = setTimeout(() => {
			if (isSettled) return
			isSettled = true
			// A stuck regex can only be stopped by killing the worker
			worker.terminate()
			if (workerRef.current === worker) workerRef.current = null
			setResult({ matches: [], regexError: TIMEOUT_ERROR })
		}, TIMEOUT_MS)

		worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
			if (event.data.id !== id || isSettled) return
			isSettled = true
			clearTimeout(timeoutId)
			setResult({ matches: event.data.matches, regexError: event.data.error })
		}

		const request: RegexWorkerRequest = { id, pattern, flags: flagsString, text: subjectText }
		worker.postMessage(request)

		return () => {
			isSettled = true
			clearTimeout(timeoutId)
		}
	}, [pattern, flagsString, subjectText])

	return result
}
