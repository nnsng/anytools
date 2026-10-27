import { cn } from '@/lib/utils'

type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type CodeBlockProps = Omit<DivProps, 'children'> & {
	value?: string
	placeholder?: string
}

export function CodeBlock(props: CodeBlockProps) {
	const { className, value, placeholder = 'Waiting for input...', ...rest } = props

	if (!value) {
		return (
			<div
				className="flex grow items-center justify-center font-mono text-xs text-slate-600 select-none"
				{...rest}
			>
				{placeholder}
			</div>
		)
	}

	return (
		<div className={cn('cursor-text p-4 font-mono', className)} {...rest}>
			<pre>
				<code>{value}</code>
			</pre>
		</div>
	)
}
