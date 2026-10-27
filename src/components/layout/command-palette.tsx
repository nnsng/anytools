import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { TOOLS } from '@/utils/tools-registry'

type CommandPaletteProps = {
	className?: string
}

export function CommandPalette({ className }: CommandPaletteProps) {
	const navigate = useNavigate()

	const [open, setOpen] = useState(false)
	const [isMac, setIsMac] = useState(false)

	useEffect(() => {
		// Safe check for browser environment
		if (typeof window !== 'undefined') {
			setIsMac(/Mac|iPhone|iPod|iPad/i.test(navigator.userAgent))
		}
	}, [])

	// Listen for Cmd+K or Ctrl+K to open search command palette
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === 'k' && ((isMac && e.metaKey) || (!isMac && e.ctrlKey))) {
				e.preventDefault()
				setOpen((prev) => !prev)
			}
			if (e.key === 'Escape') {
				setOpen(false)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isMac])

	const handleClose = () => {
		setOpen(false)
	}

	const handleSelect = (toolId: string) => {
		void navigate({ to: '/tools/$toolId', params: { toolId } })
		handleClose()
	}

	return (
		<>
			<div className={cn('flex items-center gap-4', className)}>
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="border-terminal-border bg-terminal-bg hover:border-matrix/40 flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 font-mono text-xs text-slate-500 transition-all duration-150"
				>
					<Search className="h-3.5 w-3.5" />
					<span className="hidden sm:inline">Search modules...</span>
					<kbd className="border-terminal-border bg-terminal-card hidden rounded border px-1.5 py-0.5 text-xs text-slate-400 lg:block">
						{isMac ? '⌘K' : 'Ctrl+K'}
					</kbd>
				</button>
			</div>

			<CommandDialog
				open={open}
				onOpenChange={handleClose}
				title="System Registry Index"
				className="sm:max-w-2xl"
			>
				<CommandInput placeholder="Search modules (e.g. base64, unix, diff)..." />
				<CommandList>
					<CommandEmpty>No matching modules found.</CommandEmpty>
					<CommandGroup heading="System Registry Index">
						{TOOLS.map((tool) => (
							<CommandItem
								key={tool.id}
								value={tool.name}
								onSelect={() => handleSelect(tool.id)}
								className="cursor-pointer"
							>
								<div className="flex items-center gap-3">
									{React.createElement(tool.icon, {
										className: 'w-4 h-4 text-matrix text-glow',
									})}
									<div>
										<div className="font-mono text-xs font-bold">{tool.name}</div>
										<div className="text-xs text-slate-500">{tool.description}</div>
									</div>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	)
}
