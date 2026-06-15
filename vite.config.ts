import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackRouter({ target: 'react', autoCodeSplitting: true }),
		viteReact(),
	],
	build: {
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('@faker-js')) {
						return 'faker-vendor'
					}
					if (id.includes('node_modules/react') || id.includes('@tanstack')) {
						return 'core-vendor'
					}
				},
			},
		},
	},
})

export default config
