import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DecodeTab } from './decode-tab'
import { EncodeTab } from './encode-tab'

export default function Base64Image() {
	const [activeTab, setActiveTab] = useState<string>('encode')

	return (
		<div className="flex flex-col gap-4">
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2 border-terminal-border bg-terminal-bg/40 p-1">
					<TabsTrigger
						value="encode"
						className="border-none font-bold text-xs uppercase data-[state=active]:bg-matrix data-[state=active]:text-black"
					>
						Image to Base64
					</TabsTrigger>
					<TabsTrigger
						value="decode"
						className="border-none font-bold text-xs uppercase data-[state=active]:bg-matrix data-[state=active]:text-black"
					>
						Base64 to Image
					</TabsTrigger>
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
