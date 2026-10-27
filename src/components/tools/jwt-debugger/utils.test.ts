import { describe, expect, it } from 'vite-plus/test'

import { base64urlDecode, base64urlEncode } from './utils'

describe('base64url', () => {
	it('encodes without padding or url-unsafe characters', () => {
		expect(base64urlEncode('subjects?_')).not.toMatch(/[+/=]/)
	})

	it('round-trips unicode text', () => {
		expect(base64urlDecode(base64urlEncode('héllo ✓'))).toBe('héllo ✓')
	})
})
