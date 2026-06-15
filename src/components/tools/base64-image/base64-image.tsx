import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DecodeTab } from './decode-tab'
import { EncodeTab } from './encode-tab'

export default function Base64Image() {
	const [activeTab, setActiveTab] = useState<string>('encode')

	return (
		<div className="flex flex-col gap-4">
			<Tabs value={activeTab} onValueChange={setActiveTab} variant="contained" size="lg">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="encode">Image to Base64</TabsTrigger>
					<TabsTrigger value="decode">Base64 to Image</TabsTrigger>
				</TabsList>
			</Tabs>

			{activeTab === 'encode' ? (
				<EncodeTab onFileChange={() => {}} className="flex-1" />
			) : (
				<DecodeTab className="flex-1" />
			)}
		</div>
	)
}
