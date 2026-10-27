// Base64URL encoding helpers
export function base64urlEncode(source: string | ArrayBuffer): string {
	let binary = ''
	if (typeof source === 'string') {
		binary = btoa(unescape(encodeURIComponent(source)))
	} else {
		const bytes = new Uint8Array(source)
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i] ?? 0)
		}
		binary = btoa(binary)
	}
	return binary.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

// Base64URL decoding helper
export function base64urlDecode(str: string): string {
	let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
	while (base64.length % 4) {
		base64 += '='
	}
	try {
		return decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
				.join(''),
		)
	} catch {
		// Fallback for non-utf8
		return atob(base64)
	}
}

// HMAC Web Crypto Signature
export async function signJwt(
	headerAndPayload: string,
	secret: string,
	alg: string,
): Promise<string> {
	if (alg === 'none') return ''

	let hashName = 'SHA-256'
	if (alg === 'HS384') hashName = 'SHA-384'
	else if (alg === 'HS512') hashName = 'SHA-512'

	const encoder = new TextEncoder()
	const keyData = encoder.encode(secret)
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'HMAC', hash: { name: hashName } },
		false,
		['sign'],
	)
	const signatureBuffer = await crypto.subtle.sign(
		'HMAC',
		cryptoKey,
		encoder.encode(headerAndPayload),
	)
	return base64urlEncode(signatureBuffer)
}

export type JwtHeader = { alg?: string; typ?: string; [claim: string]: unknown }
export type JwtPayload = { iat?: number; exp?: number; [claim: string]: unknown }

export type TokenStatus = {
	isExpired: boolean
	message: string
	expTime?: string
	iatTime?: string
	alg: string
}

export type SignatureStatus = 'valid' | 'invalid' | 'unchecked' | 'unsupported' | 'error'

export type DecodedJwt = {
	header: string
	payload: string
	signature: string
	status: TokenStatus
}

export type DecodeJwtResult = { decoded: DecodedJwt | null; error: string | null }

export const HMAC_ALGORITHMS = ['HS256', 'HS384', 'HS512']

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseJsonObject(text: string): Record<string, unknown> {
	const parsed: unknown = JSON.parse(text)
	if (!isRecord(parsed)) throw new Error('Expected a JSON object')
	return parsed
}

/** Analyses the standard time claims. `nowSeconds` is injectable so the result is testable. */
export function analyzeClaims(
	header: JwtHeader,
	payload: JwtPayload,
	nowSeconds: number,
): TokenStatus {
	const status: TokenStatus = {
		isExpired: false,
		message: 'Token structure is well-formed.',
		alg: header.alg || 'unknown',
	}

	if (payload.iat) status.iatTime = new Date(payload.iat * 1000).toLocaleString()

	if (payload.exp) {
		status.expTime = new Date(payload.exp * 1000).toLocaleString()
		status.isExpired = nowSeconds > payload.exp
		status.message = status.isExpired ? 'Token has expired.' : 'Token is active.'
	}

	return status
}

export function decodeJwt(token: string, nowSeconds: number): DecodeJwtResult {
	if (!token.trim()) return { decoded: null, error: null }

	const parts = token.split('.')
	const [headerPart, payloadPart, signature] = parts
	if (parts.length !== 3 || headerPart === undefined || payloadPart === undefined) {
		return {
			decoded: null,
			error: 'Invalid JWT: A standard JWT token must consist of 3 parts separated by dots.',
		}
	}

	try {
		const header = parseJsonObject(base64urlDecode(headerPart)) as JwtHeader
		const payload = parseJsonObject(base64urlDecode(payloadPart)) as JwtPayload

		return {
			decoded: {
				header: JSON.stringify(header, null, 2),
				payload: JSON.stringify(payload, null, 2),
				signature: signature ?? '',
				status: analyzeClaims(header, payload, nowSeconds),
			},
			error: null,
		}
	} catch (err) {
		return {
			decoded: null,
			error: `Decoding failed: ${err instanceof Error ? err.message : String(err)}`,
		}
	}
}

export async function verifyJwtSignature(token: string, secret: string): Promise<SignatureStatus> {
	const [headerPart, payloadPart, signature] = token.split('.')
	if (!secret.trim() || headerPart === undefined || payloadPart === undefined) return 'unchecked'

	let alg = ''
	try {
		const headerAlg = parseJsonObject(base64urlDecode(headerPart)).alg
		alg = typeof headerAlg === 'string' ? headerAlg : ''
	} catch {
		return 'unchecked'
	}
	if (!HMAC_ALGORITHMS.includes(alg)) return 'unsupported'

	try {
		const expected = await signJwt(`${headerPart}.${payloadPart}`, secret, alg)
		return expected === signature ? 'valid' : 'invalid'
	} catch {
		return 'error'
	}
}
