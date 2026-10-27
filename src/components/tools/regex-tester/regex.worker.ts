import { findMatches } from './utils'

export type RegexWorkerRequest = {
	id: number
	pattern: string
	flags: string
	text: string
}

self.onmessage = (event: MessageEvent<RegexWorkerRequest>) => {
	const { id, pattern, flags, text } = event.data
	self.postMessage({ id, ...findMatches(pattern, flags, text) })
}
