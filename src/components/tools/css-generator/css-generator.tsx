import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BoxShadowTab } from './box-shadow-tab'
import { GradientTab } from './gradient-tab'
import { UnitsTab } from './units-tab'

type TabType = 'box-shadow' | 'gradient' | 'units'

function isTabType(value: string): value is TabType {
	return value === 'box-shadow' || value === 'gradient' || value === 'units'
}

const HIDE_WHEN_INACTIVE = 'mt-0 data-[state=inactive]:hidden'

export default function CssGenerator() {
	const [activeTab, setActiveTab] = useState<TabType>('box-shadow')

	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => {
				if (isTabType(value)) setActiveTab(value)
			}}
			className="gap-4"
		>
			<TabsList className="grid w-full grid-cols-3">
				<TabsTrigger value="box-shadow">Box Shadow</TabsTrigger>
				<TabsTrigger value="gradient">Gradient</TabsTrigger>
				<TabsTrigger value="units">Units & clamp()</TabsTrigger>
			</TabsList>

			{/* forceMount keeps each tab's settings when switching, hidden while inactive */}
			<TabsContent value="box-shadow" forceMount className={HIDE_WHEN_INACTIVE}>
				<BoxShadowTab />
			</TabsContent>
			<TabsContent value="gradient" forceMount className={HIDE_WHEN_INACTIVE}>
				<GradientTab />
			</TabsContent>
			<TabsContent value="units" forceMount className={HIDE_WHEN_INACTIVE}>
				<UnitsTab />
			</TabsContent>
		</Tabs>
	)
}
