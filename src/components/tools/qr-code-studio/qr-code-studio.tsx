import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { QrGenerateTab } from './qr-generate-tab'
import { QrScanTab } from './qr-scan-tab'

type TabType = 'generate' | 'scan'

function isTabType(value: string): value is TabType {
	return value === 'generate' || value === 'scan'
}

export default function QrCodeStudio() {
	const [activeTab, setActiveTab] = useState<TabType>('generate')

	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => {
				if (isTabType(value)) setActiveTab(value)
			}}
			className="gap-4"
		>
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="generate">QR Generator</TabsTrigger>
				<TabsTrigger value="scan">QR Scanner</TabsTrigger>
			</TabsList>

			<TabsContent value="generate" className="mt-0">
				<QrGenerateTab />
			</TabsContent>
			<TabsContent value="scan" className="mt-0">
				<QrScanTab />
			</TabsContent>
		</Tabs>
	)
}
