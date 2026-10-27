import { Key } from 'lucide-react'
import { useState } from 'react'

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

import { base64urlEncode, signJwt } from './utils'

type EncodeAlg = 'HS256' | 'HS384' | 'HS512' | 'none'

const ALG_OPTIONS: Array<{ value: EncodeAlg; label: string }> = [
	{ value: 'HS256', label: 'HS256 (HMAC SHA-256)' },
	{ value: 'HS384', label: 'HS384 (HMAC SHA-384)' },
	{ value: 'HS512', label: 'HS512 (HMAC SHA-512)' },
	{ value: 'none', label: 'none (Unsigned)' },
]

const TOKEN_LIFETIME_SECONDS = 3600

function isEncodeAlg(value: string): value is EncodeAlg {
	return ALG_OPTIONS.some((option) => option.value === value)
}

function createDefaultPayload(): string {
	const now = Math.floor(Date.now() / 1000)
	return JSON.stringify(
		{ sub: '1234567890', name: 'John Doe', iat: now, exp: now + TOKEN_LIFETIME_SECONDS },
		null,
		2,
	)
}

/** Rewrites `alg` in the header JSON, leaving malformed JSON untouched while the user types. */
function withAlg(headerJson: string, alg: EncodeAlg): string {
	try {
		const parsed: Record<string, unknown> = JSON.parse(headerJson)
		return JSON.stringify({ ...parsed, alg }, null, 2)
	} catch {
		return headerJson
	}
}

export function JwtEncodeTab() {
	const [headerJson, setHeaderJson] = useState<string>(
		JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2),
	)
	const [payloadJson, setPayloadJson] = useState<string>(createDefaultPayload)
	const [secret, setSecret] = useState<string>('your-256-bit-secret')
	const [alg, setAlg] = useState<EncodeAlg>('HS256')
	const [encodedResult, setEncodedResult] = useState<string>('')
	const [error, setError] = useState<string | null>(null)

	const handleAlgChange = (value: string) => {
		if (!isEncodeAlg(value)) return
		setAlg(value)
		setHeaderJson((current) => withAlg(current, value))
	}

	const handleEncode = async () => {
		setError(null)
		try {
			const header = base64urlEncode(JSON.stringify({ ...JSON.parse(headerJson), alg }))
			const payload = base64urlEncode(JSON.stringify(JSON.parse(payloadJson)))
			const headerAndPayload = `${header}.${payload}`
			const signature = await signJwt(headerAndPayload, secret, alg)
			setEncodedResult(`${headerAndPayload}.${alg === 'none' ? '' : signature}`)
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			setError(`Encoding failed: ${message}. Please verify JSON structures.`)
		}
	}

	return (
		<div className="flex h-full flex-1 flex-col gap-6 lg:flex-row">
			{/* Configuration and Input Panels */}
			<div className="flex flex-col gap-6 lg:flex-1">
				<div className="flex flex-1 flex-col gap-6">
					<EditorPane
						title="Header JSON"
						value={headerJson}
						onChange={setHeaderJson}
						placeholder="Edit header JSON..."
						className="min-h-60"
					/>
					<EditorPane
						title="Payload JSON"
						value={payloadJson}
						onChange={setPayloadJson}
						placeholder="Edit payload claims..."
						className="min-h-60 flex-1"
					/>
				</div>

				{/* Signing Options */}
				<BorderBox className="space-y-4 p-4 text-xs">
					<span className="flex items-center gap-2 font-bold tracking-wider text-slate-300 uppercase">
						<Key className="text-matrix h-4 w-4" />
						Signing Credentials
					</span>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-1">
							<label htmlFor="sig-alg" className="font-bold text-slate-500 uppercase">
								Signature Algorithm
							</label>
							<Select value={alg} onValueChange={handleAlgChange}>
								<SelectTrigger
									id="sig-alg"
									className="border-terminal-border h-8 font-mono text-xs"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-terminal-border bg-terminal-card font-mono text-xs">
									{ALG_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{alg !== 'none' && (
							<div className="space-y-1">
								<label htmlFor="sig-secret" className="font-bold text-slate-500 uppercase">
									Secret Key
								</label>
								<Input
									id="sig-secret"
									type="text"
									value={secret}
									onChange={(e) => setSecret(e.target.value)}
									placeholder="Secret key..."
									className="border-terminal-border text-foreground h-8 font-mono text-xs"
								/>
							</div>
						)}
					</div>

					<Button onClick={handleEncode} className="h-9 w-full text-xs font-bold">
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
				error={error}
				className="flex-1"
			/>
		</div>
	)
}
