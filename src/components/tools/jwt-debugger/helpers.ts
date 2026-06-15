// Base64URL encoding helpers
export function base64urlEncode(source: string | ArrayBuffer): string {
	let binary = ''
	if (typeof source === 'string') {
		binary = btoa(unescape(encodeURIComponent(source)))
	} else {
		const bytes = new Uint8Array(source)
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i])
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
	} catch (_e) {
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
	const cryptoKey = await window.crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'HMAC', hash: { name: hashName } },
		false,
		['sign'],
	)
	const signatureBuffer = await window.crypto.subtle.sign(
		'HMAC',
		cryptoKey,
		encoder.encode(headerAndPayload),
	)
	return base64urlEncode(signatureBuffer)
}
