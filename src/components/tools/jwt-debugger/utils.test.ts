import { describe, expect, it } from 'vite-plus/test'

import {
	analyzeClaims,
	base64urlDecode,
	base64urlEncode,
	decodeJwt,
	signJwt,
	verifyJwtSignature,
} from './utils'

describe('base64url', () => {
	it('encodes without padding or url-unsafe characters', () => {
		expect(base64urlEncode('subjects?_')).not.toMatch(/[+/=]/)
	})

	it('round-trips unicode text', () => {
		expect(base64urlDecode(base64urlEncode('héllo ✓'))).toBe('héllo ✓')
	})
})

const NOW = 1_700_000_000

function makeToken(payload: object, alg = 'HS256') {
	const header = base64urlEncode(JSON.stringify({ alg, typ: 'JWT' }))
	return `${header}.${base64urlEncode(JSON.stringify(payload))}`
}

describe('analyzeClaims', () => {
	it('flags expired tokens using the injected clock', () => {
		expect(analyzeClaims({ alg: 'HS256' }, { exp: NOW - 1 }, NOW).isExpired).toBe(true)
		expect(analyzeClaims({ alg: 'HS256' }, { exp: NOW + 1 }, NOW).isExpired).toBe(false)
	})

	it('falls back to unknown alg', () => {
		expect(analyzeClaims({}, {}, NOW).alg).toBe('unknown')
	})
})

describe('decodeJwt', () => {
	it('returns nothing for empty input', () => {
		expect(decodeJwt('  ', NOW)).toEqual({ decoded: null, error: null })
	})

	it('rejects tokens without three parts', () => {
		expect(decodeJwt('a.b', NOW).error).toContain('3 parts')
	})

	it('decodes header, payload and signature', () => {
		const { decoded } = decodeJwt(`${makeToken({ sub: '1' })}.sig`, NOW)
		expect(decoded?.signature).toBe('sig')
		expect(JSON.parse(decoded?.payload ?? '{}')).toEqual({ sub: '1' })
	})
})

describe('verifyJwtSignature', () => {
	it('verifies HMAC signatures and rejects tampered ones', async () => {
		const unsigned = makeToken({ sub: '1' })
		const signature = await signJwt(unsigned, 'secret', 'HS256')
		expect(await verifyJwtSignature(`${unsigned}.${signature}`, 'secret')).toBe('valid')
		expect(await verifyJwtSignature(`${unsigned}.${signature}`, 'wrong')).toBe('invalid')
	})

	it('reports unchecked without a secret and unsupported for non-HMAC algs', async () => {
		expect(await verifyJwtSignature(`${makeToken({})}.x`, '')).toBe('unchecked')
		expect(await verifyJwtSignature(`${makeToken({}, 'RS256')}.x`, 'secret')).toBe('unsupported')
	})
})
