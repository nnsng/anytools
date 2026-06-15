'use client'

import { cva } from 'class-variance-authority'
import { Tabs as TabsPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

const TabsContext = React.createContext<{
	variant?: 'default' | 'contained'
	size?: 'sm' | 'lg'
}>({
	variant: 'default',
	size: 'sm',
})

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
	variant?: 'default' | 'contained'
	size?: 'sm' | 'lg'
}

function Tabs({
	className,
	orientation = 'horizontal',
	variant = 'default',
	size = 'sm',
	...props
}: TabsProps) {
	return (
		<TabsContext.Provider value={{ variant, size }}>
			<TabsPrimitive.Root
				data-slot="tabs"
				data-orientation={orientation}
				className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
				{...props}
			/>
		</TabsContext.Provider>
	)
}

const tabsListVariants = cva(
	'group/tabs-list inline-flex w-fit items-center justify-center rounded-xs text-muted-foreground border border-terminal-border group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col',
	{
		variants: {
			variant: {
				default: 'bg-terminal-bg/80',
				contained: 'bg-terminal-bg/40',
			},
			size: {
				sm: 'group-data-horizontal/tabs:h-8 p-[2px]',
				lg: 'group-data-horizontal/tabs:h-10 p-1',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'sm',
		},
	},
)

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
	const { variant, size } = React.useContext(TabsContext)
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			data-variant={variant}
			className={cn(tabsListVariants({ variant, size }), className)}
			{...props}
		/>
	)
}

const tabsTriggerVariants = cva(
	"relative inline-flex h-full flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xs font-bold font-mono text-tab-text text-xs transition-colors hover:text-tab-text-hover focus-visible:border-ring focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 tabs-list:data-active:shadow-none",
	{
		variants: {
			variant: {
				default:
					'border border-transparent data-active:border data-active:border-terminal-border/40 data-active:bg-matrix/10 data-active:text-matrix-glow data-active:hover:text-matrix-glow',
				contained:
					'uppercase data-active:bg-matrix data-active:text-black data-active:hover:text-black',
			},
			size: {
				sm: 'px-2.5 py-0.5',
				lg: 'px-4 py-1.5 tracking-wider',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'sm',
		},
	},
)

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	const { variant, size } = React.useContext(TabsContext)
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				tabsTriggerVariants({ variant, size }),
				'after:absolute after:bg-matrix after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-horizontal/tabs:after:-bottom-1.25 group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:w-0.5',
				className,
			)}
			{...props}
		/>
	)
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn('flex-1 text-sm outline-none', className)}
			{...props}
		/>
	)
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger }
