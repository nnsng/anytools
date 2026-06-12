import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DecodeTab } from './decode-tab'
import { EncodeTab } from './encode-tab'

export default function Base64Image() {
	const [activeTab, setActiveTab] = useState<string>('encode')

	return (
		<div className="flex flex-col gap-4 font-mono">
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value="encode">Image to Base64</TabsTrigger>
					<TabsTrigger value="decode">Base64 to Image</TabsTrigger>
				</TabsList>
			</Tabs>

			{activeTab === 'encode' ? <EncodeTab onFileChange={() => {}} /> : <DecodeTab />}
		</div>
	)
}
