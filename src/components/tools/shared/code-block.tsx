import { cn } from '@/lib/utils'

type CodeBlockProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function CodeBlock({ className, children, ...props }: CodeBlockProps) {
	return (
		<div className={cn('cursor-text p-4 font-mono', className)} {...props}>
			<pre>
				<code>{children}</code>
			</pre>
		</div>
	)
}
