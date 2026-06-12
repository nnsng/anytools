import { useState } from 'react'
import { Tabs } from '@/components/ui/tabs'
import { DecodeTab } from './decode-tab'
import { EncodeTab } from './encode-tab'

export default function Base64Image() {
	const [activeTab, setActiveTab] = useState<string>('encode')

	return (
		<div className="space-y-4 font-mono">
			<Tabs
				tabs={[
					{ id: 'encode', label: 'Image to Base64' },
					{ id: 'decode', label: 'Base64 to Image' },
				]}
				activeTab={activeTab}
				onChange={setActiveTab}
			/>

			{activeTab === 'encode' ? <EncodeTab onFileChange={() => {}} /> : <DecodeTab />}
		</div>
	)
}
