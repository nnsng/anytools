import { Pane } from '@/components/tools/shared/pane'
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
	className?: string
}

export function RegexInput(props: RegexInputProps) {
	const { pattern, setPattern, flags, handleFlagToggle, regexError, className } = props

	return (
		<Pane title="RegExp Expression" className={className}>
			<div className="space-y-4 p-6">
				<div className="flex flex-col items-stretch gap-4 md:flex-row">
					<div className="border-terminal-border bg-terminal-bg flex flex-1 items-center rounded-sm border px-3">
						<span className="mr-2 font-bold text-slate-500">/</span>
						<Input
							type="text"
							value={pattern}
							onChange={(e) => setPattern(e.target.value)}
							placeholder="e.g. ([a-zA-Z]+)"
							className="text-foreground placeholder:text-muted-foreground w-full border-none bg-transparent py-2.5 text-sm focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
						/>
						<span className="ml-2 font-bold text-slate-500">/</span>
					</div>

					<div className="border-terminal-border bg-terminal-bg/30 flex flex-wrap items-center gap-2 rounded border p-2">
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
										'text-xs font-bold transition-all duration-100',
										active
											? 'border-matrix bg-matrix text-terminal-bg hover:bg-matrix/80 hover:text-terminal-bg font-bold shadow-[0_0_6px_rgba(34,197,94,0.3)]'
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
					<p className="rounded border border-red-500/20 bg-red-950/20 p-2 text-xs text-red-400">
						{regexError}
					</p>
				)}
			</div>
		</Pane>
	)
}
