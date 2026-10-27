import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { BorderBox } from '@/components/tools/shared'
import { EditorPane } from '@/components/tools/shared/editor-pane'
import { Input } from '@/components/ui/input'

import { decodeJwt, type SignatureStatus, verifyJwtSignature } from './utils'

const SIGNATURE_VIEW: Record<SignatureStatus, { label: string; className: string; isOk: boolean }> =
	{
		valid: { label: 'Signature Verified', className: 'text-matrix', isOk: true },
		invalid: { label: 'Signature Invalid', className: 'text-red-500', isOk: false },
		unchecked: {
			label: 'Signature Unverified (No Secret)',
			className: 'text-slate-500',
			isOk: false,
		},
		unsupported: {
			label: 'Unsupported Alg (HMAC only)',
			className: 'text-yellow-500',
			isOk: false,
		},
		error: { label: 'Verification Failed', className: 'text-red-500', isOk: false },
	}

export function JwtDecodeTab() {
	const [encodedToken, setEncodedToken] = useState<string>('')
	const [secret, setSecret] = useState<string>('')
	const [signatureStatus, setSignatureStatus] = useState<SignatureStatus>('unchecked')

	const { decoded, error } = useMemo(
		() => decodeJwt(encodedToken, Math.floor(Date.now() / 1000)),
		[encodedToken],
	)

	useEffect(() => {
		if (!decoded) {
			setSignatureStatus('unchecked')
			return
		}
		let isCancelled = false
		void verifyJwtSignature(encodedToken, secret).then((status) => {
			if (!isCancelled) setSignatureStatus(status)
		})
		return () => {
			isCancelled = true
		}
	}, [decoded, encodedToken, secret])

	const signatureView = SIGNATURE_VIEW[signatureStatus]
	const status = decoded?.status

	return (
		<div className="flex h-full flex-1 flex-col gap-6 lg:flex-row">
			{/* Left: Input encoded token */}
			<div className="flex flex-col gap-6 lg:flex-1">
				<EditorPane
					title="Encoded Token"
					value={encodedToken}
					onChange={setEncodedToken}
					placeholder="Paste your JWT encoded string here (header.payload.signature)..."
					allowUpload={true}
					error={error}
					className="flex-1"
				/>

				{status && (
					<BorderBox className="space-y-3 p-4 text-xs">
						<div className="flex items-center gap-2 font-bold tracking-wider uppercase">
							{status.isExpired ? (
								<>
									<ShieldAlert className="h-4 w-4 text-red-500" />
									<span className="text-red-500">EXPIRED / INVALID</span>
								</>
							) : (
								<>
									<ShieldCheck className="text-matrix h-4 w-4" />
									<span className="text-matrix">ACTIVE / WELL-FORMED</span>
								</>
							)}
						</div>
						<div className="border-terminal-border grid grid-cols-2 gap-2 border-t pt-2 text-xs text-slate-400">
							<div>
								<span className="font-bold text-slate-500">ALGORITHM:</span> {status.alg}
							</div>
							{status.iatTime && (
								<div>
									<span className="font-bold text-slate-500">ISSUED AT:</span> {status.iatTime}
								</div>
							)}
							{status.expTime && (
								<div className="col-span-2">
									<span className="font-bold text-slate-500">EXPIRATION:</span> {status.expTime}
								</div>
							)}
						</div>
					</BorderBox>
				)}

				{status && (
					<BorderBox className="space-y-3 p-4 text-xs">
						<span className="block font-bold tracking-wider text-slate-300 uppercase">
							Verify Signature
						</span>
						<div className="space-y-1">
							<label htmlFor="dec-secret" className="text-xs font-bold text-slate-500 uppercase">
								Verification Key / Secret
							</label>
							<Input
								id="dec-secret"
								type="text"
								value={secret}
								onChange={(e) => setSecret(e.target.value)}
								placeholder="Enter secret to verify signature..."
								className="border-terminal-border text-foreground h-8 font-mono text-xs"
							/>
						</div>
						<div
							role="status"
							className="border-terminal-border flex items-center gap-2 border-t pt-2 text-xs font-bold"
						>
							{signatureView.isOk ? (
								<ShieldCheck className={`h-4 w-4 ${signatureView.className}`} />
							) : (
								<ShieldAlert className={`h-4 w-4 ${signatureView.className}`} />
							)}
							<span className={`${signatureView.className} uppercase`}>{signatureView.label}</span>
						</div>
					</BorderBox>
				)}
			</div>

			{/* Right: Output decoded header & payload */}
			<div className="flex flex-col gap-6 lg:flex-1">
				<div className="flex flex-1 flex-col gap-6">
					<EditorPane
						title="Decoded Header"
						value={decoded?.header ?? ''}
						readOnly={true}
						placeholder="Header JSON structure will appear here..."
						className="min-h-60"
					/>
					<EditorPane
						title="Decoded Payload"
						value={decoded?.payload ?? ''}
						readOnly={true}
						placeholder="Payload claims/data will appear here..."
						className="min-h-60 flex-1"
					/>
				</div>

				{decoded?.signature && (
					<BorderBox className="p-4">
						<span className="mb-2 block text-xs font-bold tracking-wider text-slate-300 uppercase">
							Signature Block (Base64URL)
						</span>
						<div className="border-terminal-border bg-terminal-bg/40 rounded border p-2 font-mono text-xs break-all text-slate-500">
							{decoded.signature}
						</div>
					</BorderBox>
				)}
			</div>
		</div>
	)
}
