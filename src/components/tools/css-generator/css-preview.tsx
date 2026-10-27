import type { CSSProperties } from 'react'
import { useState } from 'react'

import { ColorField } from '@/components/tools/shared/color-field'
import { Pane } from '@/components/tools/shared/pane'
import { useThemeContext } from '@/contexts/theme-context'

// Neutral surfaces so shadows and gradients stay visible in either theme
const DEFAULT_BACKGROUND = { dark: '#0e1117', light: '#f1f5f9' } as const

type CssPreviewProps = {
	/** Style applied to the sample box. */
	style: CSSProperties
}

export function CssPreview({ style }: CssPreviewProps) {
	const { theme } = useThemeContext()
	// null means "not customised": the surface follows the theme
	const [override, setOverride] = useState<string | null>(null)
	const background = override ?? DEFAULT_BACKGROUND[theme]

	return (
		<Pane title="Preview">
			<div className="flex flex-col gap-4 p-6">
				<div
					className="border-terminal-border flex min-h-56 items-center justify-center rounded border"
					style={{ backgroundColor: background }}
				>
					<div className="h-32 w-32 rounded-lg" style={style} role="img" aria-label="CSS preview" />
				</div>
				<ColorField
					id="preview-background"
					label="Preview background"
					value={background}
					onChange={setOverride}
				/>
			</div>
		</Pane>
	)
}
