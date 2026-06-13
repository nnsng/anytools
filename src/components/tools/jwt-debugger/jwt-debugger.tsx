import { Key, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BorderBox } from '@/components/tools/shared'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
async function signJwt(headerAndPayload: string, secret: string, alg: string): Promise<string> {
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

export default function JwtCodec() {
	const [activeTab, setActiveTab] = useState<'decode' | 'encode'>('decode')

	// Decoder State
	const [encodedToken, setEncodedToken] = useState<string>('')
	const [decodedHeader, setDecodedHeader] = useState<string>('')
	const [decodedPayload, setDecodedPayload] = useState<string>('')
	const [signaturePart, setSignaturePart] = useState<string>('')
	const [decodeError, setDecodeError] = useState<string | null>(null)
	const [decodeSecret, setDecodeSecret] = useState<string>('')
	const [signatureStatus, setSignatureStatus] = useState<
		'valid' | 'invalid' | 'unchecked' | 'unsupported'
	>('unchecked')
	const [tokenStatus, setTokenStatus] = useState<{
		expired: boolean
		message: string
		expTime?: string
		iatTime?: string
		alg?: string
	} | null>(null)

	// Encoder State
	const [headerJson, setHeaderJson] = useState<string>(
		JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2),
	)
	const [payloadJson, setPayloadJson] = useState<string>(
		JSON.stringify(
			{
				sub: '1234567890',
				name: 'John Doe',
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 3600,
			},
			null,
			2,
		),
	)
	const [encodeSecret, setEncodeSecret] = useState<string>('your-256-bit-secret')
	const [encodeAlg, setEncodeAlg] = useState<string>('HS256')
	const [encodedResult, setEncodedResult] = useState<string>('')
	const [encodeError, setEncodeError] = useState<string | null>(null)

	// Decode logic
	useEffect(() => {
		if (activeTab !== 'decode') return
		if (!encodedToken.trim()) {
			setDecodedHeader('')
			setDecodedPayload('')
			setSignaturePart('')
			setDecodeError(null)
			setTokenStatus(null)
			return
		}

		const parts = encodedToken.split('.')
		if (parts.length !== 3) {
			setDecodeError('Invalid JWT: A standard JWT token must consist of 3 parts separated by dots.')
			setTokenStatus(null)
			return
		}

		try {
			const headerStr = base64urlDecode(parts[0])
			const payloadStr = base64urlDecode(parts[1])
			setSignaturePart(parts[2])

			// Validate JSON format
			const parsedHeader = JSON.parse(headerStr)
			const parsedPayload = JSON.parse(payloadStr)

			setDecodedHeader(JSON.stringify(parsedHeader, null, 2))
			setDecodedPayload(JSON.stringify(parsedPayload, null, 2))
			setDecodeError(null)

			// Analyze claims
			const status: typeof tokenStatus = {
				expired: false,
				message: 'Token structure is well-formed.',
				alg: parsedHeader.alg || 'unknown',
			}

			if (parsedPayload.iat) {
				status.iatTime = new Date(parsedPayload.iat * 1000).toLocaleString()
			}
			if (parsedPayload.exp) {
				const now = Math.floor(Date.now() / 1000)
				status.expTime = new Date(parsedPayload.exp * 1000).toLocaleString()
				if (now > parsedPayload.exp) {
					status.expired = true
					status.message = 'Token has expired.'
				} else {
					status.message = 'Token is active.'
				}
			}

			setTokenStatus(status)
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : String(err)
			setDecodeError(`Decoding failed: ${errMsg}`)
			setTokenStatus(null)
		}
	}, [encodedToken, activeTab])

	// Verify signature logic
	useEffect(() => {
		if (activeTab !== 'decode') return
		if (!encodedToken.trim() || decodeError) {
			setSignatureStatus('unchecked')
			return
		}

		const parts = encodedToken.split('.')
		if (parts.length !== 3) {
			setSignatureStatus('unchecked')
			return
		}

		if (!decodeSecret.trim()) {
			setSignatureStatus('unchecked')
			return
		}

		let alg = ''
		try {
			const headerStr = base64urlDecode(parts[0])
			const parsedHeader = JSON.parse(headerStr)
			alg = parsedHeader.alg || ''
		} catch (_e) {
			setSignatureStatus('unchecked')
			return
		}

		if (!['HS256', 'HS384', 'HS512'].includes(alg)) {
			setSignatureStatus('unsupported')
			return
		}

		const headerAndPayload = `${parts[0]}.${parts[1]}`
		signJwt(headerAndPayload, decodeSecret, alg)
			.then((expectedSig) => {
				if (expectedSig === parts[2]) {
					setSignatureStatus('valid')
				} else {
					setSignatureStatus('invalid')
				}
			})
			.catch((err) => {
				console.error(err)
				setSignatureStatus('invalid')
			})
	}, [encodedToken, decodeSecret, activeTab, decodeError])

	// Sync header alg in encoder when select changes
	useEffect(() => {
		try {
			const parsed = JSON.parse(headerJson)
			if (parsed.alg !== encodeAlg) {
				parsed.alg = encodeAlg
				setHeaderJson(JSON.stringify(parsed, null, 2))
			}
		} catch (_e) {
			// ignore malformed JSON temporarily while typing
		}
	}, [encodeAlg, headerJson])

	// Encode logic
	const handleEncode = async () => {
		setEncodeError(null)
		try {
			// Validate headers & payloads
			const parsedHeader = JSON.parse(headerJson)
			const parsedPayload = JSON.parse(payloadJson)

			const headerBase64 = base64urlEncode(JSON.stringify(parsedHeader))
			const payloadBase64 = base64urlEncode(JSON.stringify(parsedPayload))

			const headerAndPayload = `${headerBase64}.${payloadBase64}`
			const signature = await signJwt(headerAndPayload, encodeSecret, encodeAlg)

			if (encodeAlg === 'none') {
				setEncodedResult(`${headerAndPayload}.`)
			} else {
				setEncodedResult(`${headerAndPayload}.${signature}`)
			}
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : String(err)
			setEncodeError(`Encoding failed: ${errMsg}. Please verify JSON structures.`)
		}
	}

	return (
		<Tabs
			value={activeTab}
			onValueChange={(v) => setActiveTab(v as 'decode' | 'encode')}
			className="gap-4"
		>
			<TabsList className="grid w-full grid-cols-2 border-terminal-border bg-terminal-bg/40 p-1">
				<TabsTrigger
					value="decode"
					className="border-none font-bold text-xs uppercase data-[state=active]:bg-matrix data-[state=active]:text-black"
				>
					JWT Decoder
				</TabsTrigger>
				<TabsTrigger
					value="encode"
					className="border-none font-bold text-xs uppercase data-[state=active]:bg-matrix data-[state=active]:text-black"
				>
					JWT Encoder
				</TabsTrigger>
			</TabsList>

			{/* DECODE TAB */}
			<TabsContent value="decode">
				<div className="flex h-full flex-1 flex-col gap-6 lg:flex-row">
					{/* Left: Input encoded token */}
					<div className="flex flex-col gap-6 lg:flex-1">
						<EditorPane
							title="Encoded Token"
							value={encodedToken}
							onChange={setEncodedToken}
							placeholder="Paste your JWT encoded string here (header.payload.signature)..."
							allowUpload={true}
							error={decodeError}
							className="flex-1"
						/>

						{tokenStatus && (
							<BorderBox className="space-y-3 p-4 text-xs">
								<div className="flex items-center gap-2 font-bold uppercase tracking-wider">
									{tokenStatus.expired ? (
										<>
											<ShieldAlert className="h-4 w-4 text-red-500" />
											<span className="text-red-500">EXPIRED / INVALID</span>
										</>
									) : (
										<>
											<ShieldCheck className="h-4 w-4 text-matrix" />
											<span className="text-matrix">ACTIVE / WELL-FORMED</span>
										</>
									)}
								</div>
								<div className="grid grid-cols-2 gap-2 border-terminal-border border-t pt-2 text-[11px] text-slate-400">
									<div>
										<span className="font-bold text-slate-500">ALGORITHM:</span> {tokenStatus.alg}
									</div>
									{tokenStatus.iatTime && (
										<div>
											<span className="font-bold text-slate-500">ISSUED AT:</span>{' '}
											{tokenStatus.iatTime}
										</div>
									)}
									{tokenStatus.expTime && (
										<div className="col-span-2">
											<span className="font-bold text-slate-500">EXPIRATION:</span>{' '}
											{tokenStatus.expTime}
										</div>
									)}
								</div>
							</BorderBox>
						)}

						{tokenStatus && (
							<BorderBox className="space-y-3 p-4 text-xs">
								<span className="block font-bold text-slate-300 uppercase tracking-wider">
									Verify Signature
								</span>
								<div className="space-y-1">
									<label
										htmlFor="dec-secret"
										className="font-bold text-[10px] text-slate-500 uppercase"
									>
										Verification Key / Secret
									</label>
									<Input
										id="dec-secret"
										type="text"
										value={decodeSecret}
										onChange={(e) => setDecodeSecret(e.target.value)}
										placeholder="Enter secret to verify signature..."
										className="h-8 border-terminal-border font-mono text-white text-xs"
									/>
								</div>
								<div className="flex items-center gap-2 border-terminal-border border-t pt-2 font-bold text-[11px]">
									{signatureStatus === 'valid' && (
										<>
											<ShieldCheck className="h-4 w-4 text-matrix" />
											<span className="text-matrix uppercase">Signature Verified</span>
										</>
									)}
									{signatureStatus === 'invalid' && (
										<>
											<ShieldAlert className="h-4 w-4 text-red-500" />
											<span className="text-red-500 uppercase">Signature Invalid</span>
										</>
									)}
									{signatureStatus === 'unchecked' && (
										<>
											<ShieldAlert className="h-4 w-4 text-slate-500" />
											<span className="text-slate-500 uppercase">
												Signature Unverified (No Secret)
											</span>
										</>
									)}
									{signatureStatus === 'unsupported' && (
										<>
											<ShieldAlert className="h-4 w-4 text-yellow-500" />
											<span className="text-yellow-500 uppercase">Unsupported Alg (HMAC only)</span>
										</>
									)}
								</div>
							</BorderBox>
						)}
					</div>

					{/* Right: Output decoded header & payload */}
					<div className="flex flex-col gap-6 lg:flex-1">
						<div className="flex flex-1 flex-col gap-6">
							<EditorPane
								title="Decoded Header"
								value={decodedHeader}
								readOnly={true}
								placeholder="Header JSON structure will appear here..."
								className="min-h-60"
							/>
							<EditorPane
								title="Decoded Payload"
								value={decodedPayload}
								readOnly={true}
								placeholder="Payload claims/data will appear here..."
								className="min-h-60 flex-1"
							/>
						</div>

						{signaturePart && (
							<BorderBox className="p-4">
								<span className="mb-2 block font-bold text-slate-300 text-xs uppercase tracking-wider">
									Signature Block (Base64URL)
								</span>
								<div className="break-all rounded border border-terminal-border bg-terminal-bg/40 p-2 font-mono text-[10px] text-slate-500">
									{signaturePart}
								</div>
							</BorderBox>
						)}
					</div>
				</div>
			</TabsContent>

			{/* ENCODE TAB */}
			<TabsContent value="encode" className="mt-0">
				<div className="flex h-full flex-1 flex-col gap-6 lg:flex-row">
					{/* Configuration and Input Panels */}
					<div className="flex flex-col gap-6 lg:flex-1">
						<div className="flex flex-1 flex-col gap-6">
							{/* Header Edit */}
							<EditorPane
								title="Header JSON"
								value={headerJson}
								onChange={setHeaderJson}
								placeholder="Edit header JSON..."
								className="min-h-60"
							/>
							{/* Payload Edit */}
							<EditorPane
								title="Payload JSON"
								value={payloadJson}
								onChange={(payloadJson) => setPayloadJson(payloadJson)}
								placeholder="Edit payload claims..."
								className="min-h-60 flex-1"
							/>
						</div>

						{/* Signing Options */}
						<BorderBox className="space-y-4 p-4 text-xs">
							<span className="flex items-center gap-2 font-bold text-slate-300 uppercase tracking-wider">
								<Key className="h-4 w-4 text-matrix" />
								Signing Credentials
							</span>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-1">
									<label htmlFor="sig-alg" className="font-bold text-slate-500 uppercase">
										Signature Algorithm
									</label>
									<Select value={encodeAlg} onValueChange={setEncodeAlg}>
										<SelectTrigger
											id="sig-alg"
											className="h-8 border-terminal-border font-mono text-xs"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
											<SelectItem value="HS256">HS256 (HMAC SHA-256)</SelectItem>
											<SelectItem value="HS384">HS384 (HMAC SHA-384)</SelectItem>
											<SelectItem value="HS512">HS512 (HMAC SHA-512)</SelectItem>
											<SelectItem value="none">none (Unsigned)</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{encodeAlg !== 'none' && (
									<div className="space-y-1">
										<label htmlFor="sig-secret" className="font-bold text-slate-500 uppercase">
											Secret Key
										</label>
										<Input
											id="sig-secret"
											type="text"
											value={encodeSecret}
											onChange={(e) => setEncodeSecret(e.target.value)}
											placeholder="Secret key..."
											className="h-8 border-terminal-border font-mono text-white text-xs"
										/>
									</div>
								)}
							</div>

							<Button onClick={handleEncode} className="h-9 w-full font-bold text-xs">
								ENCODE AND SIGN TOKEN
							</Button>
						</BorderBox>
					</div>

					{/* Right Result Panel */}
					<EditorPane
						title="Encoded Token Output"
						value={encodedResult}
						readOnly={true}
						placeholder="Click Encode and Sign Token to produce a valid JWT string..."
						allowDownload={true}
						downloadFileName="token.txt"
						error={encodeError}
						className="flex-1"
					/>
				</div>
			</TabsContent>
		</Tabs>
	)
}
