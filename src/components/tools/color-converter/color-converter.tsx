import { useState } from 'react'
import { ColorCanvas } from './color-canvas'
import { ColorFields } from './color-fields'
import { rgbToCmyk, rgbToHex, rgbToHsl } from './color-utils'

export default function ColorConverter() {
	const [hex, setHex] = useState<string>('#22c55e')
	const [rgb, setRgb] = useState<string>('rgb(34, 197, 94)')
	const [hsl, setHsl] = useState<string>('hsl(142, 71%, 45%)')
	const [cmyk, setCmyk] = useState<string>('cmyk(83%, 0%, 52%, 23%)')

	const updateAllFromRgb = (r: number, g: number, b: number) => {
		const hslVal = rgbToHsl(r, g, b)
		const cmykVal = rgbToCmyk(r, g, b)
		setHex(rgbToHex(r, g, b))
		setRgb(`rgb(${r}, ${g}, ${b})`)
		setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`)
		setCmyk(`cmyk(${cmykVal.c}%, ${cmykVal.m}%, ${cmykVal.y}%, ${cmykVal.k}%)`)
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-6 font-mono lg:grid-cols-12">
			<ColorCanvas hex={hex} onColorChange={updateAllFromRgb} />
			<ColorFields
				hex={hex}
				rgb={rgb}
				hsl={hsl}
				cmyk={cmyk}
				setHex={setHex}
				setRgb={setRgb}
				setHsl={setHsl}
				setCmyk={setCmyk}
				updateAllFromRgb={updateAllFromRgb}
			/>
		</div>
	)
}
