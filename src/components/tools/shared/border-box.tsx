import { cn } from '@/lib/utils'

type BorderBoxProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function BorderBox({ className, ...props }: BorderBoxProps) {
	return (
		<div
			className={cn(
				'border-terminal-border bg-terminal-card/40 overflow-hidden rounded-sm border p-4',
				className,
			)}
			{...props}
		/>
	)
}
