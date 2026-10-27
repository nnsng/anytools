import { useCallback, useEffect, useRef, useState } from 'react'

import { COPY_RESET_MS } from '@/constants/app'

const DEFAULT_KEY = 'default'

/** Copies text to the clipboard and tracks which key was copied for COPY_RESET_MS. */
export function useCopyToClipboard() {
	const [copiedKey, setCopiedKey] = useState<string | null>(null)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

	useEffect(() => () => clearTimeout(timeoutRef.current), [])

	const copy = useCallback(async (text: string, key: string = DEFAULT_KEY) => {
		if (!text) return false
		try {
			await navigator.clipboard.writeText(text)
		} catch {
			// clipboard is unavailable (insecure context or permission denied)
			return false
		}
		setCopiedKey(key)
		clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => setCopiedKey(null), COPY_RESET_MS)
		return true
	}, [])

	return { copiedKey, isCopied: copiedKey !== null, copy }
}
