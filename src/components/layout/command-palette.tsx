import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { TOOLS } from '@/utils/tools-registry'

type CommandPaletteProps = {
	open: boolean
	onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
	const navigate = useNavigate()

	const handleSelect = (toolId: string) => {
		navigate({ to: '/tools/$toolId', params: { toolId } })
		onClose()
	}

	if (!open) return null

	return (
		<CommandDialog
			open={open}
			onOpenChange={onClose}
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
									<div className="font-bold font-mono text-xs">{tool.name}</div>
									<div className="text-[10px] text-slate-500">{tool.description}</div>
								</div>
							</div>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	)
}
