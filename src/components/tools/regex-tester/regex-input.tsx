import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type RegexFlags = {
	g: boolean
	i: boolean
	m: boolean
	s: boolean
	u: boolean
	y: boolean
}

type RegexInputProps = {
	pattern: string
	setPattern: (val: string) => void
	flags: RegexFlags
	handleFlagToggle: (flag: keyof RegexFlags) => void
	regexError: string | null
}

export function RegexInput({
	pattern,
	setPattern,
	flags,
	handleFlagToggle,
	regexError,
}: RegexInputProps) {
	return (
		<div className="space-y-4 rounded-sm border border-terminal-border bg-terminal-card/60 p-6 lg:col-span-12">
			<span className="flex items-center gap-2 font-bold text-slate-300 text-xs uppercase tracking-wider">
				<span className="h-1.5 w-1.5 rounded-full bg-matrix" />
				RegExp Expression
			</span>

			<div className="flex flex-col items-stretch gap-4 md:flex-row">
				<div className="flex flex-1 items-center rounded-sm border border-terminal-border bg-terminal-bg px-3">
					<span className="mr-2 font-bold text-slate-500">/</span>
					<Input
						type="text"
						value={pattern}
						onChange={(e) => setPattern(e.target.value)}
						placeholder="e.g. ([a-zA-Z]+)"
						className="w-full border-none bg-transparent py-2.5 text-sm text-white placeholder-slate-700 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
					/>
					<span className="ml-2 font-bold text-slate-500">/</span>
				</div>

				<div className="flex flex-wrap items-center gap-2 rounded border border-terminal-border bg-terminal-bg/30 px-3 py-1">
					{Object.keys(flags).map((flag) => {
						const active = flags[flag as keyof RegexFlags]
						return (
							<Button
								key={flag}
								type="button"
								variant={active ? 'default' : 'outline'}
								size="xs"
								onClick={() => handleFlagToggle(flag as keyof RegexFlags)}
								className={cn(
									'font-bold text-xs transition-all duration-100',
									active
										? 'border-matrix bg-matrix font-bold text-terminal-bg shadow-[0_0_6px_rgba(34,197,94,0.3)] hover:bg-matrix/80 hover:text-terminal-bg'
										: 'border-terminal-border text-slate-500 hover:text-slate-300',
								)}
								title={`Flag: ${flag}`}
							>
								{flag}
							</Button>
						)
					})}
				</div>
			</div>

			{regexError && (
				<p className="rounded border border-red-500/20 bg-red-950/20 p-2 text-red-400 text-xs">
					{regexError}
				</p>
			)}
		</div>
	)
}
