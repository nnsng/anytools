import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { JwtDecodeTab } from './jwt-decode-tab'
import { JwtEncodeTab } from './jwt-encode-tab'

type TabType = 'decode' | 'encode'

function isTabType(value: string): value is TabType {
	return value === 'decode' || value === 'encode'
}

export default function JwtDebugger() {
	const [activeTab, setActiveTab] = useState<TabType>('decode')

	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => {
				if (isTabType(value)) setActiveTab(value)
			}}
			className="gap-4"
		>
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="decode">JWT Decoder</TabsTrigger>
				<TabsTrigger value="encode">JWT Encoder</TabsTrigger>
			</TabsList>

			{/* forceMount keeps each tab's input when switching, hidden while inactive */}
			<TabsContent value="decode" forceMount className="data-[state=inactive]:hidden">
				<JwtDecodeTab />
			</TabsContent>
			<TabsContent value="encode" forceMount className="mt-0 data-[state=inactive]:hidden">
				<JwtEncodeTab />
			</TabsContent>
		</Tabs>
	)
}
