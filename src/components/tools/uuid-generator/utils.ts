export function generateV1Uuid(): string {
	const msecs = Date.now()
	const clockseq = Math.floor(Math.random() * 0x3fff)
	const node = [0x01, 0x23, 0x45, 0x67, 0x89, 0xab]

	const timeLow = (msecs & 0xffffffff).toString(16).padStart(8, '0')
	const timeMid = ((msecs / 0x100000000) & 0xffff).toString(16).padStart(4, '0')
	const timeHi = (((msecs / 0x1000000000000) & 0x0fff) | 0x1000).toString(16).padStart(4, '0')
	const clockSeqHi = ((clockseq >> 8) | 0x80).toString(16).padStart(2, '0')
	const clockSeqLow = (clockseq & 0xff).toString(16).padStart(2, '0')
	const nodeStr = node.map((b) => b.toString(16).padStart(2, '0')).join('')

	return `${timeLow}-${timeMid}-${timeHi}-${clockSeqHi}${clockSeqLow}-${nodeStr}`
}

export function generateV4Uuid(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID()
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}
